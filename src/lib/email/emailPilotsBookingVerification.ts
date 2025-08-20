"use server";

import { Resend } from "resend";
import { BookingFormData } from "../validation/BookFormData";
import {
  createPilotVerificationEmail,
  createPilotWelcomeEmail,
} from "./templates/pilotEmails";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PilotEmailResult {
  success: boolean;
  emailsSent: number;
  errors?: string[];
}

export async function emailPilotsBookingVerification(
  bookingData: BookingFormData,
  emailType: "verification" | "welcome" = "verification",
): Promise<PilotEmailResult> {
  // Collect all pilots (participants + main contact if pilot)
  const pilots = [];

  // Add pilot participants
  bookingData.participants.forEach((participant) => {
    if (participant.isPilot && participant.email) {
      pilots.push({
        name: participant.name,
        email: participant.email,
      });
    }
  });

  // Add main contact if they're a pilot
  if (bookingData.isPilot) {
    pilots.push({
      name: bookingData.name,
      email: bookingData.email,
    });
  }

  // Early return if no pilots to email
  if (pilots.length === 0) {
    return { success: true, emailsSent: 0 };
  }

  const errors: string[] = [];
  let emailsSent = 0;

  try {
    // Send emails to all pilots
    await Promise.all(
      pilots.map(async (pilot) => {
        try {
          const emailTemplate =
            emailType === "verification"
              ? createPilotVerificationEmail({
                  pilotName: pilot.name,
                  tourType: bookingData.tourType,
                  tourStart: bookingData.start,
                  mainContactName: bookingData.name,
                  mainContactEmail: bookingData.email,
                })
              : createPilotWelcomeEmail({
                  pilotName: pilot.name,
                  tourType: bookingData.tourType,
                  tourStart: bookingData.start,
                  mainContactName: bookingData.name,
                  mainContactEmail: bookingData.email,
                });

          await resend.emails.send({
            from: "FlyMorocco <noreply@flymorocco.info>",
            to: pilot.email,
            subject:
              emailType === "verification"
                ? `Pilot Information Request - ${bookingData.tourType} Tour`
                : `Welcome Pilot! Your ${bookingData.tourType} Adventure Awaits`,
            html: emailTemplate,
          });

          emailsSent++;
        } catch (emailError) {
          const errorMsg = `Failed to send email to ${pilot.email}: ${emailError}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }),
    );

    return {
      success: errors.length === 0,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error("Error in pilot email system:", error);
    return {
      success: false,
      emailsSent,
      errors: [`System error: ${error}`],
    };
  }
}
