
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { PK_CIT_RATE_STANDARD, PK_PIT_SLABS, PK_SURCHARGES, PK_MINIMUM_TAX } from '../../data/pakistan';

const calculateSuperTax = (income: number): { amount: number, rate: string } => {
  // Super Tax u/s 4C for Tax Year 2024 & 2025
  let rate = 0;
  if (income > 500000000) rate = 10;
  else if (income > 400000000) rate = 8;
  else if (income > 350000000) rate = 6;
  else if (income > 300000000) rate = 4;
  else if (income > 250000000) rate = 3;
  else if (income > 200000000) rate = 2;
  else if (income > 150000000) rate = 1;

  return { amount: income * (rate / 100), rate: `${rate}%` };
};

const calculatePITSlab = (income: number): number => {
  let tax = 0;
  // Fixed Tax + Rate on excess mechanism for Pakistan
  // Simplified implementation of the slabs defined in constants
  const sortedSlabs = [...PK_PIT_SLABS].sort((a, b) => (a.min || 0) - (b.min || 0));
  
  // In Pakistan, slabs are often "Non-Salaried Table":
  // This loop calculates progressive tax
  let remaining = income;
  let prevLimit = 0;

  for (const slab of sortedSlabs) {
      const min = slab.min || 0;
      const max = slab.max || Infinity;
      const rate = slab.rate / 100;
      
      if (income > min) {
          const taxableInBracket = Math.min(income, max) - Math.max(prevLimit, min);
           if (taxableInBracket > 0) {
               tax += taxableInBracket * rate;
           }
      }
      prevLimit = max;
  }
  return tax;
};

export const PakistanCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    
    // 1. Normal Tax
    const normalTax = profit * (PK_CIT_RATE_STANDARD / 100);
    
    // 2. Minimum Tax (Turnover Tax)
    const minTax = revenue * 0.0125; // 1.25% General Rate
    
    // Liability is higher of Normal or Minimum
    let taxLiability = Math.max(normalTax, minTax);
    const appliedRule = normalTax >= minTax ? 'Normal CIT' : 'Minimum Tax (1.25% Rev)';

    // 3. Super Tax
    const superTax = calculateSuperTax(profit);
    
    const totalTax = taxLiability + superTax.amount;
    
    return {
      totalTax,
      effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0,
      breakdown: [
        { label: appliedRule, amount: taxLiability },
        { label: `Super Tax (${superTax.rate})`, amount: superTax.amount }
      ]
    };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    // AOPs in Pakistan are taxed using Non-Salaried Individual Slabs
    const profit = Math.max(0, revenue - expenses);
    const tax = calculatePITSlab(profit);
    const superTax = calculateSuperTax(profit);
    const total = tax + superTax.amount;

    return {
      totalTax: total,
      effectiveRate: profit > 0 ? (total / profit) * 100 : 0,
      breakdown: [
        { label: 'AOP Slab Tax', amount: tax },
        { label: `Super Tax (${superTax.rate})`, amount: superTax.amount }
      ]
    };
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    // Business Individual
    const profit = Math.max(0, revenue - expenses);
    const tax = calculatePITSlab(profit);
    
    return {
      totalTax: tax,
      effectiveRate: profit > 0 ? (tax / profit) * 100 : 0,
      breakdown: [
        { label: 'Business Income Tax', amount: tax }
      ]
    };
  }
};
