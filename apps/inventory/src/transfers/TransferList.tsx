import React, { useEffect, useState } from 'react';
import { TransferService, Transfer } from './transfer.service';

export function TransferList() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    TransferService.getTransfers().then(data => {
      setTransfers(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading transfer history...</div>;

  return (
    <div className="transfer-list" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Inter-Warehouse Transfers</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          New Transfer
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Transfer ID</th>
            <th style={{ padding: '12px 8px' }}>Source</th>
            <th style={{ padding: '12px 8px' }}>Destination</th>
            <th style={{ padding: '12px 8px' }}>Dispatch Date</th>
            <th style={{ padding: '12px 8px' }}>Items</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map(transfer => (
            <tr key={transfer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: '500', fontFamily: 'monospace' }}>{transfer.id}</td>
              <td style={{ padding: '12px 8px' }}>{transfer.sourceWarehouseId}</td>
              <td style={{ padding: '12px 8px' }}>{transfer.destinationWarehouseId}</td>
              <td style={{ padding: '12px 8px' }}>{transfer.dispatchDate || 'Pending'}</td>
              <td style={{ padding: '12px 8px' }}>{transfer.items.reduce((acc, item) => acc + item.quantity, 0)} units</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: transfer.status === 'RECEIVED' ? '#dcfce7' : (transfer.status === 'IN_TRANSIT' ? '#dbeafe' : '#f3f4f6'),
                  color: transfer.status === 'RECEIVED' ? '#166534' : (transfer.status === 'IN_TRANSIT' ? '#1e40af' : '#374151')
                }}>
                  {transfer.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}