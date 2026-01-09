
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { VN_CIT_STANDARD } from '../../data/vietnam';

export const VietnamCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    const tax = profit * (VN_CIT_STANDARD / 100);
    
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: `Standard CIT (${VN_CIT_STANDARD}%)`, amount: tax }]
    };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    // Treated as Corporate usually in VN context for "Partnerships" defined under Enterprise Law
    return VietnamCalculator.calculateCorporate(revenue, expenses);
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    // Vietnam Business Individuals / Households pay tax on REVENUE (Deemed Tax)
    // Not on Profit.
    // Rates vary by sector. 
    // Distribution/Supply of goods: 1% VAT + 0.5% PIT = 1.5%
    // Services/Construction: 5% VAT + 2% PIT = 7%
    // Lease of assets: 5% VAT + 5% PIT = 10%
    // Other business activities: 2% VAT + 1% PIT = 3%
    
    // We will assume "Other business activities / Production" average ~ 3% or Services ~7%. 
    // Let's take a blended average of 4.5% (1.5% - 7% range) for generic calculation or strict Service 7%
    // Let's use 1.5% (Trading) as a baseline optimistic or 4.5% avg.
    // Let's explicitly label it "Deemed Tax on Revenue"
    
    const assumedRate = 0.045; // 4.5% blended
    const tax = revenue * assumedRate;

    // Note: Effective rate calculation here is Tax / Profit to be comparable with others
    const profit = Math.max(0, revenue - expenses);

    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [
        { label: 'VAT on Revenue (~3%)', amount: revenue * 0.03 },
        { label: 'PIT on Revenue (~1.5%)', amount: revenue * 0.015 }
      ]
    };
  }
};
