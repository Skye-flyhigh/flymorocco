"use server";

import { BookingFormSchema, BookingFormData, ParticipantData } from "../validation/BookFormData";
import { escapeHTML } from "../security/escapeHTML";
import { verifyRecaptcha } from "../security/verifyRecaptcha";
import { TourSlug } from "../types/tour";
import { calculateBookingTotal, type Currency } from "../utils/pricing";
import { createBookingCheckout } from "../payments/bookingPayments";
import { sendBookingConfirmation, sendBookingNotification } from "../email/bookingConfirmation";
import { emailPilotsBookingVerification } from "../email/emailPilotsBookingVerification";

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
  const participantCount = parseInt(formData.get("participantCount") as string) || 0;
  const participants: ParticipantData[] = [];
  
  for (let i = 0; i < participantCount; i++) {
    const participant: ParticipantData = {
      name: escapeHTML(formData.get(`participant_${i}_name`) as string || ""),
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
    tourType: formData.get("tourType") as TourSlug || "mountain",
    participantCount,
    participants,
  };

  // Get currency and tour type from form
  const currency = (formData.get("currency") as string || "EUR").toUpperCase() as Currency;

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

  console.log("Booking form values:", formValues, currency);

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
  const soloCount = data.participants.filter(p => p.soloOccupancy).length + (data.soloOccupancy ? 1 : 0);
  
  const booking = calculateBookingTotal(data.tourType, currency, totalPeople, soloCount);

  if (!booking) {
    return {
      data: formValues,
      errors: { general: ["Failed to calculate booking total"] },
      success: false,
    };
  }
  const bookingCheckout = await createBookingCheckout({
    bookingData: data,
    totalPeople,
    soloCount,
    basePrice: booking.basePrice,
    soloPrice: booking.soloPrice,
    baseTotal: booking.baseTotal,
    soloTotal: booking.soloTotal,
    grandTotal: booking.grandTotal,
    currency,
  });

  if (bookingCheckout.success) {

    // Send booking confirmation and notification emails
    const emailData = {
      bookingData: data,
      totalPeople,
      soloCount,
      baseTotal: booking.baseTotal,
      soloTotal: booking.soloTotal,
      grandTotal: booking.grandTotal,
      currency,
      stripeSessionId: bookingCheckout.checkoutUrl?.split('_')[1] || 'unknown'
    };

    // Send confirmation to customer
    console.log("Sending booking confirmation to customer...");
    const confirmationResult = await sendBookingConfirmation(emailData);
    if (!confirmationResult.success) {
      console.error("Failed to send booking confirmation:", confirmationResult.error);
    }

    // Send notification to business
    console.log("Sending booking notification to business...");
    const notificationResult = await sendBookingNotification(emailData);
    if (!notificationResult.success) {
      console.error("Failed to send booking notification:", notificationResult.error);
    }

    // Send pilot verification emails
    console.log("Checking for pilots requiring verification...");
    const pilotEmailResult = await emailPilotsBookingVerification(data, "verification");
    if (pilotEmailResult.emailsSent > 0) {
      console.log(`Pilot verification summary: ${pilotEmailResult.emailsSent} emails sent successfully`);
      if (pilotEmailResult.errors?.length) {
        console.error("Some pilot verification emails failed:", pilotEmailResult.errors);
      }
    } else {
      console.log("No pilots found in this booking - no verification emails needed");
    }

    // Add participant to tour data here
    // -> check for data/bookingDetails.json
    // -> one object per tour, key startDate, filled with participant data
    // -> non flyer participant: "John Doe": {email: "john.doe@example.com", insuranceProvider: "Big Cat", insuranceNumber: "123456789", timestamp: "booking timeStamp"}
    // -> pilot participant: "John Doe": {email: "john.doe@example.com", insuranceProvider: "Big Cat", timestamp: "booking timeStamp", insuranceNumber: "123456789", pilotRating: boolean, thirdParty: boolean, annexe2: boolean, gliderManufacturer: "Ozone", gliderModel: "Buzz", gliderSize: "Medium", gliderColours: "Blue White"}

    return {
      data: formValues,
      errors: null,
      success: true,
      checkoutUrl: bookingCheckout.checkoutUrl,
    };
  } else {
    return {
      data: formValues,
      errors: { general: [bookingCheckout.error || "Error occurred during checkout session"] },
      success: false,
    };
  }
}