import generateAnnexe2 from "../pdf/generateAnnexe2";
import generateAnnexe4 from "../pdf/generateAnnexe4";
import {
  CaaFormState,
  FormData,
  FormDataMapSchema,
} from "../validation/CaaFormdata";

export async function submitCaaForm(
  prevState: CaaFormState,
  formData: FormData,
): Promise<CaaFormState> {
  //Check if the data is sent through
  if (!formData) {
    return {
      ...prevState,
      error: "caaForm.submitError.noData",
      success: false,
      formData: {},
    };
  }

  //Data validation through Zod
  const result = FormDataMapSchema.safeParse(formData);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
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

  // Logic: Save to DB, send email, generate PDF, etc
  console.log("✅ Valid CAA submission:", formData);
  await generateAnnexe2(formData); // PDF generation
  await generateAnnexe4(formData);
  // await sendSubmissionEmail(formData);   // Email output
  // await saveSubmissionToDB(formData);    // DB persistence

  return {
    ...prevState,
    error: null,
    success: true,
  };
}
