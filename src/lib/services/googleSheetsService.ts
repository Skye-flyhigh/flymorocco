import { google } from "googleapis";
import {
  BookingConfirmationData,
  ParticipantDetails,
  PaymentInfo,
} from "../types/bookingDetails";
import { TourByDate } from "../types/tour";

// Centralized Google Sheets column schema - Single source of truth
// Define columns in order - indices are auto-generated
const SHEET_COLUMN_ORDER = [
  "TOUR_REFERENCE",        // A
  "NAME",                  // B
  "EMAIL",                 // C
  "STATUS",                // D
  "TOUR_START",            // E
  "TOUR_END",              // F
  "TOUR_TYPE",             // G
  "SOLO_OCCUPANCY",        // H
  "DIETARY",               // I
  "MEDICAL",               // J
  "EMERGENCY_NAME",        // K
  "EMERGENCY_PHONE",       // L
  "INSURANCE_PROVIDER",    // M
  "INSURANCE_NUMBER",      // N
  "PASSPORT_NUMBER",       // O
  "PASSPORT_EXPIRY",       // P
  "ARRIVAL_FLIGHT",        // Q
  "ARRIVAL_DATE",          // R
  "ARRIVAL_TIME",          // S
  "DEPARTURE_FLIGHT",      // T
  "DEPARTURE_DATE",        // U
  "DEPARTURE_TIME",        // V
  "STRIPE_SESSION_ID",     // W
  "PAYMENT_AMOUNT",        // X
  "CURRENCY",              // Y
  "TIMESTAMP",             // Z
  "FLYING_EXPERIENCE",     // AA
  "PILOT_RATING",          // AB
  "THIRD_PARTY",           // AC
  "ANNEXE2",               // AD
  "GLIDER_MANUFACTURER",   // AE
  "GLIDER_MODEL",          // AF
  "GLIDER_SIZE",           // AG
  "GLIDER_COLOURS",        // AH
] as const;

// Auto-generate column mapping from ordered array
const SHEET_COLUMNS = Object.fromEntries(
  SHEET_COLUMN_ORDER.map((col, index) => [col, index])
) as Record<typeof SHEET_COLUMN_ORDER[number], number>;

// Calculate the last column letter dynamically from SHEET_COLUMN_ORDER
// Converts column index (0-based) to Excel column letter (A, B, ..., Z, AA, AB, ..., AH)
const LAST_COLUMN_INDEX = SHEET_COLUMN_ORDER.length - 1;
const LAST_COLUMN_LETTER = (LAST_COLUMN_INDEX >= 26
  ? String.fromCharCode(65 + Math.floor(LAST_COLUMN_INDEX / 26) - 1)
  : "") + String.fromCharCode(65 + (LAST_COLUMN_INDEX % 26));
const SHEET_RANGE = `Sheet1!A:${LAST_COLUMN_LETTER}`; // Full range including header
const SHEET_DATA_RANGE = `Sheet1!A2:${LAST_COLUMN_LETTER}1000`; // Data range (skip header, up to 1000 rows)

