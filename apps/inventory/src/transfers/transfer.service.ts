import { z } from 'zod';

export const TransferStatusEnum = z.enum(['DRAFT', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED']);

export const TransferItemSchema = z.object({
  skuId: z.string(),
  quantity: z.number().int().positive(),
});

export const TransferSchema = z.object({
  id: z.string().uuid().optional(),
  sourceWarehouseId: z.string(),
  destinationWarehouseId: z.string(),
  status: TransferStatusEnum.default('DRAFT'),
  dispatchDate: z.string().optional(),
  arrivalDate: z.string().optional(),
  items: z.array(TransferItemSchema).min(1, "At least one item is required for a transfer"),
  notes: z.string().optional(),
});

export type Transfer = z.infer<typeof TransferSchema>;
export type TransferItem = z.infer<typeof TransferItemSchema>;

export class TransferService {
  static async getTransfers(): Promise<Transfer[]> {
    // Simulated API fetch returning past and pending inter-warehouse transfers
    return [
      { 
        id: 'TR-1001', 
        sourceWarehouseId: 'WH-MAIN', 
        destinationWarehouseId: 'WH-EAST', 
        status: 'IN_TRANSIT', 
        dispatchDate: '2026-10-15',
        items: [{ skuId: 'HW-SRV-001', quantity: 2 }]
      },
      { 
        id: 'TR-1002', 
        sourceWarehouseId: 'WH-EAST', 
        destinationWarehouseId: 'WH-MAIN', 
        status: 'RECEIVED', 
        dispatchDate: '2026-10-10',
        arrivalDate: '2026-10-12',
        items: [{ skuId: 'CON-CBL-05M', quantity: 50 }]
      }
    ];
  }

  static async getTransferById(id: string): Promise<Transfer | null> {
    const transfers = await this.getTransfers();
    return transfers.find(t => t.id === id) || null;
  }

  static async createTransfer(data: unknown): Promise<Transfer> {
    const validTransfer = TransferSchema.parse(data);
    return { ...validTransfer, id: `TR-${Math.floor(Math.random() * 10000)}` };
  }

  static async updateTransferStatus(id: string, status: Transfer['status']): Promise<void> {
    // Simulated PATCH request coordinating warehouse balance adjustments
    console.log(`[Transfer ${id}] Status updated to: ${status}`);
    if (status === 'RECEIVED') {
      console.log(`[Transaction] Adjusting destination warehouse balances for Transfer ${id}...`);
    }
  }
}