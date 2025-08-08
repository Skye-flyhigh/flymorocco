import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { BookingFormSchema, BookingFormData } from "@/lib/validation/BookFormData";
import { verifyRecaptcha } from "@/lib/security/verifyRecaptcha";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Parse participant data
    const participantCount = parseInt(formData.get("participantCount") as string) || 0;
    const participants = [];
    
    for (let i = 0; i < participantCount; i++) {
      const pilotEmail = formData.get(`participant_${i}_email`) as string;
      const participant = {
        name: formData.get(`participant_${i}_name`) as string || "",
        isPilot: formData.get(`participant_${i}_isPilot`) === "true",
        soloOccupancy: formData.get(`participant_${i}_soloOccupancy`) === "true",
        email: (formData.get(`participant_${i}_isPilot`) === "true" && pilotEmail) ? pilotEmail : undefined,
      };
      
      participants.push(participant);
    }

    const bookingData: Partial<BookingFormData> = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      isPilot: formData.get("isPilot") === "true",
      soloOccupancy: formData.get("soloOccupancy") === "true",
      start: formData.get("start") as string,
      participantCount,
      participants,
    };

    // Verify reCAPTCHA
    const recaptchaToken = formData.get("recaptcha-token") as string;
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Validate booking data
    const { success, error, data } = BookingFormSchema.safeParse(bookingData);
    if (!success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: error.flatten() },
        { status: 400 }
      );
    }

    // Get currency and calculate pricing
    const currency = (formData.get("currency") as string || "EUR").toLowerCase();
    const tourType = formData.get("tourType") as string || "";
    const isWellbeing = tourType.toLowerCase().includes('wellbeing');
    
    // Currency-specific pricing
    const pricingConfig = {
      eur: { base: isWellbeing ? 1250 : 950, solo: 250 },
      gbp: { base: isWellbeing ? 1050 : 799, solo: 200 },
      usd: { base: isWellbeing ? 1400 : 1100, solo: 280 },
      cad: { base: isWellbeing ? 1800 : 1400, solo: 350 },
    };
    
    const pricing = pricingConfig[currency as keyof typeof pricingConfig] || pricingConfig.eur;
    
    const baseTotal = data.participantCount * pricing.base;
    const soloCount = data.participants.filter(p => p.soloOccupancy).length + (data.soloOccupancy ? 1 : 0);
    const soloTotal = soloCount * pricing.solo;
    const grandTotal = baseTotal + soloTotal;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `FlyMorocco Tour - ${data.participantCount} participant${data.participantCount > 1 ? 's' : ''}`,
              description: `Week starting ${data.start} - Includes accommodation, meals, and guided tour`,
              metadata: {
                tourStart: data.start,
                tourType: tourType,
                participantCount: data.participantCount.toString(),
                soloRooms: soloCount.toString(),
                currency: currency.toUpperCase(),
              },
            },
            unit_amount: grandTotal * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/tours`,
      customer_email: data.email,
      metadata: {
        bookingData: JSON.stringify(data),
        mainBookerName: data.name,
        mainBookerEmail: data.email,
        tourStart: data.start,
        participantCount: data.participantCount.toString(),
        baseTotal: baseTotal.toString(),
        soloTotal: soloTotal.toString(),
        grandTotal: grandTotal.toString(),
        currency: currency.toUpperCase(),
        basePrice: pricing.base.toString(),
        soloPrice: pricing.solo.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}