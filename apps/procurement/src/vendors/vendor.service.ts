import { z } from 'zod';

export const VendorStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'UNDER_REVIEW', 'BLACKLISTED']);

export const VendorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  contactEmail: z.string().email(),
  paymentTerms: z.string(),
  status: VendorStatusEnum.default('ACTIVE'),
  onboardingCompleted: z.boolean().default(true),
});

export type Vendor = z.infer<typeof VendorSchema>;

export interface VendorMetrics {
  vendorId: string;
  fulfillmentSpeedDays: number;
  defectRatePercentage: number;
  reliabilityScore: number;
}

export class VendorService {
  static async getVendors(): Promise<Vendor[]> {
    // Simulated API fetch for the directory of approved suppliers
    return [
      { id: 'v-cisco', name: 'Cisco Systems', contactEmail: 'sales@cisco.test', paymentTerms: 'Net 30', status: 'ACTIVE', onboardingCompleted: true },
      { id: 'v-dell', name: 'Dell Technologies', contactEmail: 'enterprise@dell.test', paymentTerms: 'Net 45', status: 'ACTIVE', onboardingCompleted: true }
    ];
  }

  static async getVendorScorecard(vendorId: string): Promise<VendorMetrics> {
    // Simulated analytics breakdown measuring speeds, defect rates, and reliability[cite: 3]
    return {
      vendorId,
      fulfillmentSpeedDays: 4.2,
      defectRatePercentage: 1.5,
      reliabilityScore: 92
    };
  }
}