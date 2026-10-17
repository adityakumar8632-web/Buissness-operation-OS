import { z } from 'zod';

export const POStatusEnum = z.enum(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED', 'PARTIAL_RECEIPT', 'FULFILLED', 'CANCELLED']);

export const POItemSchema = z.object({
  skuId: z.string(),
  quantity: z.number().min(1),
  unitCost: z.number().min(0),
});

export const POSchema = z.object({
  id: z.string().uuid().optional(),
  poNumber: z.string(),
  vendorId: z.string(),
  status: POStatusEnum.default('DRAFT'),
  issueDate: z.string(),
  expectedDeliveryDate: z.string().optional(),
  items: z.array(POItemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0),
});

export type PurchaseOrder = z.infer<typeof POSchema>;
export type POItem = z.infer<typeof POItemSchema>;

export class POService {
  static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    // Simulated API fetch returning open, submitted, and approved POs
    return [
      {
        id: 'po-1',
        poNumber: 'PO-2026-9001',
        vendorId: 'v-cisco',
        status: 'DISPATCHED',
        issueDate: '2026-10-15',
        expectedDeliveryDate: '2026-10-22',
        items: [{ skuId: 'HW-SRV-001', quantity: 10, unitCost: 3500 }],
        totalAmount: 35000,
      },
      {
        id: 'po-2',
        poNumber: 'PO-2026-9002',
        vendorId: 'v-dell',
        status: 'PENDING_APPROVAL',
        issueDate: '2026-10-17',
        items: [{ skuId: 'HW-LAP-XPS', quantity: 5, unitCost: 1200 }],
        totalAmount: 6000,
      }
    ];
  }

  static async submitForApproval(id: string): Promise<void> {
    console.log(`[PO Service] PO ${id} submitted for manager approval.`);
  }

  static async approveAndDispatch(id: string): Promise<void> {
    console.log(`[PO Service] PO ${id} approved and dispatched to vendor.`);
    // In Phase 9, this emits a PurchaseOrderCreated event[cite: 1]
  }
}