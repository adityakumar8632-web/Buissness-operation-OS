import { z } from 'zod';

export const BatchStatusEnum = z.enum(['ACTIVE', 'QUARANTINED', 'EXPIRED', 'RECALLED']);

export const BatchSchema = z.object({
  id: z.string(),
  skuId: z.string(),
  productionDate: z.string(),
  expirationDate: z.string().optional(),
  supplierId: z.string().optional(),
  status: BatchStatusEnum,
});

export type Batch = z.infer<typeof BatchSchema>;

export interface ScanResult {
  code: string;
  type: 'SERIAL_NUMBER' | 'BATCH_CODE' | 'SKU';
  isValid: boolean;
  referenceId?: string;
  details?: string;
}

export class TrackingService {
  static async getBatchDetails(batchId: string): Promise<Batch | null> {
    // Simulated API fetch to audit specific batch/lot runs
    const mockBatches: Record<string, Batch> = {
      'LOT-2026-A1': { id: 'LOT-2026-A1', skuId: 'CON-CBL-05M', productionDate: '2026-01-15', status: 'ACTIVE' },
      'LOT-MED-99': { id: 'LOT-MED-99', skuId: 'MED-VACC-01', productionDate: '2026-05-10', expirationDate: '2026-11-10', status: 'QUARANTINED' }
    };
    
    return mockBatches[batchId] || null;
  }

  static async processScannedBarcode(code: string): Promise<ScanResult> {
    // Simulated backend resolution of a scanned barcode
    if (code.startsWith('SN-')) {
      return { code, type: 'SERIAL_NUMBER', isValid: true, referenceId: 'sl1', details: 'Enterprise Server Rack (HW-SRV-001)' };
    }
    if (code.startsWith('LOT-')) {
      return { code, type: 'BATCH_CODE', isValid: true, referenceId: code, details: 'Batch tracked item' };
    }
    return { code, type: 'SKU', isValid: false, details: 'Unrecognized barcode format' };
  }
}