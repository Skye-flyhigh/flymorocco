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
  formData: { [key: string]: string };
  error: string | null;
  success: boolean;
};

export async function submitCaaForm(
  prevState: CaaFormState,
  formData: { [key: string]: string },
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
    formType: formData.formType as "annexe2" | "annexe2and4",
    identification: {
      lastName: escapeHTML(formData["identification.lastName"]),
      firstName: escapeHTML(formData["identification.firstName"]),
    },
    contact: {
      contactEmail: escapeHTML(formData["contact.contactEmail"]),
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
  if (formData["participants"]) {
    participants = checkDateFormatParticipants(
      JSON.parse(formData["participants"]),
    );
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
      formData: formData,
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
      subject: `Flymorocco - Your ${escapeHTML(annex)} Form`,
      html: `<p>Hello ${escapeHTML(name)},<br>Your annexes (<strong>${escapeHTML(annex)}</strong>) is attached.</p>`,
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
