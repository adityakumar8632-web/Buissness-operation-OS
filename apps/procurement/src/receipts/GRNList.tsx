import React, { useEffect, useState } from 'react';
import { ReceiptService, GRN } from './receipt.service';

export function GRNList() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ReceiptService.getGRNs().then(data => {
      setGrns(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading Goods Received Notes...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Goods Received Notes (GRN)</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Log New Receipt
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>GRN Number</th>
            <th style={{ padding: '12px 8px' }}>PO Reference</th>
            <th style={{ padding: '12px 8px' }}>Vendor ID</th>
            <th style={{ padding: '12px 8px' }}>Receive Date</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {grns.map(grn => (
            <tr key={grn.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: '500', fontFamily: 'monospace' }}>{grn.grnNumber}</td>
              <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{grn.poId}</td>
              <td style={{ padding: '12px 8px' }}>{grn.vendorId}</td>
              <td style={{ padding: '12px 8px' }}>{grn.receiveDate}</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: grn.status === 'ACCEPTED' ? '#dcfce7' : '#fef3c7',
                  color: grn.status === 'ACCEPTED' ? '#166534' : '#92400e'
                }}>
                  {grn.status.replace('_', ' ')}
                </span>
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {grn.status === 'PENDING_INSPECTION' && (
                  <button style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Inspect
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}