import { TaxProfile } from "../types";

// --- India Tax Constants ---
export const IN_CIT_RATE_DOMESTIC = 30; // Base
export const IN_CIT_RATE_TURNOVER_LT_400CR = 25;
export const IN_CIT_RATE_NEW_MFG = 15;

export const IN_SURCHARGE_RATES = {
  DOMESTIC_CO_GT_1CR: 7,
  DOMESTIC_CO_GT_10CR: 12,
  FOREIGN_CO_GT_1CR: 2,
  FOREIGN_CO_GT_10CR: 5
};

export const IN_CESS = 4; // Health & Education Cess

export const IN_GST_TIERS = [5, 12, 18, 28];

export const indiaProfile: TaxProfile = {
  id: 'in',
  country: 'India',
  flag: '🇮🇳',
  currency: 'Rupee',
  currencyCode: 'INR',
  cit: {
    standardRate: 25, // Using the effective rate for most SMEs
    description: `25% for turnover < INR 400 Cr, otherwise 30%. New mfg companies: 15%. + Surcharge & 4% Cess.`,
    incentives: ['Section 80 deductions', 'GIFT City IFSC tax holidays', 'PLI Schemes for Electronics/Auto']
  },
  pit: {
    brackets: [
        { rate: 0, max: 300000 },
        { rate: 5, min: 300001, max: 600000 },
        { rate: 10, min: 600001, max: 900000 },
        { rate: 15, min: 900001, max: 1200000 },
        { rate: 20, min: 1200001, max: 1500000 },
        { rate: 30, min: 1500001 }
    ],
    threshold: 300000,
    description: 'New Tax Regime slabs (Default). 4% Health & Education Cess applies to tax liability.'
  },
  businessTax: {
    soleProprietor: "Applicable Slab Rates (0% - 30%)",
    partnership: "Flat 30% (+ Surcharge & Cess)"
  },
  salesTax: {
    name: 'GST',
    standardRate: 18,
    reducedRates: '5% (Essential), 12% (Standard), 28% (Luxury + Compensation Cess)',
    exemptions: 'Essential foods, healthcare, education, fresh produce',
    registrationThreshold: 'INR 20 Lakhs (Services), INR 40 Lakhs (Goods)'
  },
  additionalLevies: [
    `Health & Education Cess (${IN_CESS}% of tax)`, 
    'Surcharges (7-12% for Corps, 10-37% for Individuals)'
  ],
  residencyRules: 'Resident if present 182+ days. Global income taxed for Residents (ROR).',
  withholding: {
    dividends: '10% (Resident), 20% + Surcharge (Non-Resident)',
    interest: '10% (Resident), 20% (Non-Resident)'
  }
};