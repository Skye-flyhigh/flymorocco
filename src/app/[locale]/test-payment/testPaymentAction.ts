"use server";

import { createBookingCheckout } from '@/lib/payments/bookingPayments';
import { BookingFormData } from '@/lib/validation/BookFormData';

export async function testPaymentAction() {
  // Create minimal test booking data
  const testBookingData: BookingFormData = {
    name: "Test Customer",
    email: process.env.TEST_EMAIL as string, // Your email for testing
    tourType: "coastal",
    start: "2025-09-15",
    participants: [],
    soloOccupancy: false,
    isPilot: false,
    participantCount: 1
  };

  try {
    const result = await createBookingCheckout({
      bookingData: testBookingData,
      totalPeople: 1,
      soloCount: 0,
      basePrice: 1, // £1 test
      soloPrice: 0,
      baseTotal: 100, // £1 in pence
      soloTotal: 0,
      grandTotal: 100, // £1 in pence
      currency: 'GBP'
    });

    return result;
  } catch (error) {
    console.error('Test payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}