// Helper: Convert ParticipantDetails to Google Sheets row
function participantToRow(participant: ParticipantDetails, tourRef: string, tourStart: string, tourEnd: string, tourType: string): unknown[] {
  const row: unknown[] = [];
  const C = SHEET_COLUMNS;

  row[C.TOUR_REFERENCE] = tourRef;
  row[C.NAME] = participant.name;
  row[C.EMAIL] = participant.email;
  row[C.STATUS] = participant.status || "PENDING";
  row[C.TOUR_START] = tourStart;
  row[C.TOUR_END] = tourEnd;
  row[C.TOUR_TYPE] = tourType;
  row[C.SOLO_OCCUPANCY] = participant.soloOccupancy ? "TRUE" : "FALSE";
  row[C.DIETARY] = participant.dietary || "";
  row[C.MEDICAL] = participant.medical || "";
  row[C.EMERGENCY_NAME] = participant.emergencyContact.name || "";
  row[C.EMERGENCY_PHONE] = participant.emergencyContact.phone || "";
  row[C.INSURANCE_PROVIDER] = participant.insurance.provider || "";
  row[C.INSURANCE_NUMBER] = participant.insurance.number || "";
  row[C.PASSPORT_NUMBER] = participant.passport.number || "";
  row[C.PASSPORT_EXPIRY] = participant.passport.expiryDate || "";
  row[C.ARRIVAL_FLIGHT] = participant.flightDetails.arrivalFlightNumber || "";
  row[C.ARRIVAL_DATE] = participant.flightDetails.arrivalDate || "";
  row[C.ARRIVAL_TIME] = participant.flightDetails.arrivalTime || "";
  row[C.DEPARTURE_FLIGHT] = participant.flightDetails.departureFlightNumber || "";
  row[C.DEPARTURE_DATE] = participant.flightDetails.departureDate || "";
  row[C.DEPARTURE_TIME] = participant.flightDetails.departureTime || "";
  row[C.STRIPE_SESSION_ID] = participant.paymentInfo?.stripeSessionId || "";
  row[C.PAYMENT_AMOUNT] = participant.paymentInfo?.paymentAmount ? (participant.paymentInfo.paymentAmount / 100).toFixed(2) : "";
  row[C.CURRENCY] = participant.paymentInfo?.currency || "";
  row[C.TIMESTAMP] = participant.timestamp;
  row[C.FLYING_EXPERIENCE] = participant.pilot?.flyingExperience || "";
  row[C.PILOT_RATING] = participant.pilot?.pilotRating ? "TRUE" : "FALSE";
  row[C.THIRD_PARTY] = participant.pilot?.thirdParty ? "TRUE" : "FALSE";
  row[C.ANNEXE2] = participant.pilot?.annexe2 ? "TRUE" : "FALSE";
  row[C.GLIDER_MANUFACTURER] = participant.pilot?.gliderManufacturer || "";
  row[C.GLIDER_MODEL] = participant.pilot?.gliderModel || "";
  row[C.GLIDER_SIZE] = participant.pilot?.gliderSize || "";
  row[C.GLIDER_COLOURS] = participant.pilot?.gliderColours || "";

  return row;
}

