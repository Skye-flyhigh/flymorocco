import { Currency } from "../utils/pricing";
import { BookingFormData } from "../validation/BookFormData";
import { TourSlug } from "./tour";

export const BOOKING_STATUS = ["PENDING", "CONFIRMED", "PAID", "COMPLETED", "EXPIRED", "CANCELLED"] as const;

export interface ParticipantDetails {
  name: string;
  email: string;
  status: (typeof BOOKING_STATUS)[number];
  soloOccupancy: boolean;
  dietary: string;
  medical: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  paymentInfo?: PaymentInfo;
  insurance: {
    provider: string;
    number: string;
  };
  passport: {
    number: string;
    expiryDate: string;
  };
  timestamp: string;
  flightDetails: {
    arrivalFlightNumber: string;
    departureFlightNumber: string;
    arrivalDate: string;
    arrivalTime: string;
    departureDate: string;
    departureTime: string;
  };
  // Pilot-specific fields (optional)
  pilot?: {
    pilotRating: boolean;
    thirdParty: boolean;
    annexe2: boolean;
    gliderManufacturer: string;
    gliderModel: string;
    gliderSize: string;
    gliderColours: string;
    flyingExperience: string;
  }
}

export interface ParticipantBookingDetails {
  [name: string]: ParticipantDetails;
}

export interface BookingDetails {
  [startDate: string]: ParticipantBookingDetails;
}

export interface PaymentInfo {
  stripeSessionId: string;
  soloTotal: number;
  baseTotal: number;
  paymentAmount: number;
  currency: Currency;
  paymentTimestamp: string;
}

export interface BookingConfirmationData {
  bookingData: BookingFormData;
  bookingPayment: PaymentInfo;
  bookingStatus: typeof BOOKING_STATUS;
  tourReference: string;
  totalPeople: number;
  soloCount: number;
}

export interface PilotEmailData {
  pilotName: string;
  tourType: TourSlug;
  tourStart: string;
  mainContactName: string;
  mainContactEmail: string;
  tourReference: string;
}
