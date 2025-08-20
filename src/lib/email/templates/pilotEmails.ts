import { createEmailTemplate } from "./emailTemplate";
import { TourSlug } from "../../types/tour";

export interface PilotEmailData {
  pilotName: string;
  tourType: TourSlug;
  tourStart: string;
  mainContactName: string;
  mainContactEmail: string;
}

export function createPilotVerificationEmail(data: PilotEmailData): string {
  const content = `
    <p>Congratulations! You're registered as a <strong>pilot</strong> for our upcoming <strong>${data.tourType}</strong> tour starting <strong>${data.tourStart}</strong>.</p>
    
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #856404; margin: 0 0 15px 0;">🪂 Pilot License Verification Required</h3>
      <p style="margin: 0 0 15px 0; color: #856404;">
        To comply with Moroccan aviation regulations, we need to verify your pilot credentials before the tour.
      </p>
      
      <h4 style="color: #856404; margin: 15px 0 10px 0;">Please reply to this email with:</h4>
      <ol style="color: #856404; margin: 0; padding-left: 20px;">
        <li>📋 Copy of your pilot license (photo or scan)</li>
        <li>🛡️ Current third party liability certificate</li>
        <li>🏆 Experience level (total hours/years flying)</li>
        <li>🪂 Glider details (manufacturer, model, size, colours)</li>
        <li>✍️ Annex 2 filled and signed (<a href=\"https://flymorocco.info/rules/authorisation\" style=\"color: #856404;\">Form link here</a>)</li>
      </ol>
    </div>
    
    <div style="background: #e8f5e8; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #2c5530; margin: 0 0 15px 0;">✈️ Your Tour Details</h3>
      <p style="margin: 0 0 10px 0;"><strong>Tour Type:</strong> ${data.tourType.charAt(0).toUpperCase() + data.tourType.slice(1)} Week</p>
      <p style="margin: 0 0 10px 0;"><strong>Start and End Dates:</strong> ${new Date(data.tourStart).toLocaleDateString()} to ${new Date(new Date(data.tourStart).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      <p style="margin: 0 0 10px 0;"><strong>Main Contact:</strong> ${data.mainContactName}</p>
      <p style="margin: 0;"><strong>Contact Email:</strong> ${data.mainContactEmail}</p>
    </div>
    
    <p>We're excited to fly with you in Morocco's incredible landscapes! Our team will review your credentials promptly and confirm everything is ready for your adventure.</p>
    
    <p style="margin-top: 25px;">
      <strong>Questions?</strong> Simply reply to this email or contact us directly.<br>
      <strong>Urgent matters:</strong> WhatsApp +212 636 04 17 61
    </p>
  `;

  return createEmailTemplate({
    recipientName: data.pilotName,
    content,
    footerContent: "Safe Flying with FlyMorocco! 🪂",
  });
}

export function createPilotWelcomeEmail(data: PilotEmailData): string {
  const content = `
    <p>Welcome to your <strong>${data.tourType}</strong> paragliding adventure with FlyMorocco!</p>
    
    <p>As a fellow pilot, you know the thrill of soaring above stunning landscapes. Get ready to experience Morocco's most spectacular flying sites with our expert local guides.</p>
    
    <div style="background: #e3f2fd; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #1565c0; margin: 0 0 15px 0;">🏔️ What Awaits You</h3>
      <ul style="color: #1565c0; margin: 0; padding-left: 20px;">
        <li>Flying over the majestic Atlas Mountains</li>
        <li>Coastal thermals along the Atlantic</li>
        <li>Delicious Moroccan food</li>
        <li>Traditional Berber villages from above</li>
        <li>Local pilot community connections</li>
        <li>Technical flying challenges & improvement - if you're up for it!</li>
      </ul>
    </div>
    
    <div style="background: #fff3e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #ef6c00; margin: 0 0 15px 0;">⚠️ Important Pre-Flight Checklist</h3>
      <p style="margin: 0 0 10px 0; color: #ef6c00;">
        <strong>License Verification:</strong> We'll need your credentials before departure.
      </p>
      <p style="margin: 0 0 10px 0; color: #ef6c00;">
        <strong>Equipment Check:</strong> Bring your gear list for our pre-flight inspection.
      </p>
      <p style="margin: 0; color: #ef6c00;">
        <strong>Weather Briefing:</strong> Morocco's conditions can be unique - we'll brief you on local patterns.
      </p>
    </div>
    
    <p>Your main contact for this tour is <strong>${data.mainContactName}</strong> (${data.mainContactEmail}). They've booked this incredible experience for your group!</p>
    
    <p style="margin-top: 25px;">
      Blue skies and safe flying ahead! 🌤️<br>
      <em>The FlyMorocco Pilot Team</em>
    </p>
  `;

  return createEmailTemplate({
    recipientName: data.pilotName,
    content,
    footerContent: "Pilot to Pilot - FlyMorocco 🪂",
  });
}
