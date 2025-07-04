interface RecaptchaVerificationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(token: string): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA secret key not configured");
    return { success: false, error: "Server configuration error" };
  }

  if (!token) {
    return { success: false, error: "No reCAPTCHA token provided" };
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data: RecaptchaVerificationResponse = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return {
        success: false,
        error: "reCAPTCHA verification failed",
      };
    }

    // For v3, check score (0.0 = bot, 1.0 = human)
    const minScore = 0.5; // Adjust threshold as needed
    if (data.score !== undefined && data.score < minScore) {
      console.warn(`reCAPTCHA score too low: ${data.score}`);
      return {
        success: false,
        score: data.score,
        error: "reCAPTCHA score too low",
      };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      error: "reCAPTCHA verification failed",
    };
  }
}
