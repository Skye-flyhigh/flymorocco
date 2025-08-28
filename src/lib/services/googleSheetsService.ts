import { google } from "googleapis";
import {
  BookingConfirmationData,
  ParticipantDetails,
} from "../types/bookingDetails";
import { TourByDate } from "../types/tour";

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
          participant.soloOccupancy ? "TRUE" : "FALSE", // Solo Occupancy
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
          participant.paymentInfo?.paymentAmount
            ? (participant.paymentInfo.paymentAmount / 100).toFixed(2)
            : "", // Payment amount (convert from pence)
          participant.paymentInfo?.currency || "", // Currency (only booker)
          participant.timestamp, // Timestamp
          participant.pilotRating !== undefined ? "TRUE" : "FALSE", // is Pilot
          participant.flyingExperience || "FALSE", // Flying Experience
          participant.pilotRating ? "TRUE" : "FALSE", // Pilot Rating
          participant.thirdParty ? "TRUE" : "FALSE", // Third party liability
          participant.annexe2 ? "TRUE" : "FALSE", // Annex 2
          participant.gliderManufacturer || "FALSE", // Glider Manufacturer
          participant.gliderModel || "FALSE", // Glider Model
          participant.gliderSize || "FALSE", // Glider Size
          participant.gliderColours || "FALSE", // Glider Colours
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
    try {
      console.log("Fetching all bookings from Google Sheets...");

      // Read all data from the sheet (skip header row)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Sheet1!A2:AH1000", // Get up to 1000 rows, adjust as needed
      });

      const rows = response.data.values || [];

      if (rows.length === 0) {
        return {
          success: true,
          bookings: [],
          message: "No booking data found in Google Sheets",
        };
      }

      // Parse rows into proper ParticipantDetails objects
      const participants = rows
        .filter((row) => row[0]) // Filter out empty rows (must have tour reference)
        .map((row) => ({
          name: row[1] || "",
          email: row[2] || "",
          soloOccupancy: row[6] === "TRUE",
          dietary: row[7] || "",
          medical: row[8] || "",
          emergencyContact: {
            name: row[9] || "",
            phone: row[10] || "",
          },
          insurance: {
            provider: row[11] || "",
            number: row[12] || "",
          },
          passport: {
            number: row[13] || "",
            expiryDate: row[14] || "",
          },
          flightDetails: {
            arrivalFlightNumber: row[15] || "",
            arrivalDate: row[3] || "", // Use tour start date as default
            arrivalTime: row[16] || "",
            departureFlightNumber: row[17] || "",
            departureDate: row[4] || "", // Use tour end date as default
            departureTime: row[18] || "",
          },
          paymentInfo: row[19]
            ? {
                // Only if there's a stripe session ID
                stripeSessionId: row[19],
                paymentAmount: parseFloat(row[20] || "0"),
                currency: row[21] || "GBP",
                soloTotal: 0, // These would need to be stored separately if needed
                baseTotal: 0,
                paymentTimestamp: row[22] || "",
              }
            : undefined,
          timestamp: row[22] || new Date().toISOString(),
          // Additional fields for pilots
          flyingExperience: row[23] || "",
          pilotRating: row[24] === "TRUE",
          thirdParty: row[25] === "TRUE",
          annexe2: row[26] === "TRUE",
          gliderManufacturer: row[27] || "",
          gliderModel: row[28] || "",
          gliderSize: row[29] || "",
          gliderColours: row[30] || "",
          // Tour context (not part of ParticipantDetails but needed for grouping)
          tourReference: row[0] || "",
          tourStartDate: row[3] || "",
          tourEndDate: row[4] || "",
          tourType: row[5] || "",
        })) as (ParticipantDetails & {
        tourReference: string;
        tourStartDate: string;
        tourEndDate: string;
        tourType: string;
      })[];

      // Group participants by tour start date
      const toursByDate = participants.reduce(
        (tours, participant) => {
          const tourDate = participant.tourStartDate;
          if (!tours[tourDate]) {
            tours[tourDate] = {
              tourStartDate: tourDate,
              tourEndDate: participant.tourEndDate,
              tourType: participant.tourType,
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
          if (participant.pilotRating) {
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
