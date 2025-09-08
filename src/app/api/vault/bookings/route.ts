import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Check authentication
  const cookieStore = await cookies();
  const vaultAuth = cookieStore.get("vault-auth");

  if (!vaultAuth || vaultAuth.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use the Google Sheets service to get booking data
    // const sheetsService = new GoogleSheetsBookingService();
    // const result = await sheetsService.getAllBookings();
    const result = {
      success: true,
      message: "Success",
      bookings: [
        { id: "FM2025082602", name: "John Doe", email: "john.doe@email.com" },
      ],
    };

    if (result.success) {
      return NextResponse.json({
        success: true,
        bookings: result.bookings,
        message: result.message,
      });
    } else {
      return NextResponse.json({
        success: false,
        bookings: [],
        message: "Failed to fetch bookings from Google Sheets",
      });
    }
  } catch (error) {
    console.error("Vault bookings API error:", error);
    return NextResponse.json(
      {
        success: false,
        bookings: [],
        message: "Error fetching booking data",
      },
      { status: 500 },
    );
  }
}
