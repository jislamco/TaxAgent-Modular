import { CurrencyCode } from "../types";

// Base rates relative to USD (Approximate Market Rates)
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.77,
  AED: 3.67,
  INR: 83.5,
  PKR: 278.0,
  CNY: 7.24,
  VND: 25450,
  BDT: 117.0,
  KHR: 4100
};

export const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
  const amountInUSD = amount / EXCHANGE_RATES[from];
  return amountInUSD * EXCHANGE_RATES[to];
};

export const formatCurrency = (amount: number, currency: CurrencyCode): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

export const INVESTMENT_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP'];