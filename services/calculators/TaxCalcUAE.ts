
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { UAE_CIT_THRESHOLD, UAE_CIT_RATE_ABOVE_THRESHOLD } from '../../data/uae';

const calculateUAETax = (revenue: number, expenses: number): TaxResult => {
  const profit = Math.max(0, revenue - expenses);
  let tax = 0;
  let breakdown: TaxDetail[] = [];

  // Small Business Relief: If Revenue < 3M AED, Tax is 0 (Valid until Dec 2026)
  if (revenue <= 3000000) {
    tax = 0;
    breakdown.push({ label: 'Small Business Relief', amount: 0, note: 'Revenue < 3M AED' });
  } else {
    if (profit > UAE_CIT_THRESHOLD) {
      tax = (profit - UAE_CIT_THRESHOLD) * (UAE_CIT_RATE_ABOVE_THRESHOLD / 100);
      breakdown.push(
        { label: '0% Band (First 375k)', amount: 0 },
        { label: `9% Band (Above 375k)`, amount: tax }
      );
    } else {
      tax = 0;
      breakdown.push({ label: 'Profit below Threshold', amount: 0 });
    }
  }

  return {
    totalTax: tax,
    effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
    breakdown
  };
};

export const UAECalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue, expenses) => calculateUAETax(revenue, expenses),
  
  // In UAE, Sole Establishments and Partners are treated as Taxable Persons 
  // subject to the same CIT rates if they conduct business activity.
  calculatePartnership: (revenue, expenses) => calculateUAETax(revenue, expenses),
  calculateSoleProp: (revenue, expenses) => calculateUAETax(revenue, expenses)
};
