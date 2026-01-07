import { TaxProfile } from './types';
import { pakistanProfile } from './data/pakistan';
import { indiaProfile } from './data/india';
import { uaeProfile } from './data/uae';
import { chinaProfile } from './data/china';
import { vietnamProfile } from './data/vietnam';
import { bangladeshProfile } from './data/bangladesh';
import { cambodiaProfile } from './data/cambodia';

export const TAX_DATA: TaxProfile[] = [
  uaeProfile,
  indiaProfile,
  pakistanProfile,
  chinaProfile,
  vietnamProfile,
  bangladeshProfile,
  cambodiaProfile
];