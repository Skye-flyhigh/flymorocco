"use server";
import { resendPdfEmail } from "../email/resendPdfEmail";
import { emailAttachment, pdfFile } from "../pdf/annexeTypes";
import generateAnnexe2 from "../pdf/generateAnnexe2";
import generateAnnexe4 from "../pdf/generateAnnexe4";
import {
  Annex2Type,
  FormData,
  FormDataMapSchema,
  FullFormSchemaType,
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
  const entries = Object.fromEntries(formData.entries());
  console.log("📦 Raw formData entries:", entries);

  const baseData = {
    formType: entries.formType as "annexe2" | "annexe2and4",
    identification: {
      lastName: entries["identification.lastName"],
      firstName: entries["identification.firstName"],
    },
    contact: {
      contactEmail: entries["contact.contactEmail"],
    },
  };

  const fullData =
    entries.formType === "annexe2and4"
      ? {
          ...baseData,
          identification: {
            lastName: entries["lastName"],
            firstName: entries["firstName"],
            nationality: entries["nationality"],
            passportNumber: entries["passportNumber"],
          },
          contact: {
            contactEmail: entries["contactEmail"],
            contactPhone: Number(entries["contactPhone"]),
            address: entries["address"],
          },
          trip: {
            insuranceValidity: new Date(entries["insuranceValidity"]),
            startDate: new Date(entries["startDate"]),
            endDate: new Date(entries["endDate"]),
          },
          siteSelection: JSON.parse(entries["siteSelection"]),
          participants: JSON.parse(entries["participants"]),
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
