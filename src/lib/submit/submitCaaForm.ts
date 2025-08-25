"use server";
import { resendPdfEmail } from "../email/resendPdfEmail";
import { emailAttachment, pdfFile } from "../pdf/annexeTypes";
import generateAnnexe2 from "../pdf/generateAnnexe2";
import generateAnnexe4 from "../pdf/generateAnnexe4";
import { escapeHTML } from "../security/escapeHTML";
import {
  FormDataMapSchema,
  FullFormSchemaType,
  ParticipantType,
} from "../validation/CaaFormdata";
import fs from "fs/promises";

export type CaaFormState = {
  formData: Record<string, string | Date>;
  error: string | null;
  success: boolean;
};

export async function submitCaaForm(
  prevState: CaaFormState,
  formData: FormData,
): Promise<CaaFormState> {
  //Check if the data is sent through
  if (!formData) {
    console.error("❌ Form data missing");

    return {
      ...prevState,
      error: "form.submitError.noData",
      success: false,
      formData,
    };
  }
  console.log("📦 Raw entries formData:", formData);

  const baseData = {
    formType: formData.get("formType") as "annexe2" | "annexe2and4",
    identification: {
      lastName: escapeHTML(formData.get("identification.lastName") as string),
      firstName: escapeHTML(formData.get("identification.firstName") as string),
    },
    contact: {
      contactEmail: escapeHTML(formData.get("contact.contactEmail") as string),
    },
  };

  const checkDateFormatParticipants = (participantArr: ParticipantType[]) => {
    for (let i = 0; i < participantArr.length; i++) {
      const date = new Date(participantArr[i].insuranceValidity);
      participantArr[i].insuranceValidity = date;
    }
    return participantArr;
  };
  let participants: ParticipantType[] = [];
  if (formData.get("participants")) {
    participants = checkDateFormatParticipants(
      JSON.parse(formData.get("participants") as string),
    );
  }

  const fullData =
    formData.get("formType") === "annexe2and4"
      ? {
          ...baseData,
          identification: {
            ...baseData.identification,
            nationality: escapeHTML(
              formData.get("identification.nationality") as string,
            ),
            passportNumber: escapeHTML(
              formData.get("identification.passportNumber") as string,
            ),
          },
          contact: {
            ...baseData.contact,
            contactPhone: Number(formData.get("contact.contactPhone")),
            address: escapeHTML(formData.get("contact.address") as string),
          },
          trip: {
            startDate: new Date(formData.get("trip.startDate") as string),
            endDate: new Date(formData.get("trip.endDate") as string),
            insuranceValidity: new Date(
              formData.get("trip.insuranceValidity") as string,
            ),
          },
          glider: {
            gliderManufacturer: escapeHTML(
              formData.get("glider.gliderManufacturer") as string,
            ),
            gliderModel: escapeHTML(
              formData.get("glider.gliderModel") as string,
            ),
            gliderSize: escapeHTML(formData.get("glider.gliderSize") as string),
            gliderColors: escapeHTML(
              formData.get("glider.gliderColors") as string,
            ),
          },
          siteSelection: JSON.parse(formData.get("siteSelection") as string),
          participants,
        }
      : baseData;

  // Verify reCAPTCHA
  const recaptchaToken = formData.get("recaptcha-token");
  const recaptchaResult = await recaptchaToken;

  if (!recaptchaResult) {
    console.error("❌ reCAPTCHA verification failed");
    return {
      ...prevState,
      error: "form.submitError.recaptcha",
      success: false,
      formData: prevState.formData,
    };
  }

  console.log("Formatted Data before Zod parsing:", fullData);

  //Data validation through Zod
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
    return {
      ...prevState,
      error: "Form validation failed:" + Object.keys(errorMap).join(" "),
      formData: prevState.formData,
      success: false,
    };
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
      recipientName: name,
      subject: `Flymorocco - Your ${escapeHTML(annex)} Form`,
      content: `
      <p>Your annexes (<strong>${escapeHTML(annex)}</strong>) are attached to this email.</p>
      <p><strong>Important:</strong> Do not share this email as it contains personal documents with your information.</p>
      <p>Keep these forms safe for your paragliding activities in Morocco.</p>
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

    return {
      ...prevState,
      error: null,
      success: true,
    };
  } catch (emailError) {
    console.error("❌ Error sending email:", emailError);
    return {
      ...prevState,
      error: "form.submitError.emailFailed",
      success: false,
    };
  } finally {
    // Always clean up generated files, regardless of success or failure
    await cleanupPdfFiles(generatedFiles);
  }
}
