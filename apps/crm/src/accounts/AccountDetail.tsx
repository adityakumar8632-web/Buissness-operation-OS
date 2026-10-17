import React, { useEffect, useState } from 'react';
import { AccountService, Account } from './account.service';
import { ContactService, Contact } from '../contacts/contact.service';

interface AccountDetailProps {
  accountId: string;
}

export function AccountDetail({ accountId }: AccountDetailProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AccountService.getAccountById(accountId),
      ContactService.getContactsByAccount(accountId)
    ]).then(([accountData, contactsData]) => {
      setAccount(accountData);
      setContacts(contactsData);
      setIsLoading(false);
    });
  }, [accountId]);

  if (isLoading) return <div>Loading account details...</div>;
  if (!account) return <div>Account not found.</div>;

  return (
    <div className="account-detail" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>{account.name}</h2>
        <p style={{ color: '#6b7280', margin: 0 }}>
          {account.industry} • Status: <strong>{account.status}</strong>
        </p>
        {account.website && (
          <a href={account.website} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '12px' }}>
            Visit Website
          </a>
        )}
      </div>

      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Linked Contacts</h3>
        {contacts.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No contacts linked to this account.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {contacts.map(c => (
              <li key={c.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <strong>{c.firstName} {c.lastName}</strong> {c.roleDesignation && <span>({c.roleDesignation})</span>}
                {c.isPrimary && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#b45309' }}>Primary</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Linked deals and hierarchy visualization would be connected here via the pipeline service[cite: 3] */}
    </div>
  );
}