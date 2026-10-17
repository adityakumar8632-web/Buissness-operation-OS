import React, { useEffect, useState } from 'react';
import { InvoiceService, Invoice } from './invoice.service';

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    InvoiceService.getInvoices().then(data => {
      setInvoices(data);
      setIsLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return { bg: '#dcfce7', text: '#166534' };
      case 'OVERDUE': return { bg: '#fef2f2', text: '#991b1b' };
      case 'DRAFT': return { bg: '#f3f4f6', text: '#374151' };
      case 'ISSUED': return { bg: '#dbeafe', text: '#1e40af' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (isLoading) return <div>Loading invoices...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Invoice Ledger</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Create Invoice
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Invoice #</th>
            <th style={{ padding: '12px 8px' }}>Issue Date</th>
            <th style={{ padding: '12px 8px' }}>Due Date</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(invoice => {
            const colors = getStatusColor(invoice.status);
            return (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 8px', fontWeight: '500', fontFamily: 'monospace' }}>{invoice.invoiceNumber}</td>
                <td style={{ padding: '12px 8px' }}>{invoice.issueDate}</td>
                <td style={{ padding: '12px 8px' }}>{invoice.dueDate}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.grandTotal)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: colors.bg,
                    color: colors.text
                  }}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}