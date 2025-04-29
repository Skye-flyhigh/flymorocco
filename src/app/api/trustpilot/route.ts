import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.trustpilot.com/your-endpoint", {
    headers: {
      Authorization: `Bearer ${process.env.TRUSTPILOT_API_KEY}`,
    },
  });
  const data = await res.json();
  return NextResponse.json(data);
}
