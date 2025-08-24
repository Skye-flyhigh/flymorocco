import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  sendBookingConfirmation,
  sendBookingNotification,
} from "@/lib/email/bookingConfirmation";
import { emailPilotsBookingVerification } from "@/lib/email/emailPilotsBookingVerification";
import { BookingFormData } from "@/lib/validation/BookFormData";
import { Currency } from "@/lib/utils/pricing";
import {
  BookingConfirmationData,
  PaymentInfo,
} from "@/lib/types/bookingDetails";
import { saveBookingDetails } from "@/lib/services/bookingService";
import { generateBookingRef } from "@/lib/services/generateBookingRef";

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
      const paymentInfo: PaymentInfo = {
        stripeSessionId: session.id,
        baseTotal: parseInt(session.metadata?.baseTotal || "0"),
        soloTotal: parseInt(session.metadata?.soloTotal || "0"),
        paymentAmount: session.amount_total as number,
        currency: session.currency as Currency,
        paymentTimestamp: new Date().toISOString(),
      };

      // Calculate counts for email
      const soloCount =
        bookingData.participants?.filter(
          (p: { soloOccupancy: boolean }) => p.soloOccupancy,
        ).length + (bookingData.soloOccupancy ? 1 : 0) || 0;

      // Generate a tourReference
      const tourReference = generateBookingRef(
        new Date(paymentInfo.paymentTimestamp),
      );

      // Use professional email templates for booking confirmation and notification
      const booking: BookingConfirmationData = {
        bookingData: bookingData as BookingFormData,
        bookingPayment: paymentInfo as PaymentInfo,
        tourReference: tourReference,
        totalPeople: participantCount,
        soloCount,
      };

      // Send professional booking confirmation to customer
      console.log("Sending booking confirmation to customer...");
      const confirmationResult = await sendBookingConfirmation(booking);
      if (!confirmationResult.success) {
        console.error(
          "Failed to send booking confirmation:",
          confirmationResult.error,
        );
      }

      // Send professional booking notification to business
      console.log("Sending booking notification to business...");
      const notificationResult = await sendBookingNotification(booking);
      if (!notificationResult.success) {
        console.error(
          "Failed to send booking notification:",
          notificationResult.error,
        );
      }

      // Send pilot verification emails using professional template
      console.log("Checking for pilots requiring verification...");
      const pilotEmailResult = await emailPilotsBookingVerification(
        booking,
        "verification",
      );
      if (pilotEmailResult.emailsSent > 0) {
        console.log(
          `Pilot verification summary: ${pilotEmailResult.emailsSent} emails sent successfully`,
        );
        if (pilotEmailResult.errors?.length) {
          console.error(
            "Some pilot verification emails failed:",
            pilotEmailResult.errors,
          );
        }
      } else {
        console.log(
          "No pilots found in this booking - no verification emails needed",
        );
      }

      console.log("Booking emails sent successfully for session:", session.id);

      // Redirect to Stripe checkout - emails will be sent after payment completion via webhook

      await saveBookingDetails(booking);
    } catch (error) {
      console.error("Error processing checkout session:", error);
    }
  }

  return NextResponse.json({ received: true });
}
