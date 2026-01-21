import { Currency } from "../utils/pricing";
import { BookingFormData } from "../validation/BookFormData";

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
  bookingRef?: string;
  error?: string;
}

export async function dummyBookingCheckout(
  params: CreateCheckoutParams,
): Promise<CheckoutResult> {
  console.log("Dummy checkout called with:", params);

  return {
    success: true,
    checkoutUrl: "https://flymorocco.com/booking-confirmation",
  };
}
