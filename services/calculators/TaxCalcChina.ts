
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { CN_CIT_STANDARD } from '../../data/china';

export const ChinaCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    let tax = 0;
    let note = '';

    // Small Low-Profit Enterprise (SLPE) preferential policy (approximate recent rules)
    // - Annual taxable income <= 1M CNY: 20% rate on 25% of income (Effective 5% - expired 2022 but often renewed, simplified here to 2.5% for <1M and 5% <3M for simulation or standard 25% if large)
    // Actually, recent: <= 3M CNY, 20% rate on 25% income = 5% effective.
    
    if (profit <= 3000000) {
       const taxableIncome = profit * 0.25;
       tax = taxableIncome * 0.20;
       note = 'Small Low-Profit Ent. (Effective 5%)';
    } else {
       tax = profit * (CN_CIT_STANDARD / 100);
       note = 'Standard CIT Rate';
    }

    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: note, amount: tax }]
    };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    // China Partnerships are pass-through, partners pay Individual Income Tax (Operating Income)
    // Progressive rates 5% to 35%
    const profit = Math.max(0, revenue - expenses);
    let tax = 0;
    
    const brackets = [
      { max: 30000, rate: 5 },
      { max: 90000, rate: 10 },
      { max: 300000, rate: 20 },
      { max: 500000, rate: 30 },
      { max: Infinity, rate: 35 }
    ];

    let prevMax = 0;
    // Quick deduction method is often used in China, but we use iterative for clarity
    let remaining = profit;
    let calculated = 0;
    let prevLimit = 0;

    for (const b of brackets) {
        if (profit > prevLimit) {
            const taxable = Math.min(profit, b.max) - prevLimit;
            calculated += taxable * (b.rate / 100);
            prevLimit = b.max;
        }
    }
    tax = calculated;

    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: 'IIT (Operating Income)', amount: tax }]
    };
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    // Same as Partnership (Operating Income)
    return ChinaCalculator.calculatePartnership(revenue, expenses);
  }
};
