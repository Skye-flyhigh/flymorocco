import { NextRequest, NextResponse } from "next/server";
import { resendPdfEmail } from "@/lib/email/resendPdfEmail";
import { emailAttachment, pdfFile } from "@/lib/pdf/annexeTypes";
import generateAnnexe2 from "@/lib/pdf/generateAnnexe2";
import generateAnnexe4 from "@/lib/pdf/generateAnnexe4";
import { escapeHTML } from "@/lib/security/escapeHTML";
import { verifyRecaptcha } from "@/lib/security/verifyRecaptcha";
import {
  FormDataMapSchema,
  FullFormSchemaType,
  ParticipantType,
} from "@/lib/validation/CaaFormdata";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const requestFormData = await request.formData();

    // Convert FormData to your expected format
    const formData: { [key: string]: string } = {};
    requestFormData.forEach((value, key) => {
      formData[key] = value.toString();
    });

    // Check if the data is sent through
    if (!formData) {
      console.error("❌ Form data missing");
      return NextResponse.json(
        { success: false, error: "form.submitError.noData" },
        { status: 400 },
      );
    }

    // Verify reCAPTCHA
    const recaptchaToken = formData["recaptcha-token"];
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success) {
      console.error("❌ reCAPTCHA verification failed");
      return NextResponse.json(
        { success: false, error: "form.submitError.recaptcha" },
        { status: 400 },
      );
    }

    console.log("📦 Raw entries formData:", formData);

    const baseData = {
      formType: formData.formType as "annexe2" | "annexe2and4",
      identification: {
        firstName: escapeHTML(formData["identification.firstName"]),
        lastName: escapeHTML(formData["identification.lastName"]),
        ...(formData.formType === "annexe2and4" && {
          nationality: escapeHTML(formData["identification.nationality"]),
          passportNumber: escapeHTML(formData["identification.passportNumber"]),
        }),
      },
      contact: {
        contactEmail: escapeHTML(formData["contact.contactEmail"]),
        ...(formData.formType === "annexe2and4" && {
          contactPhone: Number(formData["contact.contactPhone"]),
          address: escapeHTML(formData["contact.address"]),
        }),
      },
    };

    // Parse participants and siteSelection if present
    const checkDateFormatParticipants = (participantArr: ParticipantType[]) => {
      for (let i = 0; i < participantArr.length; i++) {
        const date = new Date(participantArr[i].insuranceValidity);
        participantArr[i].insuranceValidity = date;
      }
      return participantArr;
    };

    let participants: ParticipantType[] = [];
    if (formData["participants"]) {
      try {
        participants = checkDateFormatParticipants(
          JSON.parse(formData["participants"]),
        );
      } catch (err) {
        console.error("❌ Error parsing participants:", err);
      }
    }

    const fullData =
      formData.formType === "annexe2and4"
        ? {
            ...baseData,
            identification: {
              ...baseData.identification,
              nationality: escapeHTML(formData["identification.nationality"]),
              passportNumber: escapeHTML(
                formData["identification.passportNumber"],
              ),
            },
            contact: {
              ...baseData.contact,
              contactPhone: Number(formData["contact.contactPhone"]),
              address: escapeHTML(formData["contact.address"]),
            },
            trip: {
              startDate: new Date(formData["trip.startDate"]),
              endDate: new Date(formData["trip.endDate"]),
              insuranceValidity: new Date(formData["trip.insuranceValidity"]),
            },
            glider: {
              gliderManufacturer: escapeHTML(
                formData["glider.gliderManufacturer"],
              ),
              gliderModel: escapeHTML(formData["glider.gliderModel"]),
              gliderSize: escapeHTML(formData["glider.gliderSize"]),
              gliderColors: escapeHTML(formData["glider.gliderColors"]),
            },
            siteSelection: JSON.parse(formData["siteSelection"]),
            participants,
          }
        : baseData;

    console.log("Formatted Data before Zod parsing:", fullData);

    // Data validation through Zod
    const parsed = FormDataMapSchema.safeParse(fullData);
    if (!parsed.success) {
      console.error("❌ FormData: Zod parsing error: ", parsed.error.flatten());

      const fieldErrors = parsed.error.flatten().fieldErrors;
      const errorMap: Record<string, string> = {};

      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages) {
          errorMap[field] = messages[0];
        }
      }
      return NextResponse.json(
        {
          success: false,
          error: "Form validation failed: " + Object.keys(errorMap).join(" "),
        },
        { status: 400 },
      );
    }

    console.log("📑 Preparing the attachments for the emails...");

    const attachments: emailAttachment = [];

    async function sendFormEmail(
      name: string,
      annex: string,
      attachments: emailAttachment,
    ) {
      await resendPdfEmail({
        to: parsed.data?.contact.contactEmail || "contact@flymorocco.info",
        subject: `Flymorocco - Your ${escapeHTML(annex)} Form`,
        html: `
        <p>Hello ${escapeHTML(name)},<br>Your annexes (<strong>${escapeHTML(annex)}</strong>) is attached.</p>
        <p>Do not share this email; it contains personal documents…</p>
        `,
        attachments,
      });
    }

    async function cleanupPdfFiles(files: pdfFile[]) {
      for (const file of files) {
        try {
          await fs.unlink(file.filePath);
          console.log(`🧹 Cleaned up: ${file.fileName}`);
        } catch (err) {
          console.error(`❌ Failed to cleanup ${file.fileName}:`, err);
        }
      }
    }

    const generatedFiles: pdfFile[] = [];

    try {
      if (parsed.data.formType === "annexe2") {
        const annexe2: pdfFile = await generateAnnexe2(parsed.data);
        generatedFiles.push(annexe2);
        attachments.push(annexe2);

        await sendFormEmail(
          parsed.data.identification.firstName,
          "Annexe 2",
          attachments,
        );
      } else {
        const annexe2: pdfFile = await generateAnnexe2(parsed.data);

        // Narrow the type manually using type assertion
        const fullData = parsed.data as FullFormSchemaType;

        const annexe4: pdfFile = await generateAnnexe4(fullData);
        generatedFiles.push(annexe2, annexe4);
        attachments.push(annexe2, annexe4);

        await sendFormEmail(
          parsed.data.identification.firstName,
          "Annexe 2 and 4",
          attachments,
        );
      }

      console.log(
        `📧 Sent ${parsed.data.formType} email to ${parsed.data.contact.contactEmail}`,
      );

      return NextResponse.json({ success: true });
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError);
      return NextResponse.json(
        { success: false, error: "form.submitError.emailFailed" },
        { status: 500 },
      );
    } finally {
      // Always clean up generated files, regardless of success or failure
      await cleanupPdfFiles(generatedFiles);
    }
  } catch (error) {
    console.error("CAA form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
