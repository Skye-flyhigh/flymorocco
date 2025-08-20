import pricingData from "@/data/pricing.json";
import { TourSlug } from "../types/tour";

export type Currency = keyof typeof pricingData.currencies;

export interface PricingInfo {
  base: number;
  solo: number;
}

export interface CurrencyInfo {
  symbol: string;
  name: string;
}

/**
 * Get pricing for a specific tour type and currency
 */
export function getTourPricing(
  tourType: TourSlug,
  currency: Currency,
): PricingInfo {
  const pricing = pricingData.tours[tourType]?.[currency];

  if (!pricing) {
    console.warn(
      `No pricing found for ${tourType} in ${currency}, falling back to EUR`,
    );
    return pricingData.tours[tourType]?.EUR || pricingData.tours.mountain.EUR;
  }

  return pricing;
}

/**
 * Get currency information (symbol and name)
 */
export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return pricingData.currencies[currency];
}

/**
 * Get all available currencies
 */
export function getAvailableCurrencies(): Currency[] {
  return Object.keys(pricingData.currencies) as Currency[];
}

/**
 * Calculate total booking cost
 */
export function calculateBookingTotal(
  tourType: TourSlug,
  currency: Currency,
  totalPeople: number,
  soloRooms: number,
): {
  basePrice: number;
  soloPrice: number;
  baseTotal: number;
  soloTotal: number;
  grandTotal: number;
  currency: Currency;
  currencyInfo: CurrencyInfo;
} {
  const pricing = getTourPricing(tourType, currency);
  const currencyInfo = getCurrencyInfo(currency);

  const baseTotal = totalPeople * pricing.base;
  const soloTotal = soloRooms * pricing.solo;
  const grandTotal = baseTotal + soloTotal;

  return {
    basePrice: pricing.base,
    soloPrice: pricing.solo,
    baseTotal,
    soloTotal,
    grandTotal,
    currency,
    currencyInfo,
  };
}
