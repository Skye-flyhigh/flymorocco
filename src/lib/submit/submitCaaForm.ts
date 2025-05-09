import { sendPdfEmail } from "../email/sendWithAttachments";
import generateAnnexe2 from "../pdf/generateAnnexe2";
import generateAnnexe4 from "../pdf/generateAnnexe4";
import {
  FormData,
  FormDataMapSchema,
  FullFormSchemaType,
} from "../validation/CaaFormdata";

export type CaaFormState = {
  formData: FormData;
  error: string | null;
  success: boolean;
};

export async function submitCaaForm(
  prevState: CaaFormState,
  formData: FormData,
): Promise<CaaFormState> {
  //Check if the data is sent through
  if (!formData) {
    return {
      ...prevState,
      error: "form.submitError.noData",
      success: false,
      formData,
    };
  }

  //Data validation through Zod
  const parsed = FormDataMapSchema.safeParse(formData);
  if (!parsed.success) {
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

  let annexe2 = {
    fileName: "",
    outputPath: "",
  };

  let annexe4 = {
    fileName: "",
    outputPath: "",
  };

  async function sendFormEmail(
    name: string,
    filePath: string,
    fileName: string,
    annex: string,
  ) {
    await sendPdfEmail({
      to: parsed.data?.contact.contactEmail || "contact@flymorocco.info",
      subject: `Flymorocco - Your ${annex} Form`,
      html: `<p>Hello ${name},<br>Your form (<strong>${annex}</strong>) is attached.</p>`,
      filePath,
      fileName,
    });
  }

  if (parsed.data.formType === "annexe2") {
    annexe2 = await generateAnnexe2(parsed.data);

    await sendFormEmail(
      parsed.data.identification.firstName,
      annexe2.outputPath,
      annexe2.fileName,
      "Annexe 2",
    );
  } else {
    annexe2 = await generateAnnexe2(parsed.data);

    // Narrow the type manually using type assertion
    const fullData = parsed.data as FullFormSchemaType;

    annexe4 = await generateAnnexe4(fullData);

    await Promise.all([
      sendFormEmail(
        fullData.identification.firstName,
        annexe2.outputPath,
        annexe2.fileName,
        "Annexe 2",
      ),
      sendFormEmail(
        fullData.identification.firstName,
        annexe4.outputPath,
        annexe4.fileName,
        "Annexe 4",
      ),
    ]);
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
