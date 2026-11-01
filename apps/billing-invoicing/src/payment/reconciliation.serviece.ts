import { z } from 'zod';
import { InvoiceService } from '../invoices/invoice.service';

export const TransactionStatusEnum = z.enum(['PENDING', 'SETTLED', 'FAILED', 'REFUNDED']);

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  invoiceId: z.string(),
  gatewayReference: z.string(),
  amount: z.number().min(0.01),
  currency: z.string().default('USD'),
  status: TransactionStatusEnum.default('PENDING'),
  settlementFee: z.number().min(0),
  timestamp: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export class ReconciliationService {
  static async getTransactionHistory(): Promise<Transaction[]> {
    // Simulated API fetch logging raw transaction references and settlement fees
    return [
      {
        id: 'tx-1001',
        invoiceId: 'inv-1',
        gatewayReference: 'ch_3N1xYz2eZvKYlo2C19Z',
        amount: 4950.00,
        currency: 'USD',
        status: 'SETTLED',
        settlementFee: 145.50, // Realistic ~2.9% + 30c fee
        timestamp: '2026-10-12T14:30:00Z'
      },
      {
        id: 'tx-1002',
        invoiceId: 'inv-2',
        gatewayReference: 'ch_4P9xAq1bXcJTpo4M21W',
        amount: 6600.00,
        currency: 'USD',
        status: 'FAILED',
        settlementFee: 0,
        timestamp: '2026-10-14T09:15:00Z'
      }
    ];
  }

  static async processPayment(invoiceId: string, amount: number, paymentMethodId: string): Promise<Transaction> {
    console.log(`[Payment Gateway] Processing ${amount} via ${paymentMethodId} for Invoice ${invoiceId}...`);
    
    // Simulate network delay and gateway processing for the demo app
    await new Promise(resolve => setTimeout(resolve, 1500));

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      invoiceId,
      gatewayReference: `ch_sim_${Math.random().toString(36).substring(2, 12)}`,
      amount,
      currency: 'USD',
      status: 'SETTLED',
      settlementFee: (amount * 0.029) + 0.30,
      timestamp: new Date().toISOString(),
    };

    console.log(`[Reconciliation] Transaction ${transaction.id} settled. Updating invoice state...`);
    
    // In Phase 9, this emits a PaymentRecorded event[cite: 1]
    return transaction;
  }
}