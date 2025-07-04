"use server";

import { Resend } from "resend";
import { ContactDataSchema } from "../validation/ContactFormData";
import { escapeHTML } from "../security/escapeHTML";
import { verifyRecaptcha } from "../security/verifyRecaptcha";

type ContactFormState = {
  data: {
    name: string;
    email: string;
    message: string;
  };
  errors: null | {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};

export default async function submitMessage(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const formValues = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };

  // Verify reCAPTCHA
  const recaptchaToken = formData.get("recaptcha-token") as string;
  const recaptchaResult = await verifyRecaptcha(recaptchaToken);

  if (!recaptchaResult.success) {
    return {
      data: formValues,
      errors: { message: ["Please complete the reCAPTCHA verification"] },
      success: false,
    };
  }

  const { success, error, data } = ContactDataSchema.safeParse(formValues);
  if (!success) {
    return {
      data: formValues,
      errors: error.flatten().fieldErrors,
      success: false,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Flymorocco <contact@flymorocco.info>",
    to: ["contact@flymorocco.info"],
    subject: "New Contact Form Submission",
    replyTo: data.email,
    html: `<p>${escapeHTML(data.name)} (${escapeHTML(data.email)}) contacted you:</p>
         <p>${escapeHTML(data.message)}</p>`,
  });

  return {
    data: {
      name: "",
      email: "",
      message: "",
    },
    errors: null,
    success: true,
  };
}
