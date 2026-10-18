import React from 'react';
import { Button } from '@workspace/ui-kit/button';
import type { OrderLineItem } from '@workspace/types/inventory';

interface PackingSlipProps {
  orderId: string;
  boxId: string;
  destinationAddress: string;
  items: OrderLineItem[];
  packedBy: string;
  packedAt: Date;
}

export const PackingSlip: React.FC<PackingSlipProps> = ({ 
  orderId, 
  boxId, 
  destinationAddress, 
  items,
  packedBy,
  packedAt
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="packing-slip print-container border p-8 bg-white max-w-3xl mx-auto">
      <div className="header flex justify-between items-start mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wider">Packing Manifest</h2>
          <p className="text-sm text-gray-500 mt-1">Box ID: {boxId}</p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="no-print">
          Print Manifest
        </Button>
      </div>

      <div className="meta-grid grid grid-cols-2 gap-6 mb-8">
        <div className="order-details">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Order Information</h3>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Packed By:</strong> {packedBy}</p>
          <p><strong>Date:</strong> {packedAt.toLocaleDateString()}</p>
        </div>
        <div className="shipping-details">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Ship To</h3>
          <address className="not-italic whitespace-pre-line">
            {destinationAddress}
          </address>
        </div>
      </div>

      <div className="items-table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y">
              <th className="py-3 px-4 font-semibold text-sm">SKU</th>
              <th className="py-3 px-4 font-semibold text-sm">Description</th>
              <th className="py-3 px-4 font-semibold text-sm text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                <td className="py-3 px-4">{item.product.name}</td>
                <td className="py-3 px-4 text-right font-medium">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer mt-12 text-center text-sm text-gray-400">
        <p>Please include this slip inside the outbound package before sealing.</p>
      </div>
    </div>
  );
};