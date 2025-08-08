import Stripe from "stripe";
import { Currency } from "../utils/pricing";
import { BookingFormData } from "../validation/BookFormData";
import { getTourImageUrl } from "../utils/tourImages";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});


export interface CreateCheckoutParams {
  bookingData: BookingFormData;
  totalPeople: number;
  soloCount: number;
  basePrice: number;
  soloPrice: number;
  baseTotal: number;
  soloTotal: number;
  grandTotal: number;
  currency: Currency;
}

export interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export async function dummyBookingCheckout(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult> {
    console.log("Dummy checkout called with:", params);

    return {
      success: true,
      checkoutUrl: "https://checkout.stripe.com/dummy-session-123",
    };
  }


export async function createBookingCheckout(
  params: CreateCheckoutParams
): Promise<CheckoutResult> {
  const {
    bookingData,
    totalPeople,
    soloCount,
    basePrice,
    soloPrice,
    baseTotal,
    soloTotal,
    grandTotal,
    currency,
  } = params;

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `FlyMorocco ${bookingData.tourType.charAt(0).toUpperCase() + bookingData.tourType.slice(1)} Tour - ${totalPeople} participant${totalPeople > 1 ? 's' : ''}`,
              description: `Week starting ${bookingData.start} - Includes accommodation, meals, and guided tour`,
              images: [getTourImageUrl(bookingData.tourType)],
              metadata: {
                tourStart: bookingData.start,
                tourType: bookingData.tourType,
                participantCount: totalPeople.toString(),
                soloRooms: soloCount.toString(),
                currency: currency,
              },
            },
            unit_amount: grandTotal * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tours/${bookingData.tourType}`,
      customer_email: bookingData.email,
      metadata: {
        bookingData: JSON.stringify(bookingData),
        mainBookerName: bookingData.name,
        mainBookerEmail: bookingData.email,
        mainBookerIsPilot: bookingData.isPilot.toString(),
        mainBookerSolo: bookingData.soloOccupancy.toString(),
        tourStart: bookingData.start,
        tourType: bookingData.tourType,
        participantCount: totalPeople.toString(),
        participantNames: bookingData.participants.map(p => p.name).join(', '),
        pilotEmails: bookingData.participants.filter(p => p.isPilot && p.email).map(p => `${p.name}:${p.email}`).join(', '),
        soloRooms: bookingData.participants.filter(p => p.soloOccupancy).map(p => p.name).join(', '),
        totalPilots: (bookingData.participants.filter(p => p.isPilot).length + (bookingData.isPilot ? 1 : 0)).toString(),
        baseTotal: baseTotal.toString(),
        soloTotal: soloTotal.toString(),
        grandTotal: grandTotal.toString(),
        currency: currency,
        basePrice: basePrice.toString(),
        soloPrice: soloPrice.toString(),
      },
    });

    return {
      success: true,
      checkoutUrl: session.url || undefined,
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
