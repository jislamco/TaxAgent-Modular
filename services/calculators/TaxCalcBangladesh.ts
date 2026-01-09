
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { BD_CIT_NON_LISTED } from '../../data/bangladesh';

export const BangladeshCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    // Min Tax: 0.6% of Turnover
    const minTax = revenue * 0.006;
    const regularTax = profit * (BD_CIT_NON_LISTED / 100);
    
    const tax = Math.max(minTax, regularTax);
    
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [
        { label: regularTax >= minTax ? `CIT (${BD_CIT_NON_LISTED}%)` : 'Min Tax (0.6% Rev)', amount: tax }
      ]
    };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    // Partnerships taxed as entity in BD usually at standard rate
    const profit = Math.max(0, revenue - expenses);
    const tax = profit * (BD_CIT_NON_LISTED / 100);
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: 'Partnership Tax', amount: tax }]
    };
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    let tax = 0;
    // Slabs 2024 (Men)
    const slabs = [
      { max: 350000, rate: 0 },
      { max: 450000, rate: 5 }, // next 100k
      { max: 750000, rate: 10 }, // next 300k
      { max: 1150000, rate: 15 }, // next 400k
      { max: 1650000, rate: 20 }, // next 500k
      { max: Infinity, rate: 25 }
    ];

    let prevMax = 0;
    let prevLimit = 0;
    
    // We need to map the "Next X amount" logic to absolute
    // 0-350k: 0
    // 350-450k: 5%
    // 450-750k: 10%
    // etc.
    // The simplified iteration:
    let tempLimit = 0;
    
    // Hardcoding cumulative logic for precision based on BD docs
    if (profit > 1650000) tax += (profit - 1650000) * 0.25;
    if (profit > 1150000) tax += Math.min(profit - 1150000, 500000) * 0.20;
    if (profit > 750000) tax += Math.min(profit - 750000, 400000) * 0.15;
    if (profit > 450000) tax += Math.min(profit - 450000, 300000) * 0.10;
    if (profit > 350000) tax += Math.min(profit - 350000, 100000) * 0.05;

    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [{ label: 'Personal Income Tax', amount: tax }]
    };
  }
};
