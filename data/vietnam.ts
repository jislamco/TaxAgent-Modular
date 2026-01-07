import { TaxProfile } from "../types";

export const VN_CIT_STANDARD = 20;
export const VN_CIT_OIL_GAS = 32; // to 50%

export const vietnamProfile: TaxProfile = {
  id: 'vn',
  country: 'Vietnam',
  flag: '🇻🇳',
  currency: 'Dong',
  currencyCode: 'VND',
  cit: {
    standardRate: VN_CIT_STANDARD,
    description: '20% Standard. Preferential rates (10-17%) for specific projects. Oil/Gas 32-50%.',
    incentives: ['Economic Zones (10% for 15 yrs)', 'High-tech zones', 'Software production (4 years exemption, 9 years 50% reduction)']
  },
  pit: {
    brackets: [
        { rate: 5, max: 60000000 },
        { rate: 10, min: 60000001, max: 120000000 },
        { rate: 15, min: 120000001, max: 216000000 },
        { rate: 20, min: 216000001, max: 384000000 },
        { rate: 25, min: 384000001, max: 624000000 },
        { rate: 30, min: 624000001, max: 960000000 },
        { rate: 35, min: 960000001 } 
    ],
    threshold: 132000000, // 11m/month personal relief
    description: 'Progressive rates 5% to 35%. Non-residents flat 20%.'
  },
  businessTax: {
    soleProprietor: "Flat % on Revenue (0.5% - 5%)",
    partnership: "Flat % on Revenue (0.5% - 5%)"
  },
  salesTax: {
    name: 'VAT',
    standardRate: 10,
    reducedRates: '5% (Essential goods, water, medical), 8% (Temporary reduction for some sectors)',
    exemptions: 'Software, untreated farm produce, medical services',
    registrationThreshold: 'VND 1 Billion annual revenue'
  },
  additionalLevies: ['Business License Fee (Annual 1M-3M VND)', 'Social Insurance (Employers share 17.5%)'],
  residencyRules: '183 days presence or permanent residence registered.',
  withholding: {
    dividends: '5% (Individuals only, Corps exempt)',
    interest: '5% (Individuals), 5% (Foreign Contractors)'
  }
};