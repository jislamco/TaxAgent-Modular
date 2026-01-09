
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { KH_CIT_STANDARD, KH_MINIMUM_TAX } from '../../data/cambodia';

export const CambodiaCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    
    // Tax on Income (TOI)
    const toi = profit * (KH_CIT_STANDARD / 100);
    // Minimum Tax (MT)
    const mt = revenue * (KH_MINIMUM_TAX / 100);
    
    const tax = Math.max(toi, mt);
    
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [
        { label: toi >= mt ? `TOI (${KH_CIT_STANDARD}%)` : `Minimum Tax (${KH_MINIMUM_TAX}% Rev)`, amount: tax }
      ]
    };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    // Legal entities taxed same as Corp
    return CambodiaCalculator.calculateCorporate(revenue, expenses);
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    // Sole Proprietorships (Real Regime) are generally taxed progressively
    let tax = 0;
    // Monthly brackets converted to annual approx for simplicity
    // 0-18M KHR: 0%
    // 18M-24M: 5%
    // 24M-102M: 10%
    // 102M-150M: 15%
    // >150M: 20%
    
    const brackets = [
      { max: 18000000, rate: 0 },
      { max: 24000000, rate: 0.05 },
      { max: 102000000, rate: 0.10 },
      { max: 150000000, rate: 0.15 },
      { max: Infinity, rate: 0.20 }
    ];

    let prevMax = 0;
    
    for (const bracket of brackets) {
      if (profit > prevMax) {
        const taxableAmount = Math.min(profit, bracket.max) - prevMax;
        tax += taxableAmount * bracket.rate;
        prevMax = bracket.max;
      }
    }
    
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: 'Progressive Tax (PIT)', amount: tax }]
    };
  }
};
