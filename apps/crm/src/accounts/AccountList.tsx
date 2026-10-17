import React, { useEffect, useState } from 'react';
import { AccountService, Account } from './account.service';

export function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AccountService.getAccounts().then(data => {
      setAccounts(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading accounts directory...</div>;

  return (
    <div className="account-list">
      <h2>Enterprise Directory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Account Name</th>
            <th style={{ padding: '12px 16px' }}>Industry</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 16px', fontWeight: '500' }}>{account.name}</td>
              <td style={{ padding: '12px 16px', color: '#4b5563' }}>{account.industry || '—'}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: account.status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
                  color: account.status === 'ACTIVE' ? '#15803d' : '#374151'
                }}>
                  {account.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}