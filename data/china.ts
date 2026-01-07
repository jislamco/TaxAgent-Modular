import { TaxProfile } from "../types";

export const CN_CIT_STANDARD = 25;
export const CN_CIT_HIGH_TECH = 15;
export const CN_CIT_SMALL_PROFIT = 20;

export const chinaProfile: TaxProfile = {
  id: 'cn',
  country: 'China',
  flag: '🇨🇳',
  currency: 'Yuan',
  currencyCode: 'CNY',
  cit: {
    standardRate: CN_CIT_STANDARD,
    description: '25% Standard. 15% for High-Tech Enterprises. 20% for Small Low-Profit Enterprises (effective rate often lower).',
    incentives: ['High-New Technology Enterprise (HNTE) 15%', 'R&D Super Deduction (100%)', 'Western Region Development 15%']
  },
  pit: {
    brackets: [
        { rate: 3, max: 36000 },
        { rate: 10, min: 36001, max: 144000 },
        { rate: 20, min: 144001, max: 300000 },
        { rate: 25, min: 300001, max: 420000 },
        { rate: 30, min: 420001, max: 660000 },
        { rate: 35, min: 660001, max: 960000 },
        { rate: 45, min: 960001 }
    ],
    threshold: 60000,
    description: 'Comprehensive income taxed progressively up to 45%. Annual exemptions apply.'
  },
  businessTax: {
    soleProprietor: "Progressive Operating Income Rates (5% - 35%)",
    partnership: "Pass-through to partners (5% - 35%)"
  },
  salesTax: {
    name: 'VAT',
    standardRate: 13,
    reducedRates: '9% (Retail, transport, real estate, construction), 6% (Services), 3% (Small scale)',
    exemptions: 'Contraceptives, antique books, agricultural products',
    registrationThreshold: 'CNY 5 Million (General Taxpayer)'
  },
  additionalLevies: ['Urban Maintenance & Construction Tax (7%)', 'Education Surcharge (3%)', 'Local Education Surcharge (2%)'],
  residencyRules: 'Domiciled or reside for 183 days. 6-year rule for global income exemption.',
  withholding: {
    dividends: '10% (Non-resident)',
    interest: '10% (Non-resident)'
  }
};