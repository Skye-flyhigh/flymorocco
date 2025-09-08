"use server";

import {
  BookingFormSchema,
  BookingFormData,
  ParticipantData,
} from "../validation/BookFormData";
import { escapeHTML } from "../security/escapeHTML";
import { verifyRecaptcha } from "../security/verifyRecaptcha";
import { TourSlug } from "../types/tour";
import { calculateBookingTotal, type Currency } from "../utils/pricing";
import { generateBookingRef } from "../services/generateBookingRef";

export type BookingFormState = {
  data: Partial<BookingFormData>;
  errors: null | Record<string, string[]>;
  success: boolean;
  checkoutUrl?: string;
};

export async function submitBooking(
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  // Parse participant data from form
  const participantCount =
    parseInt(formData.get("participantCount") as string) || 0;
  const participants: ParticipantData[] = [];

  for (let i = 0; i < participantCount; i++) {
    const participant: ParticipantData = {
      name: escapeHTML((formData.get(`participant_${i}_name`) as string) || ""),
      isPilot: formData.get(`participant_${i}_isPilot`) === "true",
      soloOccupancy: formData.get(`participant_${i}_soloOccupancy`) === "true",
    };

    // Add email if pilot
    const pilotEmail = formData.get(`participant_${i}_email`) as string;
    if (participant.isPilot && pilotEmail) {
      participant.email = pilotEmail;
    }
    participants.push(participant);
  }

  const formValues: Partial<BookingFormData> = {
    name: escapeHTML(formData.get("name") as string),
    email: escapeHTML(formData.get("email") as string),
    isPilot: formData.get("isPilot") === "true",
    soloOccupancy: formData.get("soloOccupancy") === "true",
    start: escapeHTML(formData.get("start") as string),
    tourType: (formData.get("tourType") as TourSlug) || "mountain",
    participantCount,
    participants,
  };

  // Get currency and tour type from form
  const currency = (
    (formData.get("currency") as string) || "EUR"
  ).toUpperCase() as Currency;

  // Verify reCAPTCHA
  const recaptchaToken = formData.get("recaptcha-token") as string;
  const recaptchaResult = await verifyRecaptcha(recaptchaToken);

  if (!recaptchaResult.success) {
    return {
      data: formValues,
      errors: { general: ["Please complete the reCAPTCHA verification"] },
      success: false,
    };
  }

  const { success, error, data } = BookingFormSchema.safeParse(formValues);
  if (!success) {
    return {
      data: formValues,
      errors: error.flatten().fieldErrors,
      success: false,
    };
  }

  // Calculate pricing using centralized pricing data
  const totalPeople = data.participantCount + 1; // +1 for main booker
  const soloCount =
    data.participants.filter((p) => p.soloOccupancy).length +
    (data.soloOccupancy ? 1 : 0);

  const booking = calculateBookingTotal(
    data.tourType,
    currency,
    totalPeople,
    soloCount,
  );

  if (!booking) {
    return {
      data: formValues,
      errors: { general: ["Failed to calculate booking total"] },
      success: false,
    };
  }

  // Get booking reference directly from checkout result
  const timeStamp = new Date();
  const bookingRef = generateBookingRef(timeStamp);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const checkoutUrl = `${baseUrl}/booking-success?booking_ref=${bookingRef}&tour=${data.tourType}&total=${booking.grandTotal}&currency=${currency}`;

  // Send booking data to API route for processing
  try {
    const bookingResponse = await fetch(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingData: data,
        totalPeople,
        soloCount,
        grandTotal: booking.grandTotal,
        currency,
        bookingRef,
        paymentStatus: "pending",
        timeStamp,
      }),
    });

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      console.error("❌ API returned error:", errorText);
      throw new Error(`API returned ${bookingResponse.status}: ${errorText}`);
    }

    const result = await bookingResponse.json();

    if (!result.success) {
      console.error("Failed to process booking:", result.error);
      return {
        data: formValues,
        errors: {
          general: [
            "Booking submitted but processing failed. We will contact you shortly.",
          ],
        },
        success: true, // Still show success to user, but log the error
        checkoutUrl,
      };
    }

    console.log("Booking processed successfully:", result.tourReference);
  } catch (error) {
    console.error("Error calling booking API:", error);
    // Don't fail the form submission if API call fails
  }

  return {
    data: formValues,
    errors: null,
    success: true,
    checkoutUrl,
  };
}
