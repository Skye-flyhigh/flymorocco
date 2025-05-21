"use server";
import { resendPdfEmail } from "../email/resendPdfEmail";
import { emailAttachment, pdfFile } from "../pdf/annexeTypes";
import generateAnnexe2 from "../pdf/generateAnnexe2";
import generateAnnexe4 from "../pdf/generateAnnexe4";
import {
  FormDataMapSchema,
  FullFormSchemaType,
  ParticipantType,
} from "../validation/CaaFormdata";

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
      lastName: formData["identification.lastName"],
      firstName: formData["identification.firstName"],
    },
    contact: {
      contactEmail: formData["contact.contactEmail"],
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
            nationality: formData["identification.nationality"],
            passportNumber: formData["identification.passportNumber"],
          },
          contact: {
            ...baseData.contact,
            contactPhone: Number(formData["contact.contactPhone"]),
            address: formData["contact.address"],
          },
          trip: {
            startDate: new Date(formData["trip.startDate"]),
            endDate: new Date(formData["trip.endDate"]),
            insuranceValidity: new Date(formData["trip.insuranceValidity"]),
          },
          glider: {
            gliderManufacturer: formData["glider.gliderManufacturer"],
            gliderModel: formData["glider.gliderModel"],
            gliderSize: formData["glider.gliderSize"],
            gliderColors: formData["glider.gliderColors"],
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

  console.log("📑 Preparing the attachmennts for the emails...");

  const attachments: emailAttachment = [];

  async function sendFormEmail(
    name: string,
    annex: string,
    attachments: emailAttachment,
  ) {
    await resendPdfEmail({
      to: parsed.data?.contact.contactEmail || "contact@flymorocco.info",
      subject: `Flymorocco - Your ${annex} Form`,
      html: `<p>Hello ${name},<br>Your annexes (<strong>${annex}</strong>) is attached.</p>`,
      attachments,
    });
  }

  if (parsed.data.formType === "annexe2") {
    const annexe2: pdfFile = await generateAnnexe2(parsed.data);
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
}
