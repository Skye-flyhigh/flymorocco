import { google } from "googleapis";
import {
  BookingConfirmationData,
  ParticipantDetails,
} from "../types/bookingDetails";

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const credentials = JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}",
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// Backwards compatibility wrapper for existing code
export async function saveBookingToGoogleSheets(
  booking: BookingConfirmationData,
) {
  const service = new GoogleSheetsBookingService();
  return await service.saveBooking(booking);
}

// Test connection function (needed for your test endpoint)
export async function testGoogleSheetsConnection() {
  try {
    const service = new GoogleSheetsBookingService();

    // Try to read the first row (headers)
    const response = await service.sheets.spreadsheets.values.get({
      spreadsheetId: service.spreadsheetId,
      range: "Sheet1!1:1",
    });

    console.log("Google Sheets connection successful!");
    console.log("Headers found:", response.data.values?.[0]);
    return { success: true, headers: response.data.values?.[0] };
  } catch (error) {
    console.error("Google Sheets connection failed:", error);
    return { success: false, error };
  }
}

export class GoogleSheetsBookingService {
  sheets: import("googleapis").sheets_v4.Sheets;
  spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || "";
    if (!this.spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID environment variable not set");
    }

    this.sheets = getGoogleSheetsClient();
  }

  private tourEndDate(date: string) {
    const tourStartDate = new Date(date);
    tourStartDate.setDate(tourStartDate.getDate() + 7); // 7-day tours
    return tourStartDate.toISOString().split("T")[0];
  }

  async saveBooking(booking: BookingConfirmationData) {
    // Method will use this.sheets and this.spreadsheetId
    try {
      // Prepare rows for each participant (including booker)
      const rows: unknown[][] = [];

      // Function to create a row for a participant
      const createParticipantRow = (participant: ParticipantDetails) => {
        return [
          booking.tourReference, // Ref
          participant.name, // Name
          participant.email, // Email
          booking.bookingData.start, // Tour start date
          this.tourEndDate(booking.bookingData.start), // Tour end date
          booking.bookingData.tourType, // Tour type
          participant.soloOccupancy ? "Yes" : "No", // Solo Occupancy
          participant.dietary || "", // Dietary
          participant.medical || "", // Medical
          participant.emergencyContact.name || "", // Emergency Contact Name
          participant.emergencyContact.phone || "", // Emergency Contact phone
          participant.insurance.provider || "", // Insurance Provider
          participant.insurance.number || "", // Insurance number
          participant.passport.number || "", // Passport Number
          participant.passport.expiryDate || "", // Passport Expiry Date
          participant.flightDetails.arrivalFlightNumber || "", // Flight Arrival Ref
          participant.flightDetails.arrivalDate || "", // Flight Arrival Date
          participant.flightDetails.arrivalTime || "", // Flight Arrival time
          participant.flightDetails.departureFlightNumber || "", // Flight Departure Ref
          participant.flightDetails.departureDate || "", // Flight Departure Date
          participant.flightDetails.departureTime || "", // Flight Departure time
          participant.paymentInfo?.stripeSessionId || "", // Stripe ID (only booker has this)
          participant.paymentInfo?.paymentAmount || "", // Payment amount (only booker)
          participant.paymentInfo?.currency || "", // Currency (only booker)
          participant.timestamp, // Timestamp
          participant.pilotRating !== undefined ? "Yes" : "No", // is Pilot
          participant.flyingExperience || "NA", // Flying Experience
          participant.pilotRating ? "Yes" : "NA", // Pilot Rating
          participant.thirdParty ? "Yes" : "NA", // Third party liability
          participant.annexe2 ? "Yes" : "NA", // Annex 2
          participant.gliderManufacturer || "NA", // Glider Manufacturer
          participant.gliderModel || "NA", // Glider Model
          participant.gliderSize || "NA", // Glider Size
          participant.gliderColours || "NA", // Glider Colours
        ];
      };

      const booker: ParticipantDetails = {
        name: booking.bookingData.name,
        email: booking.bookingData.email,
        soloOccupancy: booking.bookingData.soloOccupancy,
        dietary: "",
        medical: "",
        emergencyContact: { name: "", phone: "" },
        insurance: { provider: "", number: "" },
        passport: { number: "", expiryDate: "" },
        flightDetails: {
          arrivalFlightNumber: "",
          arrivalDate: booking.bookingData.start,
          arrivalTime: "",
          departureFlightNumber: "",
          departureDate: this.tourEndDate(booking.bookingData.start),
          departureTime: "",
        },
        paymentInfo: {
          stripeSessionId: booking.bookingPayment.stripeSessionId,
          paymentAmount: booking.bookingPayment.paymentAmount,
          currency: booking.bookingPayment.currency,
          soloTotal: booking.bookingPayment.soloTotal,
          baseTotal: booking.bookingPayment.baseTotal,
          paymentTimestamp: booking.bookingPayment.paymentTimestamp,
        },
        timestamp: new Date().toISOString(),
        pilotRating: false,
        flyingExperience: "",
        thirdParty: false,
        annexe2: false,
        gliderManufacturer: "",
        gliderModel: "",
        gliderSize: "",
        gliderColours: "",
      };

      // Add booker row
      rows.push(createParticipantRow(booker));

      booking.bookingData.participants.forEach((participant) => {
        const participantDetails: ParticipantDetails = {
          name: participant.name,
          email: participant.email as string,
          soloOccupancy: participant.soloOccupancy,
          dietary: "",
          medical: "",
          emergencyContact: { name: "", phone: "" },
          insurance: { provider: "", number: "" },
          passport: { number: "", expiryDate: "" },
          flightDetails: {
            arrivalFlightNumber: "",
            arrivalDate: booking.bookingData.start,
            arrivalTime: "",
            departureFlightNumber: "",
            departureDate: this.tourEndDate(booking.bookingData.start),
            departureTime: "",
          },
          paymentInfo: {
            stripeSessionId: booking.bookingPayment.stripeSessionId,
            paymentAmount: booking.bookingPayment.paymentAmount,
            currency: booking.bookingPayment.currency,
            soloTotal: booking.bookingPayment.soloTotal,
            baseTotal: booking.bookingPayment.baseTotal,
            paymentTimestamp: booking.bookingPayment.paymentTimestamp,
          },
          timestamp: new Date().toISOString(),
          pilotRating: false,
          flyingExperience: "",
          thirdParty: false,
          annexe2: false,
          gliderManufacturer: "",
          gliderModel: "",
          gliderSize: "",
          gliderColours: "",
        };

        rows.push(createParticipantRow(participantDetails));
      });

      const writeResult = await this.writeDataToGoogleSheets(
        "Sheet1!A:AH",
        rows,
      );
      if (!writeResult.success) {
        throw new Error(
          `Failed to write to Google Sheets: ${writeResult.error}`,
        );
      }

      console.log(
        `Added rows to Google Sheets for booking ${booking.tourReference}`,
      );
      return { success: true, rowsAdded: rows.length };
    } catch (error) {
      console.error(`Error saving to Google Sheets:`, error);
      return { success: false, error: error };
    }
  }

  async writeDataToGoogleSheets(range: string, rows: unknown[][]) {
    try {
      // Single batch append instead of individual Promise.all chaos
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: rows, // All rows in one batch operation
        },
        includeValuesInResponse: true, // Boolean, not row data
      });

      console.log(
        "Successfully wrote to Google Sheets:",
        response.data.updates,
      );
      return {
        success: true,
        rowsAdded: response.data.updates?.updatedRows || rows.length,
      };
    } catch (error) {
      console.error("Failed to write to Google Sheets:", error);
      return { success: false, error: String(error) };
    }
  }

  async updateParticipant(
    bookingRef: string,
    participantEmail: string,
    updates: Partial<ParticipantDetails>,
  ) {
    // TODO: Find participant row by booking ref + email, update specific fields
    console.log(
      `Update participant ${participantEmail} in booking ${bookingRef}`,
      updates,
    );
    return { success: true, message: "Method not implemented yet" };
  }

  async getBookingsByTour(tourStartDate: string) {
    // TODO: Read all rows, filter by tour start date
    console.log(`Get bookings for tour ${tourStartDate}`);
    return {
      success: true,
      bookings: [],
      message: "Method not implemented yet",
    };
  }

  async getAllBookings() {
    // TODO: Read all data from spreadsheet
    console.log("Get all bookings");
    return {
      success: true,
      bookings: [],
      message: "Method not implemented yet",
    };
  }
}
