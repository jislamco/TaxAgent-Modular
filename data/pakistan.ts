import { TaxProfile } from "../types";

// --- Pakistan Tax Constants ---
export const PK_CIT_RATE_STANDARD = 29;
export const PK_CIT_RATE_SMALL_COMPANY = 20;
export const PK_CIT_RATE_BANKING = 39;

export const PK_PIT_SLABS = [
  { rate: 0, max: 600000 },
  { rate: 2.5, min: 600001, max: 1200000 },
  { rate: 12.5, min: 1200001, max: 2400000 },
  { rate: 22.5, min: 2400001, max: 3600000 },
  { rate: 27.5, min: 3600001, max: 6000000 },
  { rate: 35, min: 6000001 }
];

export const PK_SALES_TAX_GOODS = 18;
export const PK_SALES_TAX_SERVICES_PROVINCIAL = {
  SINDH: 13, // SRB
  PUNJAB: 16, // PRA
  KPK: 15,    // KPRA
  BALOCHISTAN: 15, // BRA
  ICT: 15     // FBR (Islamabad)
};

export const PK_MINIMUM_TAX = {
  GENERAL: 1.25, // % of turnover
  TIER_1_RETAILERS: 1.5
};

export const PK_SURCHARGES = {
  SUPER_TAX: "1% to 10% based on income slabs > 150M PKR",
  WWF: 2, // Workers Welfare Fund
  WPPF: 5 // Workers Profit Participation Fund
};

// --- Profile Export ---
export const pakistanProfile: TaxProfile = {
  id: 'pk',
  country: 'Pakistan',
  flag: '🇵🇰',
  currency: 'Rupee',
  currencyCode: 'PKR',
  cit: {
    standardRate: PK_CIT_RATE_STANDARD,
    description: `29% Standard Rate. Small companies: 20%. Banking: 39%.`,
    incentives: ['Technology zone incentives (10-year exemption)', 'Solar/Renewable energy manufacturing exemptions']
  },
  pit: {
    brackets: PK_PIT_SLABS,
    threshold: 600000,
    description: 'Progressive slabs 0-35%. Salaried vs Non-salaried classes differ slightly.'
  },
  businessTax: {
    soleProprietor: "Progressive Slabs (0% - 35%)",
    partnership: "Progressive Slabs (0% - 35%) for AOPs"
  },
  salesTax: {
    name: 'Sales Tax',
    standardRate: PK_SALES_TAX_GOODS,
    reducedRates: 'Various reduced rates for specific sectors (Retailers Tier-1, Pharma)',
    exemptions: 'Pharmaceuticals, basic foods, books, educational material',
    registrationThreshold: 'PKR 10 Million annual turnover (Manufacturers), varies for Retailers'
  },
  additionalLevies: [
    `Super Tax (${PK_SURCHARGES.SUPER_TAX})`, 
    `Workers Welfare Fund (${PK_SURCHARGES.WWF}%)`,
    `WPPF (${PK_SURCHARGES.WPPF}%)`,
    `Provincial Services Tax (Sindh ${PK_SALES_TAX_SERVICES_PROVINCIAL.SINDH}%, Punjab ${PK_SALES_TAX_SERVICES_PROVINCIAL.PUNJAB}%)`
  ],
  residencyRules: 'Present 183+ days in tax year or government employee posted abroad.',
  withholding: {
    dividends: '15% (Standard), 25% (Filers vs Non-Filers rates vary)',
    interest: '15% (Standard)'
  }
};