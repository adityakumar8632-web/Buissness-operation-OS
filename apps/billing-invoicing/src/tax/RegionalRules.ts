import { TaxRegionEnum, TaxClassEnum } from './tax.schema';
import { z } from 'zod';

type TaxRegion = z.infer<typeof TaxRegionEnum>;
type TaxClass = z.infer<typeof TaxClassEnum>;

export interface TaxRule {
  rate: number;
  components?: { name: string; rate: number }[]; // For split taxes like CGST/SGST
  isReverseChargeApplicable?: boolean;
}

export const RegionalRules: Record<TaxRegion, Record<TaxClass, TaxRule>> = {
  'US': {
    'STANDARD': { rate: 0.07 }, // Flat standard placeholder, normally state-dependent
    'REDUCED': { rate: 0.04 },
    'ZERO': { rate: 0 },
    'EXEMPT': { rate: 0 }
  },
  'IN': {
    'STANDARD': { 
      rate: 0.18, 
      components: [
        { name: 'CGST', rate: 0.09 },
        { name: 'SGST', rate: 0.09 }
      ] 
    },
    'REDUCED': { 
      rate: 0.05,
      components: [
        { name: 'CGST', rate: 0.025 },
        { name: 'SGST', rate: 0.025 }
      ]
    },
    'ZERO': { rate: 0 },
    'EXEMPT': { rate: 0 }
  },
  'EU': {
    'STANDARD': { rate: 0.20, isReverseChargeApplicable: true },
    'REDUCED': { rate: 0.05, isReverseChargeApplicable: true },
    'ZERO': { rate: 0 },
    'EXEMPT': { rate: 0 }
  },
  'UK': {
    'STANDARD': { rate: 0.20 },
    'REDUCED': { rate: 0.05 },
    'ZERO': { rate: 0 },
    'EXEMPT': { rate: 0 }
  },
  'GLOBAL': {
    'STANDARD': { rate: 0 },
    'REDUCED': { rate: 0 },
    'ZERO': { rate: 0 },
    'EXEMPT': { rate: 0 }
  }
};