import { z } from 'zod';

export const TaxRegionEnum = z.enum(['US', 'EU', 'IN', 'UK', 'GLOBAL']);

export const TaxClassEnum = z.enum(['STANDARD', 'REDUCED', 'ZERO', 'EXEMPT']);

export const TaxIdentificationSchema = z.object({
  region: TaxRegionEnum,
  taxId: z.string().min(5, "Tax ID is too short").max(50, "Tax ID is too long"),
  businessName: z.string().min(2, "Business name is required for tax reporting"),
});

export const TaxCalculationInputSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  region: TaxRegionEnum,
  taxClass: TaxClassEnum.default('STANDARD'),
  isB2B: z.boolean().default(false), // Useful for EU VAT reverse charge logic
});

export type TaxIdentification = z.infer<typeof TaxIdentificationSchema>;
export type TaxCalculationInput = z.infer<typeof TaxCalculationInputSchema>;