//only used for emails that doesn't have a joint element
import { Resend } from 'resend';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY); 

export async function resendPdfEmail({
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
        const encodedAttachments = attachments.map(file => ({
            filename: file.fileName.endsWith(".pdf") ? file.fileName : `${file.fileName}.pdf`,
            content: fs.readFileSync(file.filePath).toString("base64"),
            type: "application/pdf",
            disposition: "attachment",
          }))

        const { data, error } = await resend.emails.send({
            from: 'No-Reply - Flymorocco <no-reply@flymorocco.info>',
            to: [to],
            subject,
            html,
            attachments: encodedAttachments
        });
        if(error) {
            console.error("❌ Email send failed:", error);
        }

        return data;
    } catch (err) {
        console.error("❌ Unexpected error in sendSubmissionEmail:", err);
    }
}