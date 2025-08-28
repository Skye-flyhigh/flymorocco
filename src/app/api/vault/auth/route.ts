import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulAttempt,
} from "@/lib/security/rateLimiter";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit before processing
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: rateLimitCheck.message || "Too many attempts" },
        { status: 429 },
      );
    }

    const vaultPassword = process.env.VAULT_PASSWORD;

    if (!vaultPassword) {
      console.error("VAULT_PASSWORD environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (password === vaultPassword) {
      // Success! Clear any failed attempts for this IP
      recordSuccessfulAttempt(ip);
      console.log(`Successful vault login from IP: ${ip}`);

      // Set secure cookie with 24 hour expiry
      const response = NextResponse.json({ success: true });

      response.cookies.set("vault-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    } else {
      // Failed attempt - record it for rate limiting
      recordFailedAttempt(ip);
      console.warn(`Failed vault login attempt from IP: ${ip}`);

      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Vault auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
