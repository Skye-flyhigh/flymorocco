export interface ParticipantDetails {
  name: string;
  email: string;
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
  pilotRating?: boolean;
  thirdParty?: boolean;
  annexe2?: boolean;
  gliderManufacturer?: string;
  gliderModel?: string;
  gliderSize?: string;
  gliderColours?: string;
  flyingExperience?: string;
}

export interface ParticipantBookingDetails {
  [name: string]: ParticipantDetails;
}

export interface BookingDetails {
  [startDate: string]: ParticipantBookingDetails;
}

export interface PaymentInfo {
  stripeSessionId: string;
  paymentAmount: number;
  soloTotal: number;
  baseTotal: number;
  currency: string;
  paymentTimestamp: string;
}
