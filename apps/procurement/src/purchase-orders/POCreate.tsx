import React, { useState } from 'react';
import { POItem } from './po.service';

export function POCreate() {
  const [vendorId, setVendorId] = useState('');
  const [items, setItems] = useState<POItem[]>([{ skuId: '', quantity: 1, unitCost: 0 }]);

  const handleItemChange = (index: number, field: keyof POItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { skuId: '', quantity: 1, unitCost: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '24px' }}>Draft Purchase Order</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Vendor / Supplier</label>
        <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', width: '100%', maxWidth: '300px' }}>
          <option value="">Select Vendor...</option>
          <option value="v-cisco">Cisco Systems</option>
          <option value="v-dell">Dell Technologies</option>
        </select>
      </div>

      <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px' }}>Requested Items</h3>
      
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
          <input 
            placeholder="SKU ID" 
            value={item.skuId}
            onChange={(e) => handleItemChange(index, 'skuId', e.target.value)}
            style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', fontFamily: 'monospace' }} 
          />
          <input 
            type="number" 
            placeholder="Qty" 
            value={item.quantity}
            min="1"
            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} 
          />
          <input 
            type="number" 
            placeholder="Unit Cost" 
            value={item.unitCost}
            min="0"
            step="0.01"
            onChange={(e) => handleItemChange(index, 'unitCost', Number(e.target.value))}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} 
          />
          <div style={{ width: '100px', textAlign: 'right', fontWeight: '500' }}>
            ${(item.quantity * item.unitCost).toFixed(2)}
          </div>
          <button onClick={() => removeItem(index)} style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}

      <button onClick={addItem} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px' }}>
        + Add Item
      </button>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #e5e7eb', paddingTop: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>Total PO Value</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalAmount)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '12px' }}>
        <button style={{ padding: '10px 24px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          Save Draft
        </button>
        <button style={{ padding: '10px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit for Approval
        </button>
      </div>
    </div>
  );
}