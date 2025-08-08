import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { escapeHTML } from "@/lib/security/escapeHTML";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Parse booking data from metadata
      const bookingData = JSON.parse(session.metadata?.bookingData || "{}");
      const mainBookerName = session.metadata?.mainBookerName || "";
      const mainBookerEmail = session.metadata?.mainBookerEmail || "";
      const tourStart = session.metadata?.tourStart || "";
      const participantCount = parseInt(session.metadata?.participantCount || "0");
      const baseTotal = parseInt(session.metadata?.baseTotal || "0");
      const soloTotal = parseInt(session.metadata?.soloTotal || "0");
      const grandTotal = parseInt(session.metadata?.grandTotal || "0");
      const currency = session.metadata?.currency || "EUR";
      
      // Currency symbols
      const currencySymbols = {
        EUR: '€',
        GBP: '£', 
        USD: '$',
        CAD: 'C$',
      };
      const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '€';

      // Calculate counts for email
      const soloCount = bookingData.participants?.filter((p: { soloOccupancy: boolean }) => p.soloOccupancy).length + (bookingData.soloOccupancy ? 1 : 0) || 0;
      const pilotCount = bookingData.participants?.filter((p: { isPilot: boolean }) => p.isPilot).length + (bookingData.isPilot ? 1 : 0) || 0;

      // Create participant list for email
      const participantsList = bookingData.participants?.map((p: { name: string; isPilot: boolean; soloOccupancy: boolean; email?: string }) => `
        <li>
          <strong>${escapeHTML(p.name)}</strong> 
          ${p.isPilot ? '(Pilot)' : '(Non-pilot)'} 
          ${p.soloOccupancy ? '- Solo room' : '- Shared accommodation'}
          ${p.email ? `- Email: ${escapeHTML(p.email)}` : ''}
        </li>
      `).join('') || '';

      // Send confirmation email to business
      await resend.emails.send({
        from: "Flymorocco <contact@flymorocco.info>",
        to: ["contact@flymorocco.info"],
        subject: `✅ PAID BOOKING - ${participantCount} participant${participantCount > 1 ? 's' : ''} - ${symbol}${grandTotal}`,
        html: `
          <h2>🎉 New Paid Booking Confirmed!</h2>
          
          <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #16a34a; margin: 0;">Payment Confirmed: ${symbol}${grandTotal.toLocaleString()}</h3>
            <p style="margin: 8px 0 0 0;">Stripe Session: ${session.id}</p>
          </div>
          
          <h3>Main Contact:</h3>
          <p>
            <strong>${escapeHTML(mainBookerName)}</strong> (${escapeHTML(mainBookerEmail)})<br>
            ${bookingData.isPilot ? 'Pilot' : 'Non-pilot'}<br>
            ${bookingData.soloOccupancy ? 'Requires solo room' : 'Shared accommodation OK'}
          </p>
          
          <h3>Tour Details:</h3>
          <p><strong>Start Date:</strong> ${escapeHTML(tourStart)}</p>
          <p><strong>Total Participants:</strong> ${participantCount}</p>
          <p><strong>Solo Rooms:</strong> ${soloCount}</p>
          <p><strong>Pilots in Group:</strong> ${pilotCount}</p>
          
          <h3>Payment Breakdown:</h3>
          <ul>
            <li>Base price (${participantCount} participants): ${symbol}${baseTotal.toLocaleString()}</li>
            ${soloTotal > 0 ? `<li>Solo room surcharge (${soloCount} rooms): ${symbol}${soloTotal.toLocaleString()}</li>` : ''}
            <li><strong>Total Paid: ${symbol}${grandTotal.toLocaleString()} ${currency}</strong></li>
          </ul>
          
          <h3>All Participants:</h3>
          <ul>
            <li>
              <strong>${escapeHTML(mainBookerName)}</strong> (Main booker & payer)
              ${bookingData.isPilot ? '(Pilot)' : '(Non-pilot)'} 
              ${bookingData.soloOccupancy ? '- Solo room' : '- Shared accommodation'}
              - Email: ${escapeHTML(mainBookerEmail)}
            </li>
            ${participantsList}
          </ul>
          
          <hr style="margin: 30px 0;">
          
          <div style="background: #fef3c7; padding: 16px; border-radius: 8px;">
            <h3 style="color: #d97706; margin-top: 0;">Action Items:</h3>
            <ol>
              <li>✅ Payment confirmed - no follow-up needed</li>
              <li>📋 Send detailed pre-tour information</li>
              <li>🪂 Contact pilots for license verification</li>
              <li>📞 Confirm arrangements directly with customer</li>
            </ol>
          </div>
        `,
      });

      // Send confirmation email to customer
      await resend.emails.send({
        from: "Flymorocco <contact@flymorocco.info>",
        to: [mainBookerEmail],
        subject: "✅ Booking Confirmed & Paid - FlyMorocco",
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Your payment of ${symbol}${grandTotal.toLocaleString()} has been processed</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
              <p>Hi ${escapeHTML(mainBookerName)},</p>
              
              <p><strong>Fantastic news!</strong> Your FlyMorocco booking is confirmed and fully paid.</p>
              
              <div style="background: white; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #16a34a;">Your Booking Details</h3>
                <p><strong>Tour Start:</strong> ${escapeHTML(tourStart)}</p>
                <p><strong>Participants:</strong> ${participantCount} people</p>
                <p><strong>Amount Paid:</strong> ${symbol}${grandTotal.toLocaleString()} ${currency}</p>
                <p><strong>Booking Reference:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${session.id}</code></p>
              </div>
              
              <h3 style="color: #d97706;">What happens next?</h3>
              <ol style="padding-left: 20px; line-height: 1.6;">
                <li>📋 <strong>Within 24 hours:</strong> You'll receive your detailed pre-tour information packet</li>
                <li>🪂 <strong>License verification:</strong> Any pilots in your group will receive direct contact for license verification</li>
                <li>📞 <strong>Personal contact:</strong> We'll call you directly to confirm all arrangements and answer any questions</li>
                <li>✈️ <strong>Pre-arrival:</strong> Final briefing and weather updates before your tour</li>
              </ol>
              
              <div style="background: #e0f2fe; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #0277bd;">What's Included</h4>
                <ul style="margin-bottom: 0; line-height: 1.5;">
                  <li>7 days guided paragliding tour</li>
                  <li>All accommodation as booked</li>
                  <li>All meals during the tour</li>
                  <li>Professional local guides</li>
                  <li>Ground transport during tour</li>
                </ul>
              </div>
              
              <p><strong>Questions or concerns?</strong> Simply reply to this email and we'll get back to you within a few hours.</p>
              
              <p>We can't wait to show you the incredible flying Morocco has to offer!</p>
              
              <p style="margin-bottom: 0;">
                <strong>Skye & the FlyMorocco Team</strong><br>
                <a href="https://flymorocco.info" style="color: #16a34a;">flymorocco.info</a>
              </p>
            </div>
          </div>
        `,
      });

      // Send individual emails to pilots if any
      if (bookingData.participants) {
        for (const participant of bookingData.participants) {
          if (participant.isPilot && participant.email) {
            await resend.emails.send({
              from: "Flymorocco <contact@flymorocco.info>",
              to: [participant.email],
              subject: "Pilot License Verification - FlyMorocco Tour",
              html: `
                <h2>Pilot License Verification Required</h2>
                
                <p>Hi ${escapeHTML(participant.name)},</p>
                
                <p>You're registered as a pilot for the FlyMorocco tour starting ${escapeHTML(tourStart)}.</p>
                
                <p><strong>To complete your registration, please reply with:</strong></p>
                <ol>
                  <li>Copy of your pilot license (photo or scan)</li>
                  <li>License number and issuing authority</li>
                  <li>Current insurance certificate</li>
                  <li>Experience level (hours/years flying)</li>
                </ol>
                
                <p>This verification is required by Moroccan aviation authorities for all visiting pilots.</p>
                
                <p><strong>Main contact for your group:</strong> ${escapeHTML(mainBookerName)} (${escapeHTML(mainBookerEmail)})</p>
                
                <p>Looking forward to flying with you in Morocco!</p>
                
                <p>
                  <strong>FlyMorocco Team</strong><br>
                  contact@flymorocco.info
                </p>
              `,
            });
          }
        }
      }

      console.log("Booking emails sent successfully for session:", session.id);

    } catch (error) {
      console.error("Error processing checkout session:", error);
    }
  }

  return NextResponse.json({ received: true });
}