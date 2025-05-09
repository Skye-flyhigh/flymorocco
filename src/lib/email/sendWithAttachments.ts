// lib/email/sendWithAttachment.ts
"use server"
import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendPdfEmail({
  to,
  subject,
  html,
  filePath,
  fileName,
}: {
  to: string;
  subject: string;
  html: string;
  filePath: string;
  fileName: string;
}) {
  const pdfBuffer = fs.readFileSync(path.resolve(filePath));

  const msg = {
    to,
    from: "no-reply@flymorocco.info", // Must be verified in SendGrid
    subject,
    html,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: fileName,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);
}
