import { BaseEntity } from './common';

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Void';

export interface InvoiceItem {
  id: string;
  skuId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice extends BaseEntity {
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
}

export interface PaymentTransaction extends BaseEntity {
  invoiceId: string;
  amount: number;
  gatewayReference: string;
  status: 'Pending' | 'Success' | 'Failed';
  settledAt?: string;
}