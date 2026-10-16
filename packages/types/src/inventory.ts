import { BaseEntity } from './common';

export interface SKU extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  unitPrice: number;
  category: string;
}

export interface InventoryBalance {
  skuId: string;
  warehouseId: string;
  onHand: number;
  allocated: number;
  available: number;
}

export interface StockAdjustment extends BaseEntity {
  skuId: string;
  warehouseId: string;
  quantityChanged: number;
  reason: 'Reconciliation' | 'WriteOff' | 'Shrinkage' | 'ManualReceipt';
  performedBy: string;
}

export type TransferStatus = 'Draft' | 'InTransit' | 'Received' | 'Cancelled';

export interface WarehouseTransfer extends BaseEntity {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  status: TransferStatus;
  items: Array<{ skuId: string; quantity: number }>;
  dispatchedAt?: string;
  receivedAt?: string;
}