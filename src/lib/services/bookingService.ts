import fs from "fs";
import path from "path";
import { ParticipantData } from "../validation/BookFormData";
import {
  BookingConfirmationData,
  BookingDetails,
  ParticipantBookingDetails,
} from "../types/bookingDetails";
import { saveBookingToGoogleSheets } from "./googleSheetsService";

export async function saveBookingDetails(booking: BookingConfirmationData) {
  // Try Google Sheets first, fallback to JSON if it fails
  try {
    const sheetsResult = await saveBookingToGoogleSheets(booking);
    if (sheetsResult.success) {
      console.log(
        `Booking ${booking.tourReference} saved to Google Sheets successfully`,
      );
      return sheetsResult;
    } else {
      console.warn("Google Sheets save failed, falling back to JSON file");
    }
  } catch (error) {
    console.warn(
      "Google Sheets integration error, using JSON fallback:",
      error,
    );
  }

  // JSON fallback (original code)
  const bookingDetailsJSONPath = path.join(
    process.cwd(),
    "src",
    "data",
    "bookingDetails.json",
  );

  let existingBookingDetails: BookingDetails = {};

  try {
    if (fs.existsSync(bookingDetailsJSONPath)) {
      existingBookingDetails = JSON.parse(
        fs.readFileSync(bookingDetailsJSONPath, "utf-8"),
      );
    } else {
      console.warn("Booking details file not found, starting with empty data.");
    }
  } catch (error) {
    console.error("Failed to read booking details files:", error);
  }

  const tourStartDate = booking.bookingData.start;
  const tourKey =
    Object.keys(existingBookingDetails).find((key) => key === tourStartDate) ??
    tourStartDate;
  // Retrieve existing tour data or initialize a new object
  let tourData = existingBookingDetails[tourKey] || {};

  const requiredInfo = ({
    name,
    email,
    isPilot,
    soloOccupancy,
  }: {
    name: string;
    email: string;
    isPilot: boolean;
    soloOccupancy: boolean;
  }) => {
    return {
      name: name,
      email: email,
      status: "PENDING" as const,
      soloOccupancy: soloOccupancy,
      dietary: "",
      medical: "",
      emergencyContact: {
        name: "",
        phone: "",
      },
      insurance: {
        provider: "",
        number: "",
      },
      passport: {
        number: "",
        expiryDate: "",
      },
      timestamp: new Date().toISOString(),
      flightDetails: {
        arrivalFlightNumber: "",
        departureFlightNumber: "",
        arrivalDate: booking.bookingData.start,
        arrivalTime: "",
        departureDate: new Date(booking.bookingData.start).toDateString(),
        departureTime: "",
      },
      pilot: isPilot ? {
        flyingExperience: "",
        pilotRating: false,
        thirdParty: false,
        annexe2: false,
        gliderManufacturer: "",
        gliderModel: "",
        gliderSize: "",
        gliderColours: "",
      } : undefined,
    };
  };

  // Add participant details
  let participants: ParticipantBookingDetails = {};
  if (booking.bookingData.participants.length > 0) {
    participants =
      booking.bookingData.participants?.reduce(
        (acc: ParticipantBookingDetails, participant: ParticipantData) => {
          acc[participant.name] = requiredInfo({
            name: participant.name,
            email: participant.email ? participant.email : "",
            isPilot: participant.isPilot,
            soloOccupancy: participant.soloOccupancy,
          });
          return acc;
        },
        {},
      ) || {};
  }

  // Add booker details
  const bookerDetails = {
    ...requiredInfo({
      name: booking.bookingData.name,
      email: booking.bookingData.email,
      isPilot: booking.bookingData.isPilot,
      soloOccupancy: booking.bookingData.soloOccupancy,
    }),
    paymentInfo: booking.bookingPayment,
  };

  participants[booking.bookingData.name] = bookerDetails;

  if (tourKey) {
    // If tour data exists, merge with new participants
    tourData = Object.assign(tourData, participants);
    existingBookingDetails[tourKey] = tourData;
  } else {
    // If no existing tour data, create new entry
    existingBookingDetails[tourKey] = participants;
  }

  fs.writeFileSync(
    bookingDetailsJSONPath,
    JSON.stringify(existingBookingDetails, null, 2),
  );
}
