import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const result = await resend.emails.send({
      from: "Flymorocco <reply@flymorocco.info>",
      to: [body.recipient],
      subject: "CAA Form Submission",
      html: `<p>${body.message}</p>`,
      attachments: [
        {
          filename: "Annexe2.pdf",
          content: body.annexe2Base64,
        },
        ...(body.annexe4Base64
          ? [
              {
                filename: "Annexe4.pdf",
                content: body.annexe4Base64,
              },
            ]
          : []),
      ],
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
