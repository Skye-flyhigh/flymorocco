"use server";

import { BookingConfirmationData } from "@/lib/types/bookingDetails";
import { BookingFormData } from "@/lib/validation/BookFormData";
import { generateBookingRef } from "@/lib/services/generateBookingRef";
import { saveBookingToGoogleSheets } from "@/lib/services/googleSheetsService";

export async function testBookingSaveAction() {
  try {
    // Create mock booking data
    const testBookingData: BookingFormData = {
      name: "Test Customer",
      email: "test@flymorocco.info",
      isPilot: true,
      soloOccupancy: false,
      start: "2025-09-15",
      tourType: "coastal",
      participantCount: 2,
      participants: [
        {
          name: "Jane Pilot",
          email: "jane@example.com",
          isPilot: true,
          soloOccupancy: true,
        },
        {
          name: "John Passenger",
          email: "john@example.com",
          isPilot: false,
          soloOccupancy: false,
        },
      ],
    };

    // Create mock payment info
    const testPaymentInfo = {
      stripeSessionId: "test_session_" + Date.now(),
      baseTotal: 200000, // £2000 in pence
      soloTotal: 50000, // £500 in pence
      paymentAmount: 250000, // £2500 in pence
      currency: "GBP" as const,
      paymentTimestamp: new Date().toISOString(),
    };

    // Generate booking reference
    const tourReference = generateBookingRef(new Date());

    // Create booking confirmation data
    const booking: BookingConfirmationData = {
      bookingData: testBookingData,
      bookingPayment: testPaymentInfo,
      tourReference: tourReference,
      totalPeople: 2,
      soloCount: 1,
    };

    // Test Google Sheets save
    const result = await saveBookingToGoogleSheets(booking);

    if (result.success) {
      return {
        success: true,
        rowsAdded: result.rowsAdded,
        bookingRef: tourReference,
      };
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  } catch (error) {
    console.error("Test booking save error:", error);
    return {
      success: false,
      error: String(error),
    };
  }
}
