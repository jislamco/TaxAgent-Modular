import { TaxProfile } from "../types";

// --- Pakistan Tax Constants ---
export const PK_CIT_RATE_STANDARD = 29;
export const PK_CIT_RATE_SMALL_COMPANY = 20;
export const PK_CIT_RATE_BANKING = 39;

// Updated FY 2024-25 Non-Salaried / Business Individuals / AOPs
// Tax is calculated as Fixed Amount + % of Excess. 
// The logical bracket structure below results in the correct mathematical tax output.
export const PK_PIT_SLABS = [
  { rate: 0, max: 600000 },
  { rate: 15, min: 600001, max: 1200000 },
  { rate: 20, min: 1200001, max: 1600000 },
  { rate: 30, min: 1600001, max: 3200000 },
  { rate: 40, min: 3200001, max: 5600000 },
  { rate: 45, min: 5600001 }
];

export const PK_SALES_TAX_GOODS = 18;
export const PK_SALES_TAX_SERVICES_PROVINCIAL = {
  SINDH: 15, // SRB
  PUNJAB: 16, // PRA
  KPK: 15,    // KPRA
  BALOCHISTAN: 15, // BRA
  ICT: 15     // FBR (Islamabad)
};

export const PK_MINIMUM_TAX = {
  GENERAL: "1.25% (Standard Turnover Tax)",
  TIER_1_RETAILERS: "0.5% (POS Integrated)",
  DISTRIBUTORS: "0.25% (FMCG, Pharma, Fertilizer)",
  OIL_SECTOR: "0.75% (OMCs, Refineries)",
  SERVICES: "3% (Corporate), 4% (Others)"
};

export const PK_SURCHARGES = {
  SUPER_TAX_DESC: "Super Tax (Sec 4C) applies on High Earners (Income > 150M PKR)",
  SUPER_TAX_SLABS: [
    "0% (Up to 150M)",
    "1% (150M - 200M)",
    "2% (200M - 250M)",
    "3% (250M - 300M)",
    "4% (300M - 350M)",
    "6% (350M - 400M)",
    "8% (400M - 500M)",
    "10% (Above 500M)"
  ],
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
    description: `29% Standard Rate. Small companies: 20%. Banking: 39%. Super Tax applies on income > 150M.`,
    incentives: ['Technology zone incentives (10-year exemption)', 'Solar/Renewable energy manufacturing exemptions', 'IT Export Services (0.25% final tax reduced rate)']
  },
  pit: {
    brackets: PK_PIT_SLABS,
    threshold: 600000,
    description: 'Non-Salaried/Business: Progressive slabs 15% to 45%. Salaried: 5% to 35%.'
  },
  businessTax: {
    soleProprietor: "Progressive Slabs (15% - 45%)",
    partnership: "Progressive Slabs (15% - 45%) for AOPs"
  },
  salesTax: {
    name: 'Sales Tax',
    standardRate: PK_SALES_TAX_GOODS,
    reducedRates: 'Various reduced rates for specific sectors (Retailers Tier-1, Pharma)',
    exemptions: 'Pharmaceuticals, basic foods, books, educational material',
    registrationThreshold: 'PKR 10 Million annual turnover (Manufacturers), varies for Retailers'
  },
  additionalLevies: [
    `Super Tax: 1% - 10% (Income based)`,
    `Workers Welfare Fund (${PK_SURCHARGES.WWF}%)`,
    `WPPF (${PK_SURCHARGES.WPPF}%)`,
    `Min. Tax: ${PK_MINIMUM_TAX.GENERAL}, ${PK_MINIMUM_TAX.DISTRIBUTORS}`,
    `Provincial Services Tax (Sindh ${PK_SALES_TAX_SERVICES_PROVINCIAL.SINDH}%, Punjab ${PK_SALES_TAX_SERVICES_PROVINCIAL.PUNJAB}%)`
  ],
  residencyRules: 'Present 183+ days in tax year or government employee posted abroad.',
  withholding: {
    dividends: '15% (Standard), 25% (Non-Filers)',
    interest: '15% (Standard), 30% (Non-Filers)'
  }
};