"use server";
import { BUSINESS, SITE_NAME } from "@/data/metadata";
import { Resend } from "resend";
import fs from "fs";
import * as dotenv from "dotenv";
import { createEmailTemplate } from "./templates/emailTemplate";
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendPdfEmail({
  to,
  recipientName,
  subject,
  content,
  footerContent,
  attachments,
}: {
  to: string;
  recipientName: string;
  subject: string;
  content: string;
  footerContent?: string;
  attachments: { filePath: string; fileName: string }[];
}) {
  try {
    const encodedAttachments = attachments.map((file) => ({
      filename: file.fileName.endsWith(".pdf")
        ? file.fileName
        : `${file.fileName}.pdf`,
      content: fs.readFileSync(file.filePath).toString("base64"),
      type: "application/pdf",
      disposition: "attachment",
    }));

    // Create professional email with template
    const htmlEmail = createEmailTemplate({
      recipientName,
      content,
      footerContent: footerContent || "Official Documents - FlyMorocco 📋",
    });

    const { data, error } = await resend.emails.send({
      from: `${SITE_NAME} Documents <documents@flymorocco.info>`,
      replyTo: BUSINESS.contact.email,
      to: [to],
      subject,
      html: htmlEmail,
      attachments: encodedAttachments,
    });
    if (error) {
      console.error("❌ Email send failed:", error);
    }

    return data;
  } catch (err) {
    console.error("❌ Unexpected error in sendSubmissionEmail:", err);
  }
}

// Legacy function for backward compatibility
export async function resendPdfEmailLegacy({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments: { filePath: string; fileName: string }[];
}) {
  try {
    const encodedAttachments = attachments.map((file) => ({
      filename: file.fileName.endsWith(".pdf")
        ? file.fileName
        : `${file.fileName}.pdf`,
      content: fs.readFileSync(file.filePath).toString("base64"),
      type: "application/pdf",
      disposition: "attachment",
    }));

    const { data, error } = await resend.emails.send({
      from: `No-Reply - ${SITE_NAME} <${BUSINESS.contact.noreply}>`,
      to: [to],
      subject,
      html,
      attachments: encodedAttachments,
    });
    if (error) {
      console.error("❌ Email send failed:", error);
    }

    return data;
  } catch (err) {
    console.error("❌ Unexpected error in sendSubmissionEmail:", err);
  }
}
