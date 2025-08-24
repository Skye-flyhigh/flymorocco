import { NextResponse } from "next/server";
import { testGoogleSheetsConnection } from "@/lib/services/googleSheetsService";

export async function GET() {
  try {
    const result = await testGoogleSheetsConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Google Sheets connection successful!",
        headers: result.headers,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Google Sheets connection failed",
          error: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Test endpoint error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
