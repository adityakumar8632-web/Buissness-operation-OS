import React, { useState } from 'react';
import { InvoiceService, InvoiceItem } from './invoice.service';

export function InvoiceBuilder() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
  ]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totals = InvoiceService.calculateTotals(items);

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Invoice Builder</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Customer ID</label>
          <input placeholder="e.g. CUST-1001" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Due Date</label>
          <input type="date" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
        </div>
      </div>

      <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>Line Items</h3>
      
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
          <input 
            placeholder="Description" 
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
            style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} 
          />
          <input 
            type="number" 
            placeholder="Qty" 
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} 
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={item.unitPrice}
            onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} 
          />
          <button onClick={() => removeItem(index)} style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}

      <button onClick={addItem} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px' }}>
        + Add Item
      </button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #e5e7eb', paddingTop: '16px' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Subtotal:</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Tax:</span>
            <span>${totals.taxTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid #d1d5db', paddingTop: '8px' }}>
            <span>Total:</span>
            <span>${totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button style={{ padding: '10px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save & Issue Invoice
        </button>
      </div>
    </div>
  );
}