
import { CountryTaxCalculator } from '../../types';
import { IndiaCalculator } from './TaxCalcIndia';
import { PakistanCalculator } from './TaxCalcPakistan';
import { UAECalculator } from './TaxCalcUAE';
import { ChinaCalculator } from './TaxCalcChina';
import { VietnamCalculator } from './TaxCalcVietnam';
import { BangladeshCalculator } from './TaxCalcBangladesh';
import { CambodiaCalculator } from './TaxCalcCambodia';

export const TAX_CALCULATORS: Record<string, CountryTaxCalculator> = {
  'in': IndiaCalculator,
  'pk': PakistanCalculator,
  'ae': UAECalculator,
  'cn': ChinaCalculator,
  'vn': VietnamCalculator,
  'bd': BangladeshCalculator,
  'kh': CambodiaCalculator
};
