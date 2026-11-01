import React, { useEffect, useState } from 'react';
import { ReconciliationService, Transaction } from './reconciliation.service';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ReconciliationService.getTransactionHistory().then(data => {
      setTransactions(data);
      setIsLoading(false);
    });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SETTLED': return { bg: '#dcfce7', text: '#166534' };
      case 'PENDING': return { bg: '#fef3c7', text: '#92400e' };
      case 'FAILED': return { bg: '#fef2f2', text: '#991b1b' };
      case 'REFUNDED': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (isLoading) return <div>Loading transaction history...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2>Transaction History</h2>
        <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Log of external gateway payouts and reconciliations.</p>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Timestamp</th>
            <th style={{ padding: '12px 8px' }}>Gateway Ref</th>
            <th style={{ padding: '12px 8px' }}>Invoice ID</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Net (Post-Fee)</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => {
            const statusStyle = getStatusStyle(tx.status);
            const netAmount = tx.amount - tx.settlementFee;
            
            return (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 8px', color: '#4b5563' }}>
                  {new Date(tx.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{tx.gatewayReference}</td>
                <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{tx.invoiceId}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', color: '#166534' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: tx.currency }).format(netAmount)}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text
                  }}>
                    {tx.status}
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