// Helper: Convert Google Sheets row to ParticipantDetails with tour info
function rowToParticipant(row: unknown[]): { participant: ParticipantDetails; tour: { reference: string; startDate: string; endDate: string; type: string } } {
  const C = SHEET_COLUMNS;

  return {
    participant: {
      name: (row[C.NAME] as string) || "",
      email: (row[C.EMAIL] as string) || "",
      status: ((row[C.STATUS] as string) || "PENDING") as "PENDING" | "CONFIRMED" | "PAID" | "COMPLETED" | "EXPIRED" | "CANCELLED",
      soloOccupancy: row[C.SOLO_OCCUPANCY] === "TRUE",
      dietary: (row[C.DIETARY] as string) || "",
      medical: (row[C.MEDICAL] as string) || "",
      emergencyContact: {
        name: (row[C.EMERGENCY_NAME] as string) || "",
        phone: (row[C.EMERGENCY_PHONE] as string) || "",
      },
      insurance: {
        provider: (row[C.INSURANCE_PROVIDER] as string) || "",
        number: (row[C.INSURANCE_NUMBER] as string) || "",
      },
      passport: {
        number: (row[C.PASSPORT_NUMBER] as string) || "",
        expiryDate: (row[C.PASSPORT_EXPIRY] as string) || "",
      },
      flightDetails: {
        arrivalFlightNumber: (row[C.ARRIVAL_FLIGHT] as string) || "",
        arrivalDate: (row[C.ARRIVAL_DATE] as string) || "",
        arrivalTime: (row[C.ARRIVAL_TIME] as string) || "",
        departureFlightNumber: (row[C.DEPARTURE_FLIGHT] as string) || "",
        departureDate: (row[C.DEPARTURE_DATE] as string) || "",
        departureTime: (row[C.DEPARTURE_TIME] as string) || "",
      },
      paymentInfo: row[C.STRIPE_SESSION_ID]
        ? {
            stripeSessionId: row[C.STRIPE_SESSION_ID] as string,
            paymentAmount: parseFloat((row[C.PAYMENT_AMOUNT] as string) || "0"),
            currency: ((row[C.CURRENCY] as string) || "GBP") as "EUR" | "GBP" | "USD" | "CAD",
            soloTotal: 0,
            baseTotal: 0,
            paymentTimestamp: (row[C.TIMESTAMP] as string) || "",
          }
        : undefined,
      timestamp: (row[C.TIMESTAMP] as string) || new Date().toISOString(),
      pilot: {
        flyingExperience: (row[C.FLYING_EXPERIENCE] as string) || "",
        pilotRating: row[C.PILOT_RATING] === "TRUE",
        thirdParty: row[C.THIRD_PARTY] === "TRUE",
        annexe2: row[C.ANNEXE2] === "TRUE",
        gliderManufacturer: (row[C.GLIDER_MANUFACTURER] as string) || "",
        gliderModel: (row[C.GLIDER_MODEL] as string) || "",
        gliderSize: (row[C.GLIDER_SIZE] as string) || "",
        gliderColours: (row[C.GLIDER_COLOURS] as string) || "",
      },
    },
    tour: {
      reference: (row[C.TOUR_REFERENCE] as string) || "",
      startDate: (row[C.TOUR_START] as string) || "",
      endDate: (row[C.TOUR_END] as string) || "",
      type: (row[C.TOUR_TYPE] as string) || "",
    },
  };
}

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set");
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountKey);
  } catch (error) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", error);
    throw new Error(
      "Invalid GOOGLE_SERVICE_ACCOUNT_KEY format - must be valid JSON",
    );
  }

  if (!credentials.client_email) {
    throw new Error("Service account key missing client_email field");
  }

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

  private createParticipantDetails(
    name: string,
    email: string,
    soloOccupancy: boolean,
    tourStartDate: string,
    paymentInfo?: PaymentInfo,
  ): ParticipantDetails {
    return {
      name,
      email,
      soloOccupancy,
      status: "PENDING",
      dietary: "",
      medical: "",
      emergencyContact: { name: "", phone: "" },
      insurance: { provider: "", number: "" },
      passport: { number: "", expiryDate: "" },
      flightDetails: {
        arrivalFlightNumber: "",
        arrivalDate: tourStartDate,
        arrivalTime: "",
        departureFlightNumber: "",
        departureDate: this.tourEndDate(tourStartDate),
        departureTime: "",
      },
      paymentInfo,
      timestamp: new Date().toISOString(),
      pilot: {
        pilotRating: false,
        flyingExperience: "",
        thirdParty: false,
        annexe2: false,
        gliderManufacturer: "",
        gliderModel: "",
        gliderSize: "",
        gliderColours: "",
      },
    };
  }

  async saveBooking(booking: BookingConfirmationData) {
    // Method will use this.sheets and this.spreadsheetId
    try {
      const rows: unknown[][] = [];
      const tourEnd = this.tourEndDate(booking.bookingData.start);

      const booker = this.createParticipantDetails(
        booking.bookingData.name,
        booking.bookingData.email,
        booking.bookingData.soloOccupancy,
        booking.bookingData.start,
        {
          stripeSessionId: booking.bookingPayment.stripeSessionId,
          paymentAmount: booking.bookingPayment.paymentAmount,
          currency: booking.bookingPayment.currency,
          soloTotal: booking.bookingPayment.soloTotal,
          baseTotal: booking.bookingPayment.baseTotal,
          paymentTimestamp: booking.bookingPayment.paymentTimestamp,
        },
      );

      // Add booker row
      rows.push(participantToRow(booker, booking.tourReference, booking.bookingData.start, tourEnd, booking.bookingData.tourType));

      booking.bookingData.participants.forEach((participant) => {
        const participantDetails = this.createParticipantDetails(
          participant.name,
          participant.email as string,
          participant.soloOccupancy,
          booking.bookingData.start,
          {
            stripeSessionId: booking.bookingPayment.stripeSessionId,
            paymentAmount: booking.bookingPayment.paymentAmount,
            currency: booking.bookingPayment.currency,
            soloTotal: booking.bookingPayment.soloTotal,
            baseTotal: booking.bookingPayment.baseTotal,
            paymentTimestamp: booking.bookingPayment.paymentTimestamp,
          },
        );

        rows.push(participantToRow(participantDetails, booking.tourReference, booking.bookingData.start, tourEnd, booking.bookingData.tourType));
      });

      const writeResult = await this.writeDataToGoogleSheets(
        SHEET_RANGE,
        rows,
      );
      if (!writeResult.success) {
        throw new Error(
          `Failed to write to Google Sheets: ${writeResult.error}`,
        );
      }

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

      return {
        success: true,
        rowsAdded: response.data.updates?.updatedRows || rows.length,
      };
    } catch (error) {
      console.error("Failed to write to Google Sheets:", error);
      return { success: false, error: String(error) };
    }
  }

  // not used yet
  async updateParticipant(
    bookingRef: string,
    participantEmail: string,
    updates: Partial<ParticipantDetails>,
  ) {
    try {
      console.log(
        `Updating participant ${participantEmail} in booking ${bookingRef}`,
        updates,
      );

      // Read all data from the sheet to find the participant row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: SHEET_DATA_RANGE,
      });

      const rows = response.data.values || [];

      if (rows.length === 0) {
        return {
          success: false,
          message: "No data found in Google Sheets",
        };
      }

      // Find the row matching bookingRef (column A) and participantEmail (column C)
      const rowIndex = rows.findIndex(
        (row) => row[0] === bookingRef && row[2] === participantEmail,
      );

      if (rowIndex === -1) {
        return {
          success: false,
          message: `Participant ${participantEmail} not found in booking ${bookingRef}`,
        };
      }

      // Calculate actual sheet row number (add 2: 1 for header, 1 for 0-based index)
      const sheetRowNumber = rowIndex + 2;
      const currentRow = rows[rowIndex];

      // Build updated row with changes applied
      const updatedRow = [...currentRow];

      // Column mapping for direct updates
      const columnMap: Record<string, number> = {
        status: 3,
        dietary: 8,
        medical: 9,
      };

      // Apply direct field updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && columnMap[key] !== undefined) {
          updatedRow[columnMap[key]] = value;
        }
      });

      // Apply nested object updates
      if (updates.emergencyContact) {
        if (updates.emergencyContact.name !== undefined) updatedRow[10] = updates.emergencyContact.name;
        if (updates.emergencyContact.phone !== undefined) updatedRow[11] = updates.emergencyContact.phone;
      }
      if (updates.insurance) {
        if (updates.insurance.provider !== undefined) updatedRow[12] = updates.insurance.provider;
        if (updates.insurance.number !== undefined) updatedRow[13] = updates.insurance.number;
      }
      if (updates.passport) {
        if (updates.passport.number !== undefined) updatedRow[14] = updates.passport.number;
        if (updates.passport.expiryDate !== undefined) updatedRow[15] = updates.passport.expiryDate;
      }
      if (updates.flightDetails) {
        if (updates.flightDetails.arrivalFlightNumber !== undefined) updatedRow[16] = updates.flightDetails.arrivalFlightNumber;
        if (updates.flightDetails.arrivalDate !== undefined) updatedRow[17] = updates.flightDetails.arrivalDate;
        if (updates.flightDetails.arrivalTime !== undefined) updatedRow[18] = updates.flightDetails.arrivalTime;
        if (updates.flightDetails.departureFlightNumber !== undefined) updatedRow[19] = updates.flightDetails.departureFlightNumber;
        if (updates.flightDetails.departureDate !== undefined) updatedRow[20] = updates.flightDetails.departureDate;
        if (updates.flightDetails.departureTime !== undefined) updatedRow[21] = updates.flightDetails.departureTime;
      }
      if (updates.pilot) {
        if (updates.pilot.flyingExperience !== undefined) updatedRow[24] = updates.pilot.flyingExperience;
        if (updates.pilot.pilotRating !== undefined) updatedRow[25] = updates.pilot.pilotRating ? "TRUE" : "FALSE";
        if (updates.pilot.thirdParty !== undefined) updatedRow[26] = updates.pilot.thirdParty ? "TRUE" : "FALSE";
        if (updates.pilot.annexe2 !== undefined) updatedRow[27] = updates.pilot.annexe2 ? "TRUE" : "FALSE";
        if (updates.pilot.gliderManufacturer !== undefined) updatedRow[28] = updates.pilot.gliderManufacturer;
        if (updates.pilot.gliderModel !== undefined) updatedRow[29] = updates.pilot.gliderModel;
        if (updates.pilot.gliderSize !== undefined) updatedRow[30] = updates.pilot.gliderSize;
        if (updates.pilot.gliderColours !== undefined) updatedRow[31] = updates.pilot.gliderColours;
      }

      // Update the specific row in Google Sheets
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Sheet1!A${sheetRowNumber}:AH${sheetRowNumber}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [updatedRow],
        },
      });

      console.log(
        `Successfully updated participant ${participantEmail} in booking ${bookingRef}`,
      );

      return {
        success: true,
        message: `Updated participant ${participantEmail}`,
        rowNumber: sheetRowNumber,
      };
    } catch (error) {
      console.error("Error updating participant in Google Sheets:", error);
      return {
        success: false,
        message: `Failed to update participant: ${error}`,
      };
    }
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

  // not used yet
  async getAllBookings() {
    try {
      console.log("Fetching all bookings from Google Sheets...");

      // Read all data from the sheet (skip header row)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: SHEET_DATA_RANGE,
      });

      const rows = response.data.values || [];

      if (rows.length === 0) {
        return {
          success: true,
          bookings: [],
          message: "No booking data found in Google Sheets",
        };
      }

      // Parse rows using DRY helper
      const participantsWithTours = rows
        .filter((row) => row[0]) // Filter out empty rows (must have tour reference)
        .map(row => rowToParticipant(row));

      // Group participants by tour start date
      const toursByDate = participantsWithTours.reduce(
        (tours, { participant, tour }) => {
          const tourDate = tour.startDate;
          if (!tours[tourDate]) {
            tours[tourDate] = {
              tourStartDate: tour.startDate,
              tourEndDate: tour.endDate,
              tourType: tour.type,
              participants: [],
              totalPeople: 0,
              totalRevenue: 0,
              pilotsCount: 0,
              currency: participant.paymentInfo?.currency || "GBP",
            };
          }

          tours[tourDate].participants.push(participant);
          tours[tourDate].totalPeople += 1;

          // Add revenue only from the person who made the payment (has paymentInfo)
          if (participant.paymentInfo) {
            tours[tourDate].totalRevenue +=
              participant.paymentInfo.paymentAmount;
          }

          // Count pilots
          if (participant.pilot?.pilotRating) {
            tours[tourDate].pilotsCount += 1;
          }

          return tours;
        },
        {} as Record<string, TourByDate>,
      );

      // Convert to array and sort by date
      const bookings = Object.values(toursByDate).sort(
        (a: TourByDate, b: TourByDate) =>
          new Date(b.tourStartDate).getTime() -
          new Date(a.tourStartDate).getTime(),
      );

      console.log(`Successfully fetched ${bookings.length} unique bookings`);

      return {
        success: true,
        bookings,
        message: `Found ${bookings.length} bookings`,
      };
    } catch (error) {
      console.error("Error fetching bookings from Google Sheets:", error);
      return {
        success: false,
        bookings: [],
        message: "Failed to fetch bookings from Google Sheets",
      };
    }
  }
}

// The GoogleSheetsBookingService class was perfect for the immediate
//    need (catching booking data), but for a custom dashboard +
//   customer portal, you're right to reconsider.

//   For your evolving architecture, I'd suggest:

//   Short term (keep the class):
//   - Google Sheets as your business intelligence backbone
//   - Gives you immediate data analysis and CSV export
//   - Zero hosting costs for database functionality

//   Medium term (hybrid approach):
//   - Add a proper database (PostgreSQL/Supabase/PlanetScale)
//   - Keep Google Sheets as backup/reporting layer
//   - Database for real-time dashboard queries
//   - Google Sheets for business analytics/exports

//   Long term (evolve the class):
//   - Transform GoogleSheetsBookingService into BookingDataService
//   - Abstract interface that can write to both database AND sheets
//   - Customer portal reads from database (fast queries)
//   - Your business dashboard can use both sources

//   Architecture vision:
//   Customer Booking → Database (primary) → Customer Portal
//                   ↘ Google Sheets (backup) → Business Analytics

//   The class structure you have is actually perfect for this
//   evolution - you can extend it to handle multiple data destinations
//    without changing the booking flow.
