import { TaxCalculationInput, TaxCalculationInputSchema } from './tax.schema';
import { RegionalRules, TaxRule } from './RegionalRules';

export interface TaxBreakdown {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  effectiveRate: number;
  appliedRules: TaxRule;
  breakdown?: { name: string; amount: number }[];
}

export class TaxEngine {
  /**
   * Computes the final tax amount and detailed breakdown based on regional rules[cite: 3].
   */
  static calculate(input: TaxCalculationInput): TaxBreakdown {
    const validatedInput = TaxCalculationInputSchema.parse(input);
    const { amount, region, taxClass, isB2B } = validatedInput;

    const rule = RegionalRules[region][taxClass];

    // Handle EU Reverse Charge Mechanism for B2B transactions
    if (region === 'EU' && isB2B && rule.isReverseChargeApplicable) {
      return {
        baseAmount: amount,
        taxAmount: 0,
        totalAmount: amount,
        effectiveRate: 0,
        appliedRules: { ...rule, rate: 0 },
        breakdown: [{ name: 'Reverse Charge (0%)', amount: 0 }]
      };
    }

    const taxAmount = amount * rule.rate;
    const totalAmount = amount + taxAmount;
    
    let breakdown: { name: string; amount: number }[] | undefined = undefined;
    
    // Split taxes into components if defined (e.g., CGST/SGST)[cite: 3]
    if (rule.components) {
      breakdown = rule.components.map(comp => ({
        name: comp.name,
        amount: amount * comp.rate
      }));
    }

    return {
      baseAmount: amount,
      taxAmount,
      totalAmount,
      effectiveRate: rule.rate,
      appliedRules: rule,
      breakdown
    };
  }
}