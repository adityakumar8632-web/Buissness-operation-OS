import { z } from 'zod';

export const GRNStatusEnum = z.enum(['PENDING_INSPECTION', 'PARTIAL_ACCEPTANCE', 'ACCEPTED', 'REJECTED']);

export const IntakeItemSchema = z.object({
  skuId: z.string(),
  expectedQuantity: z.number().min(1),
  acceptedQuantity: z.number().min(0),
  damagedQuantity: z.number().min(0).default(0),
  shortShipmentQuantity: z.number().min(0).default(0),
  notes: z.string().optional()
});

export const GRNSchema = z.object({
  id: z.string().uuid().optional(),
  grnNumber: z.string(),
  poId: z.string(),
  vendorId: z.string(),
  receiveDate: z.string(),
  status: GRNStatusEnum.default('PENDING_INSPECTION'),
  items: z.array(IntakeItemSchema),
  inspectedBy: z.string().optional()
});

export type GRN = z.infer<typeof GRNSchema>;
export type IntakeItem = z.infer<typeof IntakeItemSchema>;

export class ReceiptService {
  static async getGRNs(): Promise<GRN[]> {
    // Simulated API fetch returning Goods Received Notes logged at receiving bays
    return [
      {
        id: 'grn-1',
        grnNumber: 'GRN-2026-001',
        poId: 'po-1',
        vendorId: 'v-cisco',
        receiveDate: '2026-10-20',
        status: 'PENDING_INSPECTION',
        items: [{ skuId: 'HW-SRV-001', expectedQuantity: 10, acceptedQuantity: 0 }]
      },
      {
        id: 'grn-2',
        grnNumber: 'GRN-2026-002',
        poId: 'po-old',
        vendorId: 'v-dell',
        receiveDate: '2026-10-18',
        status: 'PARTIAL_ACCEPTANCE',
        items: [{ skuId: 'HW-LAP-XPS', expectedQuantity: 5, acceptedQuantity: 4, damagedQuantity: 1 }],
        inspectedBy: 'QA-John'
      }
    ];
  }

  static async submitInspection(grnId: string, items: IntakeItem[], inspector: string): Promise<void> {
    console.log(`[Receipt Service] Intake inspection submitted for GRN ${grnId} by ${inspector}.`);
    
    // Check if any items were damaged or short-shipped to determine status
    const hasIssues = items.some(i => i.damagedQuantity > 0 || i.shortShipmentQuantity > 0);
    const newStatus = hasIssues ? 'PARTIAL_ACCEPTANCE' : 'ACCEPTED';
    
    console.log(`[Receipt Service] GRN ${grnId} marked as ${newStatus}.`);
    
    // In Phase 9, this triggers an InventoryReceived event to increase stock and alerts AP[cite: 1, 3]
    if (newStatus === 'ACCEPTED' || newStatus === 'PARTIAL_ACCEPTANCE') {
      console.log(`[Transaction Event] Triggering inventory additions for accepted quantities...`);
    }
  }
}