import { z } from 'zod';

export const InvoiceStatusEnum = z.enum(['DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED']);

export const InvoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  taxRate: z.number().min(0).default(0),
});

export const InvoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string(),
  customerId: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  status: InvoiceStatusEnum.default('DRAFT'),
  items: z.array(InvoiceItemSchema),
  subtotal: z.number().min(0),
  taxTotal: z.number().min(0),
  grandTotal: z.number().min(0),
  amountPaid: z.number().min(0).default(0),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;

export class InvoiceService {
  static async getInvoices(): Promise<Invoice[]> {
    // Simulated API fetch returning invoice ledger
    return [
      {
        id: 'inv-1',
        invoiceNumber: 'INV-2026-001',
        customerId: 'a1',
        issueDate: '2026-10-01',
        dueDate: '2026-10-15',
        status: 'OVERDUE',
        items: [{ description: 'Enterprise Server Rack', quantity: 1, unitPrice: 4500, taxRate: 0.1 }],
        subtotal: 4500,
        taxTotal: 450,
        grandTotal: 4950,
        amountPaid: 0,
      },
      {
        id: 'inv-2',
        invoiceNumber: 'INV-2026-002',
        customerId: 'a2',
        issueDate: '2026-10-10',
        dueDate: '2026-11-10',
        status: 'ISSUED',
        items: [{ description: 'Cloud Ops License (Annual)', quantity: 5, unitPrice: 1200, taxRate: 0.1 }],
        subtotal: 6000,
        taxTotal: 600,
        grandTotal: 6600,
        amountPaid: 0,
      }
    ];
  }

  static calculateTotals(items: InvoiceItem[]) {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      taxTotal += lineTotal * item.taxRate;
    });

    return {
      subtotal,
      taxTotal,
      grandTotal: subtotal + taxTotal
    };
  }
}