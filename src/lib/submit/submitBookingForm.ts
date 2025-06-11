"use server";

import { Resend } from "resend";
import { BookingFormSchema } from "../validation/BookFormData";
import { escapeHTML } from "../security/escapeHTML";

export type BookingFormState = {
  data: {
    name: string;
    email: string;
    start: string;
  };
  errors: null | {
    name?: string[];
    email?: string[];
  };
  success: boolean;
};

export async function submitBooking(
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const formValues = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    start: formData.get("start") as string,
  };
  console.log("Booking form values:", formValues);
  
  const { success, error, data } = BookingFormSchema.safeParse(formValues);
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
    subject: "New Booking request",
    replyTo: data.email,
    html: `<p>${escapeHTML(data.name)} (${escapeHTML(data.email)}) wants to book the following week starting the:</p>
         <p>${escapeHTML(data.start)}</p>`,
  });

  return {
    data: {
      name: "",
      email: "",
      start: formValues.start,
    },
    errors: {},
    success: true,
  };
}
