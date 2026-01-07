import { TaxProfile } from "../types";

export const BD_CIT_NON_LISTED = 27.5;
export const BD_CIT_LISTED = 20; // If shares > 10% IPO
export const BD_CIT_ONE_PERSON_CO = 22.5;

export const bangladeshProfile: TaxProfile = {
  id: 'bd',
  country: 'Bangladesh',
  flag: '🇧🇩',
  currency: 'Taka',
  currencyCode: 'BDT',
  cit: {
    standardRate: BD_CIT_NON_LISTED,
    description: '27.5% for Private Ltd non-listed. 20-22.5% for Listed. Banks/Tobacco higher (up to 45%).',
    incentives: ['IT/Software enabled services tax exemption (until 2024)', 'PPP Project exemptions', 'Start-up sandbox benefits']
  },
  pit: {
    brackets: [
        { rate: 0, max: 350000 },
        { rate: 5, min: 350001, max: 450000 },
        { rate: 10, min: 450001, max: 750000 },
        { rate: 15, min: 750001, max: 1150000 },
        { rate: 20, min: 1150001, max: 1650000 },
        { rate: 25, min: 1650001 }
    ],
    threshold: 350000,
    description: 'Progressive up to 25%. Non-residents flat 30%. Surcharge based on net worth.'
  },
  businessTax: {
    soleProprietor: "Standard Slab Rates (0% - 25%)",
    partnership: "Taxed as entity at Standard Slab Rates"
  },
  salesTax: {
    name: 'VAT',
    standardRate: 15,
    reducedRates: '5%, 7.5%, 10% (Trade/Specific services)',
    exemptions: 'Basic food, livestock, social welfare, cultural services',
    registrationThreshold: 'BDT 30 Million turnover (Mandatory VAT), BDT 5M (Turnover Tax 4%)'
  },
  additionalLevies: ['Health Development Surcharge', 'Environment Protection Surcharge', 'Net Worth Surcharge (10-35% of tax)'],
  residencyRules: 'Present 182 days in income year.',
  withholding: {
    dividends: '10-15% (Residents), 20% (Non-residents)',
    interest: '10-20%'
  }
};