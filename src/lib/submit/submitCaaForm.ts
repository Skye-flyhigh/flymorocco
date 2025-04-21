// app/lib/submitCaaForm.ts (or /server/submitCaaForm.ts)
"use server";

import { FormData, FormDataMapSchema } from "../validation/CaaFormdata";

export async function submitCaaForm(prevState: any, formData: FormData) {
  const result = FormDataMapSchema.safeParse(formData);

  //Data validation
  const requiredFields = FormDataMapSchema;
  const validateRequiredFields = (data, requiredFields: string[]) => {
    const errors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!data[field]) {
        errors[field] = t("missingField");
      }
    });
    return errors;
  };

  const data = Object.fromEntries(currState.formData.entries()); //FIXME: needs to add siteSelection in there too
  if (!data) {
    return {
      ...prevState,
      error: t("submitError") + " No data received.",
      success: false,
      formData: {},
    };
  }
  console.log("📑 Form data: ", data);

  const errors = validateRequiredFields(formData, requiredFields);
  if (Object.keys(errors).length > 0) {
    setInputErrors(errors);
    return {
      ...prevState,
      formData: formData,
      error: "Missing fields",
      success: false,
    };
  }

  if (!result.success) {
    return {
      error: "Form validation failed.",
      issues: result.error.flatten().fieldErrors,
      success: false,
    };
  }
  // Logic: Save to DB, send email, generate PDF, etc
  console.log("✅ Valid CAA submission:", result.data);

  return {
    ...prevState,
    error: null,
    success: true,
    //TODO: add site selections and start and end dates
  }; //FIXME: setSiteSelector back to ""
}
