import React, { useEffect, useState } from 'react';
import { ContactService, Contact } from './contact.service';

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ContactService.getAllContacts().then(data => {
      setContacts(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading contacts...</div>;

  return (
    <div className="contact-list">
      <h2>Global Contact Rolodex</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {contacts.map(contact => (
          <div key={contact.id} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{contact.firstName} {contact.lastName}</h3>
            {contact.roleDesignation && <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>{contact.roleDesignation}</p>}
            <p style={{ margin: '4px 0', fontSize: '14px' }}>📧 {contact.email}</p>
            {contact.phone && <p style={{ margin: '4px 0', fontSize: '14px' }}>📱 {contact.phone}</p>}
            {contact.isPrimary && (
              <span style={{ display: 'inline-block', marginTop: '12px', padding: '4px 8px', fontSize: '12px', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '4px' }}>
                Primary Contact
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}