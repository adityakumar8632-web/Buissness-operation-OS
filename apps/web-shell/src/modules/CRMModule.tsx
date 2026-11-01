import React, { useState } from 'react';
import { LeadList, ContactList, AccountList, PipelineKanban } from '@business-os/crm';

type CRMSection = 'leads' | 'contacts' | 'accounts' | 'pipeline';

const sections: { id: CRMSection; label: string }[] = [
  { id: 'leads', label: 'Leads' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'pipeline', label: 'Sales pipeline' },
];

export default function CRMModule() {
  const [activeSection, setActiveSection] = useState<CRMSection>('leads');

  return (
    <section aria-labelledby="crm-heading">
      <header style={{ marginBottom: '20px' }}>
        <h1 id="crm-heading" style={{ margin: '0 0 6px', fontSize: '24px' }}>CRM &amp; Sales</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>Manage leads, contacts, accounts, and sales opportunities.</p>
      </header>

      <nav aria-label="CRM sections" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            aria-pressed={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '8px 14px',
              border: '1px solid',
              borderColor: activeSection === section.id ? '#2563eb' : '#d1d5db',
              borderRadius: '6px',
              background: activeSection === section.id ? '#eff6ff' : '#fff',
              color: activeSection === section.id ? '#1d4ed8' : '#374151',
              cursor: 'pointer',
              fontWeight: activeSection === section.id ? 600 : 400,
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div>
        {activeSection === 'leads' && <LeadList />}
        {activeSection === 'contacts' && <ContactList />}
        {activeSection === 'accounts' && <AccountList />}
        {activeSection === 'pipeline' && <PipelineKanban />}
      </div>
    </section>
  );
}
