"use server";

import { Resend } from "resend";
import { ContactDataSchema } from "../validation/ContactFormData";

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

  const { success, error, data } = ContactDataSchema.safeParse(formValues);
  if (!success) {
    return {
      data: formValues,
      errors: error.flatten().fieldErrors,
      success: false,
    };
  }

  //TODO: Insert Contact form logic to send emails here
  console.log(
    "✅ Message successfully sent.",
    `${formValues.name} (${formValues.email}) wants to say: ${formValues.message}`,
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "FlyMorocco <contact@flymorocco.info>",
    to: ["contact@flymorocco.info"],
    subject: "New Contact Form Submission",
    replyTo: data.email,
    html: `<p><strong>Name:</strong> ${data.name}</p>
         <p><strong>Email:</strong> ${data.email}</p>
         <p><strong>Message:</strong><br>${data.message}</p>`,
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
