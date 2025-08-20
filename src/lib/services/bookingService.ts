import fs from "fs";
import { BookingFormData, ParticipantData } from "../validation/BookFormData";
import {
  BookingDetails,
  ParticipantBookingDetails,
  PaymentInfo,
} from "../types/bookingDetails";

export async function saveBookingDetails({
  bookingData,
  paymentInfo,
}: {
  bookingData: BookingFormData;
  paymentInfo: PaymentInfo;
}) {
  const bookingDetailsJSONPath = "@/data/bookingDetails.json";

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

  const tourStartDate = bookingData.start;
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
    const baseInfo = {
      name: name,
      email: email,
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
        arrivalDate: bookingData.start,
        arrivalTime: "",
        departureDate: new Date(bookingData.start).toDateString(),
        departureTime: "",
      },
    };

    if (isPilot) {
      return {
        ...baseInfo,
        flyingExperience: "",
        pilotRating: false,
        thirdParty: false,
        annexe2: false,
        gliderManufacturer: "",
        gliderModel: "",
        gliderSize: "",
        gliderColours: "",
      };
    }

    return baseInfo;
  };

  // Add participant details
  let participants: ParticipantBookingDetails = {};
  if (bookingData.participants.length > 0) {
    participants =
      bookingData.participants?.reduce(
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
      name: bookingData.name,
      email: bookingData.email,
      isPilot: bookingData.isPilot,
      soloOccupancy: bookingData.soloOccupancy,
    }),
    paymentInfo: paymentInfo,
  };

  participants[bookingData.name] = bookerDetails;

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
