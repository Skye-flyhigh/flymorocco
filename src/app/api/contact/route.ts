import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactDataSchema } from "@/lib/validation/ContactFormData";
import { escapeHTML } from "@/lib/security/escapeHTML";
import { verifyRecaptcha } from "@/lib/security/verifyRecaptcha";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const formValues = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    // Verify reCAPTCHA
    const recaptchaToken = formData.get("recaptcha-token") as string;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: "Please complete the reCAPTCHA verification" },
        { status: 400 },
      );
    }

    // Validate form data
    const { success, error, data } = ContactDataSchema.safeParse(formValues);
    if (!success) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Send email
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Flymorocco <contact@flymorocco.info>",
      to: ["contact@flymorocco.info"],
      subject: "New Contact Form Submission",
      replyTo: data.email,
      html: `<p>${escapeHTML(data.name)} (${escapeHTML(data.email)}) contacted you:</p>
             <p>${escapeHTML(data.message)}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
