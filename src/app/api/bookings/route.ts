import { NextRequest, NextResponse } from "next/server";
import { BookingFormData } from "@/lib/validation/BookFormData";
import { Currency } from "@/lib/utils/pricing";
import {
  BookingConfirmationData,
  PaymentInfo,
} from "@/lib/types/bookingDetails";
import {
  sendBookingConfirmation,
  sendBookingNotification,
} from "@/lib/email/bookingConfirmation";
import { saveBookingToGoogleSheets } from "@/lib/services/googleSheetsService";
import { emailPilotsBookingVerification } from "@/lib/email/emailPilotsBookingVerification";

interface BookingRequestData {
  bookingData: BookingFormData;
  totalPeople: number;
  soloCount: number;
  grandTotal: number;
  currency: Currency;
  bookingRef: string;
  paymentStatus?: "pending" | "completed" | "failed";
  timeStamp: string; // JSON serializes Date as string
}

export async function POST(request: NextRequest) {
  try {
    const requestData: BookingRequestData = await request.json();

    const {
      bookingData,
      totalPeople,
      soloCount,
      grandTotal,
      currency,
      bookingRef,
      paymentStatus = "pending",
      timeStamp,
    } = requestData;

    // Create payment info object (no Stripe session since payment is pending)
    const paymentInfo: PaymentInfo = {
      stripeSessionId: bookingRef, // Use booking ref as identifier
      baseTotal: grandTotal - soloCount * 50, // Estimate base vs solo split
      soloTotal: soloCount * 50, // Estimate solo supplement
      paymentAmount: grandTotal * 100, // Convert to cents for consistency
      currency: currency,
      paymentTimestamp: new Date(timeStamp).toISOString(), // Convert string back to Date and format
    };

    // Create booking confirmation data
    const booking: BookingConfirmationData = {
      bookingData: bookingData,
      bookingPayment: paymentInfo,
      bookingStatus: ["PENDING", "CONFIRMED", "PAID", "COMPLETED", "EXPIRED", "CANCELLED"],
      tourReference: bookingRef,
      totalPeople,
      soloCount,
    };

    // Send professional booking confirmation to customer
    const confirmationResult = await sendBookingConfirmation(booking);
    if (!confirmationResult.success) {
      console.error(
        "Failed to send booking confirmation:",
        confirmationResult.error,
      );
    }

    // Send professional booking notification to business
    const notificationResult = await sendBookingNotification(booking);
    if (!notificationResult.success) {
      console.error(
        "Failed to send booking notification:",
        notificationResult.error,
      );
    }

    // Send pilot booking verification emails - delayed by 1s to avoid Resend rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const pilotVerificationResult =
      await emailPilotsBookingVerification(booking);
    if (!pilotVerificationResult.success) {
      console.error(
        "Failed to send pilot booking verification:",
        pilotVerificationResult.errors,
      );
    }

    // Save to Google Sheets
    const sheetsResult = await saveBookingToGoogleSheets(booking);
    if (!sheetsResult.success) {
      console.error("Failed to save to Google Sheets:", sheetsResult.error);
    }

    return NextResponse.json({
      success: true,
      tourReference: bookingRef,
      bookingRef,
      message:
        paymentStatus === "pending"
          ? "Booking saved - payment instructions sent via email"
          : "Booking confirmed and saved successfully",
    });
  } catch (error) {
    console.error("Error processing booking:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
