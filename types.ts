export interface TaxBracket {
  rate: number;
  min?: number;
  max?: number; // undefined means infinite/above
  description?: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'AED' | 'CNY' | 'VND' | 'BDT' | 'KHR';

export interface TaxProfile {
  id: string;
  country: string;
  flag: string;
  currency: string;
  currencyCode: CurrencyCode;
  cit: {
    standardRate: number;
    description: string;
    incentives: string[];
  };
  pit: {
    brackets: TaxBracket[];
    threshold: number; // Minimum taxable income
    description: string;
  };
  // New Section for Business Income (Non-Corporate)
  businessTax: {
    soleProprietor: string;
    partnership: string;
  };
  salesTax: {
    name: string; // VAT, GST, Sales Tax
    standardRate: number;
    reducedRates: string;
    exemptions: string;
    registrationThreshold: string;
  };
  additionalLevies: string[];
  residencyRules: string;
  withholding: {
    dividends: string;
    interest: string;
  };
}

export interface InvestmentScenario {
  revenue: number;
  expenses: number;
  countryId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COMPARATOR = 'COMPARATOR',
  CALCULATOR = 'CALCULATOR',
  ADVISOR = 'ADVISOR',
  COUNTRY_DETAIL = 'COUNTRY_DETAIL'
}