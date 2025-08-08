import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendBookingConfirmation, sendBookingNotification, type BookingConfirmationData } from "@/lib/email/bookingConfirmation";
import { emailPilotsBookingVerification } from "@/lib/email/emailPilotsBookingVerification";
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
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Parse booking data from metadata
      const bookingData = JSON.parse(session.metadata?.bookingData || "{}");
      const participantCount = parseInt(session.metadata?.participantCount || "0");
      const baseTotal = parseInt(session.metadata?.baseTotal || "0");
      const soloTotal = parseInt(session.metadata?.soloTotal || "0");
      const grandTotal = parseInt(session.metadata?.grandTotal || "0");
      const currency = session.metadata?.currency || "EUR";

      // Calculate counts for email
      const soloCount = bookingData.participants?.filter((p: { soloOccupancy: boolean }) => p.soloOccupancy).length + (bookingData.soloOccupancy ? 1 : 0) || 0;

      // Use professional email templates for booking confirmation and notification
      const emailData: BookingConfirmationData = {
        bookingData: bookingData as BookingFormData,
        totalPeople: participantCount,
        soloCount,
        baseTotal,
        soloTotal,
        grandTotal,
        currency: currency as Currency,
        stripeSessionId: session.id
      };

      // Send professional booking confirmation to customer
      console.log("Sending booking confirmation to customer...");
      const confirmationResult = await sendBookingConfirmation(emailData);
      if (!confirmationResult.success) {
        console.error("Failed to send booking confirmation:", confirmationResult.error);
      }

      // Send professional booking notification to business
      console.log("Sending booking notification to business...");
      const notificationResult = await sendBookingNotification(emailData);
      if (!notificationResult.success) {
        console.error("Failed to send booking notification:", notificationResult.error);
      }

      // Send pilot verification emails using professional template
      console.log("Checking for pilots requiring verification...");
      const pilotEmailResult = await emailPilotsBookingVerification(bookingData as BookingFormData, "verification");
      if (pilotEmailResult.emailsSent > 0) {
        console.log(`Pilot verification summary: ${pilotEmailResult.emailsSent} emails sent successfully`);
        if (pilotEmailResult.errors?.length) {
          console.error("Some pilot verification emails failed:", pilotEmailResult.errors);
        }
      } else {
        console.log("No pilots found in this booking - no verification emails needed");
      }

      console.log("Booking emails sent successfully for session:", session.id);

          // Redirect to Stripe checkout - emails will be sent after payment completion via webhook
    
    // TODO: Future booking data persistence strategy
    // Add participant to tour data here
    // -> check for data/bookingDetails.json
    // -> one object per tour, key startDate, filled with participant data
    // -> non flyer participant: "John Doe": {email: "john.doe@example.com", insuranceProvider: "Big Cat", insuranceNumber: "123456789", timestamp: "booking timeStamp"}
    // -> pilot participant: "John Doe": {email: "john.doe@example.com", insuranceProvider: "Big Cat", timestamp: "booking timeStamp", insuranceNumber: "123456789", pilotRating: boolean, thirdParty: boolean, annexe2: boolean, gliderManufacturer: "Ozone", gliderModel: "Buzz", gliderSize: "Medium", gliderColours: "Blue White"}


    } catch (error) {
      console.error("Error processing checkout session:", error);
    }
  }

  return NextResponse.json({ received: true });
}