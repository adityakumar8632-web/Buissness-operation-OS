import React, { useEffect, useState } from 'react';
import { TransferService, Transfer } from './transfer.service';

interface TransferManifestProps {
  transferId: string;
}

export function TransferManifest({ transferId }: TransferManifestProps) {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    TransferService.getTransferById(transferId).then(data => {
      setTransfer(data);
      setIsLoading(false);
    });
  }, [transferId]);

  if (isLoading) return <div>Loading manifest...</div>;
  if (!transfer) return <div>Transfer manifest not found.</div>;

  return (
    <div style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Transfer Manifest</h1>
          <p style={{ margin: 0, color: '#6b7280', fontFamily: 'monospace', fontSize: '16px' }}>{transfer.id}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>Status: {transfer.status}</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Dispatch: {transfer.dispatchDate || 'N/A'}</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Arrival: {transfer.arrivalDate || 'Pending'}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563', textTransform: 'uppercase' }}>Source Location</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{transfer.sourceWarehouseId}</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4b5563', textTransform: 'uppercase' }}>Destination Location</h3>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>{transfer.destinationWarehouseId}</p>
        </div>
      </div>

      <div>
        <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>Manifest Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px' }}>SKU</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transfer.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{item.skuId}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500' }}>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>
          Print Manifest
        </button>
        {transfer.status === 'IN_TRANSIT' && (
          <button style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Mark as Received
          </button>
        )}
      </div>
    </div>
  );
}