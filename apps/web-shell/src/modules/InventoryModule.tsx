import React, { useState } from 'react';
import { ProductCatalog, StockLevels, BatchTracker, TransferList } from '@business-os/inventory';

type InventorySection = 'products' | 'stock' | 'tracking' | 'transfers';

const sections: { id: InventorySection; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'stock', label: 'Stock levels' },
  { id: 'tracking', label: 'Batch tracking' },
  { id: 'transfers', label: 'Transfers' },
];

export default function InventoryModule() {
  const [activeSection, setActiveSection] = useState<InventorySection>('products');

  return (
    <section aria-labelledby="inventory-heading">
      <header style={{ marginBottom: '20px' }}>
        <h1 id="inventory-heading" style={{ margin: '0 0 6px', fontSize: '24px' }}>Inventory</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>Manage product records, warehouse stock, batches, and transfers.</p>
      </header>

      <nav aria-label="Inventory sections" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
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
        {activeSection === 'products' && <ProductCatalog />}
        {activeSection === 'stock' && <StockLevels />}
        {activeSection === 'tracking' && <BatchTracker />}
        {activeSection === 'transfers' && <TransferList />}
      </div>
    </section>
  );
}
