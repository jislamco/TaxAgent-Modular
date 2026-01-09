
import { CountryTaxCalculator, TaxResult, TaxDetail } from '../../types';
import { IN_CIT_RATE_DOMESTIC, IN_CIT_RATE_TURNOVER_LT_400CR, IN_CESS, IN_SURCHARGE_RATES } from '../../data/india';

const calculateSurcharge = (tax: number, income: number, type: 'CORP' | 'PARTNERSHIP' | 'INDIVIDUAL'): { amount: number, rate: number } => {
  let rate = 0;
  if (type === 'CORP') {
    if (income > 100000000) rate = IN_SURCHARGE_RATES.DOMESTIC_CO_GT_10CR; // > 10 Cr
    else if (income > 10000000) rate = IN_SURCHARGE_RATES.DOMESTIC_CO_GT_1CR; // > 1 Cr
  } else if (type === 'PARTNERSHIP') {
    if (income > 10000000) rate = 12; // Flat 12% surcharge > 1 Cr
  } else if (type === 'INDIVIDUAL') {
    // Simplified New Regime Surcharge
    if (income > 20000000) rate = 25;
    else if (income > 10000000) rate = 15;
    else if (income > 5000000) rate = 10;
  }
  return { amount: tax * (rate / 100), rate };
};

const calculateCess = (baseTax: number, surcharge: number): number => {
  return (baseTax + surcharge) * (IN_CESS / 100);
};

export const IndiaCalculator: CountryTaxCalculator = {
  calculateCorporate: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    // Rate selection based on turnover (Assuming revenue is turnover)
    const rate = revenue <= 4000000000 ? IN_CIT_RATE_TURNOVER_LT_400CR : IN_CIT_RATE_DOMESTIC;
    
    const baseTax = profit * (rate / 100);
    const surcharge = calculateSurcharge(baseTax, profit, 'CORP');
    const cess = calculateCess(baseTax, surcharge.amount);
    
    const totalTax = baseTax + surcharge.amount + cess;

    const breakdown: TaxDetail[] = [
      { label: `Base CIT (${rate}%)`, amount: baseTax },
      { label: `Surcharge (${surcharge.rate}%)`, amount: surcharge.amount },
      { label: `Health & Edu Cess (${IN_CESS}%)`, amount: cess }
    ];

    return { totalTax, effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0, breakdown };
  },

  calculatePartnership: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    const rate = 30; // Flat 30% for Firms
    
    const baseTax = profit * (rate / 100);
    const surcharge = calculateSurcharge(baseTax, profit, 'PARTNERSHIP');
    const cess = calculateCess(baseTax, surcharge.amount);
    
    const totalTax = baseTax + surcharge.amount + cess;

    return { 
      totalTax, 
      effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0,
      breakdown: [
        { label: `Base Tax (Flat 30%)`, amount: baseTax },
        { label: `Surcharge (${surcharge.rate}%)`, amount: surcharge.amount },
        { label: `Cess (${IN_CESS}%)`, amount: cess }
      ]
    };
  },

  calculateSoleProp: (revenue: number, expenses: number): TaxResult => {
    const profit = Math.max(0, revenue - expenses);
    // India New Tax Regime FY 24-25
    let tax = 0;
    const slabs = [
      { max: 300000, rate: 0 },
      { max: 600000, rate: 5 },
      { max: 900000, rate: 10 },
      { max: 1200000, rate: 15 },
      { max: 1500000, rate: 20 },
      { max: Infinity, rate: 30 }
    ];

    let previousMax = 0;
    for (const slab of slabs) {
      if (profit > previousMax) {
        const taxable = Math.min(profit, slab.max) - previousMax;
        tax += taxable * (slab.rate / 100);
        previousMax = slab.max;
      }
    }
    
    // Rebate u/s 87A if income <= 7 Lakhs (Tax is 0)
    if (profit <= 700000) tax = 0;

    const surcharge = calculateSurcharge(tax, profit, 'INDIVIDUAL');
    const cess = calculateCess(tax, surcharge.amount);
    const totalTax = tax + surcharge.amount + cess;

    return {
      totalTax,
      effectiveRate: profit > 0 ? (totalTax / profit) * 100 : 0,
      breakdown: [
        { label: 'Slab Tax', amount: tax },
        { label: `Surcharge`, amount: surcharge.amount },
        { label: 'Cess', amount: cess }
      ]
    };
  }
};
