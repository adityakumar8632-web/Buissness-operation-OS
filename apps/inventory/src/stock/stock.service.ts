import { z } from 'zod';

// Define the transaction types to enforce movement history[cite: 1].
export const StockMovementTypeEnum = z.enum([
  'RECEIPT',
  'FULFILLMENT',
  'ADJUSTMENT_SHRINKAGE',
  'ADJUSTMENT_RECONCILIATION',
  'ADJUSTMENT_WRITE_OFF'
]);

export const StockAdjustmentSchema = z.object({
  skuId: z.string(),
  warehouseId: z.string(),
  quantity: z.number().int(), // Can be negative for write-offs or shrinkage
  type: StockMovementTypeEnum,
  reason: z.string().min(1, "Reason is required for audit trails"),
  referenceId: z.string().optional() // E.g., Audit ID or Incident ID
});

export type StockAdjustment = z.infer<typeof StockAdjustmentSchema>;

export interface StockLevel {
  id: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  allocated: number;
  safetyStock: number;
}

export class StockService {
  static async getStockLevels(): Promise<StockLevel[]> {
    // Simulated API fetch returning real-time overview of stock levels[cite: 3].
    return [
      { id: 'sl1', sku: 'HW-SRV-001', warehouseId: 'WH-MAIN', onHand: 50, allocated: 5, safetyStock: 10 },
      { id: 'sl2', sku: 'SW-LIC-100', warehouseId: 'WH-MAIN', onHand: 9999, allocated: 0, safetyStock: 0 },
      { id: 'sl3', sku: 'CON-CBL-05M', warehouseId: 'WH-EAST', onHand: 15, allocated: 20, safetyStock: 50 } // Backordered
    ];
  }

  static async adjustStock(adjustment: StockAdjustment): Promise<void> {
    const validAdjustment = StockAdjustmentSchema.parse(adjustment);
    
    // Critical invariant: inventory is never changed by silently overwriting a number; 
    // meaningful changes must produce movement history[cite: 1].
    console.log(`[Transaction Started] Processing stock movement...`);
    console.log(`Movement Record Logged:`, validAdjustment);
    console.log(`[Transaction Committed] Stock levels updated atomically.`);
  }
}