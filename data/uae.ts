import { TaxProfile } from "../types";

export const UAE_CIT_THRESHOLD = 375000;
export const UAE_CIT_RATE_ABOVE_THRESHOLD = 9;
export const UAE_FREE_ZONE_RATE = 0;

export const uaeProfile: TaxProfile = {
  id: 'ae',
  country: 'United Arab Emirates',
  flag: '🇦🇪',
  currency: 'Dirham',
  currencyCode: 'AED',
  cit: {
    standardRate: 9,
    description: `9% on taxable income exceeding AED 375,000. 0% for Qualifying Free Zone Persons on Qualifying Income.`,
    incentives: ['0% Corporate Tax for Free Zone entities on qualifying income', 'Small Business Relief (Revenue < AED 3M)']
  },
  pit: {
    brackets: [{ rate: 0 }],
    threshold: Infinity,
    description: 'No Personal Income Tax on employment income.'
  },
  businessTax: {
    soleProprietor: "9% if Turnover > AED 1M",
    partnership: "Taxed at individual partner level or 9% if entity"
  },
  salesTax: {
    name: 'VAT',
    standardRate: 5,
    reducedRates: '0% on exports, international transport, investment precious metals',
    exemptions: 'Financial services, residential property, local transport',
    registrationThreshold: 'Mandatory: AED 375,000 turnover. Voluntary: AED 187,500'
  },
  additionalLevies: ['Municipality fees on hotel/rent', 'Knowledge Fee', 'Innovation Fee'],
  residencyRules: 'Physical presence > 183 days or 90 days with permanent place of abode/employment.',
  withholding: {
    dividends: '0%',
    interest: '0%'
  }
};