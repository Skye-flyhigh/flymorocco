import { BookingConfirmationData } from "../types/bookingDetails";
import { createEmailTemplate } from "./templates/emailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const { bookingData, bookingPayment, tourReference, totalPeople } = data;
  const paymentAmount = (bookingPayment.paymentAmount / 100).toLocaleString();

  // Create email content
  const content = `
    <p>Thank you for booking your <strong>${bookingData.tourType}</strong> paragliding adventure with Flymorocco!</p>
    
    <div style="background: #e8f5e8; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #2c5530; margin: 0 0 15px 0;">📅 Your Booking Details</h3>
      <p style="margin: 0 0 10px 0;"><strong>Tour:</strong> ${bookingData.tourType.charAt(0).toUpperCase() + bookingData.tourType.slice(1)} Week</p>
      <p style="margin: 0 0 10px 0;"><strong>Tour Reference:</strong> ${tourReference}</p>
      <p style="margin: 0 0 10px 0;"><strong>Start Date:</strong> ${new Date(bookingData.start).toLocaleDateString()}</p>
      <p style="margin: 0 0 10px 0;"><strong>Participants:</strong> ${totalPeople} person${totalPeople > 1 ? "s" : ""}</p>
      <p style="margin: 0 0 10px 0;"><strong>Main Contact:</strong> ${bookingData.name}</p>
      <p style="margin: 0;"><strong>Total Price:</strong> ${bookingPayment.currency} ${paymentAmount}</p>
      <p style="margin: 0;"><strong>Payment reference:</strong> ${bookingPayment.stripeSessionId}</p>
      </div>
    
    ${
      bookingData.participants.length > 0
        ? `
    <div style="border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0;">👥 Participants</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${bookingData.participants
          .map(
            (p) => `
          <li>${p.name}${p.isPilot ? " (Pilot)" : ""}${p.soloOccupancy ? " - Solo Room" : ""}</li>
        `,
          )
          .join("")}
      </ul>
    </div>
    `
        : ""
    }
    
    <div style="background: #fff3e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #ef6c00; margin: 0 0 15px 0;">📋 What Happens Next?</h3>
      <ol style="color: #ef6c00; margin: 0; padding-left: 20px;">
        <li>📧 You'll receive detailed pre-tour information within 24 hours</li>
        <li>🪂 Any pilots in your group will receive separate license verification requests</li>
        <li>📞 We'll contact you directly to confirm arrangements and answer questions</li>
        <li>✈️ Prepare for an incredible paragliding adventure in Morocco!</li>
      </ol>
    </div>
    
    <p><strong>Questions?</strong> Simply reply to this email or contact us directly.</p>
    <p><strong>Urgent matters:</strong> WhatsApp +212 636 04 17 61</p>
    
    <p style="margin-top: 25px;">
      We can't wait to show you Morocco's incredible landscapes from above!<br>
      <em>The Flymorocco Team</em> 🪂
    </p>
  `;

  const htmlEmail = createEmailTemplate({
    recipientName: bookingData.name,
    content,
    footerContent: "Adventure Awaits - Flymorocco 🪂",
  });

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: "Flymorocco <noreply@flymorocco.info>",
      replyTo: "Flymorocco <contact@flymorocco.info>",
      to: [bookingData.email],
      subject: `Booking Confirmed: ${tourReference} ${bookingData.tourType.charAt(0).toUpperCase() + bookingData.tourType.slice(1)} Tour - ${new Date(bookingData.start).toLocaleDateString()}`,
      html: htmlEmail,
    });

    if (error) {
      console.error("Failed to send booking confirmation:", error);
      return { success: false, error: error.message };
    }

    console.log("Booking confirmation sent successfully:", emailResult?.id);
    return { success: true, emailId: emailResult?.id };
  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendBookingNotification(data: BookingConfirmationData) {
  const { bookingData, totalPeople, bookingPayment, tourReference } = data;
  const paymentAmount = (bookingPayment.paymentAmount / 100).toLocaleString();

  // Create internal notification content
  const content = `
    <p>New booking received for <strong>${bookingData.tourType}</strong> tour!</p>
    
    <div style="border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0;">📊 Booking Summary</h3>
      <p style="margin: 0 0 10px 0;"><strong>Tour:</strong> ${bookingData.tourType.charAt(0).toUpperCase() + bookingData.tourType.slice(1)} Week</p>
      <p style="margin: 0 0 10px 0;"><strong>Tour Reference:</strong> ${tourReference}</p>
      <p style="margin: 0 0 10px 0;"><strong>Start Date:</strong> ${new Date(bookingData.start).toLocaleDateString()}</p>
      <p style="margin: 0 0 10px 0;"><strong>Participants:</strong> ${totalPeople} person${totalPeople > 1 ? "s" : ""}</p>
      <p style="margin: 0 0 10px 0;"><strong>Revenue:</strong> ${bookingPayment.currency} ${paymentAmount}</p>
      <p style="margin: 0;"><strong>Stripe Session:</strong> ${bookingPayment.stripeSessionId}</p>
    </div>
    
    <div style="background: #e3f2fd; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #1565c0; margin: 0 0 15px 0;">👤 Customer Details</h3>
      <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${bookingData.name}</p>
      <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${bookingData.email}</p>
      <p style="margin: 0;"><strong>Is Pilot:</strong> ${bookingData.isPilot ? "Yes ✈️" : "No"}</p>
    </div>
    ${
      bookingData.participants.length > 0
        ? `
    <div style="background: #fff3e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #ef6c00; margin: 0 0 15px 0;">👥 Participants</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${bookingData.participants
          .map(
            (p) => `
          <li><strong>${p.name}</strong>${p.isPilot ? " - Pilot ✈️ (" + p.email + ")" : ""}${p.soloOccupancy ? " - Solo Room 🏠" : ""}</li>
        `,
          )
          .join("")}
      </ul>
      ${
        bookingData.participants.filter((p) => p.isPilot).length > 0
          ? '<p style="margin: 10px 0 0 0; color: #ef6c00;"><strong>⚠️ License verification emails will be sent to pilots</strong></p>'
          : ""
      }
    </div>
    `
        : ""
    }
    
    <p><strong>Next Actions:</strong></p>
    <ol>
      <li>Review pilot credentials (if applicable)</li>
      <li>Send detailed pre-tour information</li>
      <li>Contact customer to confirm arrangements</li>
    </ol>
    
    <p style="margin-top: 25px;">
      <em>Booking processed via Flymorocco booking system</em> 🚀
    </p>
  `;

  const htmlEmail = createEmailTemplate({
    recipientName: "Flymorocco Team",
    content,
    footerContent: "Flymorocco Internal Booking System 📊",
  });

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: "Flymorocco Bookings <bookings@flymorocco.info>",
      replyTo: "contact@flymorocco.info",
      to: ["contact@flymorocco.info"],
      subject: `🎯 New Booking: ${tourReference} ${bookingData.tourType} - ${totalPeople} pax - ${bookingPayment.currency}${paymentAmount}`,
      html: htmlEmail,
    });

    if (error) {
      console.error("Failed to send booking notification:", error);
      return { success: false, error: error.message };
    }

    console.log("Booking notification sent successfully:", emailResult?.id);
    return { success: true, emailId: emailResult?.id };
  } catch (error) {
    console.error("Error sending booking notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
