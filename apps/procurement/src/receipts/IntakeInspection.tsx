import React, { useState } from 'react';
import { IntakeItem, ReceiptService } from './receipt.service';

interface IntakeInspectionProps {
  grnId: string;
  initialItems: IntakeItem[];
}

export function IntakeInspection({ grnId, initialItems }: IntakeInspectionProps) {
  const [items, setItems] = useState<IntakeItem[]>(initialItems);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = (index: number, field: keyof IntakeItem, value: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await ReceiptService.submitInspection(grnId, items, 'Current User');
      alert('Inspection recorded successfully.');
    } catch (e) {
      alert('Failed to submit inspection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '8px' }}>QA Intake Inspection</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Document accepted, damaged, and short-shipped quantities for GRN: <strong>{grnId}</strong></p>

      {items.map((item, index) => (
        <div key={index} style={{ padding: '16px', border: '1px solid #d1d5db', borderRadius: '6px', marginBottom: '16px', backgroundColor: '#f9fafb' }}>
          <h4 style={{ margin: '0 0 12px 0', fontFamily: 'monospace', fontSize: '16px' }}>SKU: {item.skuId}</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '4px' }}>Expected Qty</label>
              <input type="number" disabled value={item.expectedQuantity} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#e5e7eb' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#166534', fontWeight: 'bold', marginBottom: '4px' }}>Accepted Qty</label>
              <input type="number" min="0" value={item.acceptedQuantity} onChange={(e) => handleUpdate(index, 'acceptedQuantity', Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #22c55e' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#dc2626', fontWeight: 'bold', marginBottom: '4px' }}>Damaged Qty</label>
              <input type="number" min="0" value={item.damagedQuantity} onChange={(e) => handleUpdate(index, 'damagedQuantity', Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ef4444' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#d97706', fontWeight: 'bold', marginBottom: '4px' }}>Short Shipped</label>
              <input type="number" min="0" value={item.shortShipmentQuantity} onChange={(e) => handleUpdate(index, 'shortShipmentQuantity', Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #f59e0b' }} />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '10px 24px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSubmitting ? 'Saving...' : 'Finalize Inspection'}
        </button>
      </div>
    </div>
  );
}