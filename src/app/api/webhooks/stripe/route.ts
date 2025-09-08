import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingFormData } from "@/lib/validation/BookFormData";
import { Currency } from "@/lib/utils/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Parse booking data from metadata
      const bookingData: BookingFormData = JSON.parse(
        session.metadata?.bookingData || "{}",
      );
      const participantCount = parseInt(
        session.metadata?.participantCount || "0",
      );

      // Calculate counts for email
      const soloCount =
        bookingData.participants?.filter(
          (p: { soloOccupancy: boolean }) => p.soloOccupancy,
        ).length + (bookingData.soloOccupancy ? 1 : 0) || 0;

      // Transform Stripe data for our standardized booking API
      const bookingRequest = {
        bookingData: bookingData as BookingFormData,
        totalPeople: participantCount,
        soloCount,
        grandTotal: (session.amount_total as number) / 100, // Convert from cents
        currency: (session.currency || "EUR").toUpperCase() as Currency,
        bookingRef: session.id, // Use Stripe session ID as booking reference
        paymentStatus: "completed" as const,
      };

      // Call our centralized booking API
      console.log("Processing booking through centralized API...");
      try {
        const bookingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingRequest),
          },
        );

        const result = await bookingResponse.json();

        if (!result.success) {
          console.error("Failed to process booking through API:", result.error);
        } else {
          console.log(
            "Booking processed successfully via API:",
            result.tourReference,
          );
        }
      } catch (error) {
        console.error("Error calling booking API from webhook:", error);
        console.error(
          "CRITICAL: Booking processing failed for Stripe session:",
          session.id,
        );
        console.error(
          "Manual intervention required - booking data:",
          JSON.stringify(bookingRequest),
        );

        // Do NOT duplicate business logic here - log for manual processing
        // The booking API should be the single source of truth for all processing
      }
    } catch (error) {
      console.error("Error processing checkout session:", error);
    }
  }

  return NextResponse.json({ received: true });
}
