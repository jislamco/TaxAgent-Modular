import { TaxProfile } from "../types";

export const KH_CIT_STANDARD = 20;
export const KH_MINIMUM_TAX = 1; // % of turnover

export const cambodiaProfile: TaxProfile = {
  id: 'kh',
  country: 'Cambodia',
  flag: '🇰🇭',
  currency: 'Riel',
  currencyCode: 'KHR',
  cit: {
    standardRate: KH_CIT_STANDARD,
    description: '20% Standard ("Tax on Income"). Oil/Gas/Mining 30%. Minimum Tax 1% of turnover applies if CIT is lower.',
    incentives: ['Qualified Investment Projects (QIP) tax holidays up to 9 years']
  },
  pit: {
    brackets: [
        { rate: 0, max: 1500000 }, // Monthly thresholds roughly
        { rate: 5, min: 1500001, max: 2000000 },
        { rate: 10, min: 2000001, max: 8500000 },
        { rate: 15, min: 8500001, max: 12500000 },
        { rate: 20, min: 12500001 }
    ],
    threshold: 1500000, // Monthly KHR
    description: 'Tax on Salary (0-20%). Fringe Benefits Tax 20%. Non-residents flat 20%.'
  },
  businessTax: {
    soleProprietor: "Progressive Tax on Income (0% - 20%)",
    partnership: "Progressive Tax on Income (0% - 20%)"
  },
  salesTax: {
    name: 'VAT',
    standardRate: 10,
    reducedRates: '0% (Exports of goods and services)',
    exemptions: 'Public postal, hospital, unprocessed farm goods, electricity/water',
    registrationThreshold: 'Small taxpayer threshold varies; Real Regime mandatory for most corporations.'
  },
  additionalLevies: [`Minimum Tax (${KH_MINIMUM_TAX}% of turnover)`, 'Patent Tax (Annual)', 'Tax on Public Lighting'],
  residencyRules: 'Domicile or principal place of abode, or present > 182 days.',
  withholding: {
    dividends: '14% (Non-resident)',
    interest: '14% (Non-resident), 15% (Domestic fixed deposit)'
  }
};