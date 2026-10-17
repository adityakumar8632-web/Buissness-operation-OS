import React, { useEffect, useState } from 'react';
import { POService, PurchaseOrder } from './po.service';

export function POList() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    POService.getPurchaseOrders().then(data => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DISPATCHED':
      case 'FULFILLED': return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING_APPROVAL': return { bg: '#fef3c7', text: '#92400e' };
      case 'DRAFT': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#e0e7ff', text: '#3730a3' };
    }
  };

  if (isLoading) return <div>Loading Purchase Orders...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Purchase Orders</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Create PO
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>PO Number</th>
            <th style={{ padding: '12px 8px' }}>Vendor ID</th>
            <th style={{ padding: '12px 8px' }}>Issue Date</th>
            <th style={{ padding: '12px 8px' }}>Expected Delivery</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total Amount</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(po => {
            const style = getStatusStyle(po.status);
            return (
              <tr key={po.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 8px', fontWeight: '500', fontFamily: 'monospace' }}>{po.poNumber}</td>
                <td style={{ padding: '12px 8px' }}>{po.vendorId}</td>
                <td style={{ padding: '12px 8px' }}>{po.issueDate}</td>
                <td style={{ padding: '12px 8px' }}>{po.expectedDeliveryDate || 'TBD'}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(po.totalAmount)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: style.bg, color: style.text }}>
                    {po.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  {po.status === 'PENDING_APPROVAL' && (
                    <button onClick={() => POService.approveAndDispatch(po.id as string)} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}