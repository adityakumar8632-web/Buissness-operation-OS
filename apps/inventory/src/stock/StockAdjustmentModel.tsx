import React, { useState } from 'react';
import { StockService } from './stock.service';

interface StockAdjustmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function StockAdjustmentModal({ onClose, onSuccess }: StockAdjustmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await StockService.adjustStock({
        skuId: formData.get('skuId') as string,
        warehouseId: formData.get('warehouseId') as string,
        quantity: parseInt(formData.get('quantity') as string, 10),
        type: formData.get('type') as any,
        reason: formData.get('reason') as string,
      });
      // Successful adjustment triggers a re-fetch of the stock levels[cite: 3].
      onSuccess();
    } catch (error) {
      alert('Failed to record adjustment. Ensure valid inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.backdrop} onClick={onClose} />
      <div style={modalStyles.modal}>
        <header style={modalStyles.header}>
          <h3 style={{ margin: 0 }}>Record Stock Adjustment</h3>
          <button onClick={onClose} style={modalStyles.closeButton}>✕</button>
        </header>
        
        <form onSubmit={handleSubmit} style={modalStyles.form}>
          <div style={modalStyles.field}>
            <label>SKU Code</label>
            <input name="skuId" required placeholder="e.g. HW-SRV-001" style={modalStyles.input} />
          </div>

          <div style={modalStyles.field}>
            <label>Warehouse</label>
            <input name="warehouseId" required defaultValue="WH-MAIN" style={modalStyles.input} />
          </div>

          <div style={modalStyles.row}>
            <div style={modalStyles.field}>
              <label>Quantity Change (+/-)</label>
              <input name="quantity" type="number" required placeholder="-5 or 10" style={modalStyles.input} />
            </div>

            <div style={modalStyles.field}>
              <label>Adjustment Type</label>
              <select name="type" required style={modalStyles.input}>
                <option value="ADJUSTMENT_RECONCILIATION">Reconciliation</option>
                <option value="ADJUSTMENT_SHRINKAGE">Shrinkage / Loss</option>
                <option value="ADJUSTMENT_WRITE_OFF">Damage / Write-off</option>
              </select>
            </div>
          </div>

          <div style={modalStyles.field}>
            <label>Reason / Audit Note</label>
            <textarea name="reason" required placeholder="Provide justification for movement history..." style={{ ...modalStyles.input, minHeight: '80px' }} />
          </div>

          <div style={modalStyles.footer}>
            <button type="button" onClick={onClose} style={modalStyles.cancelButton}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={modalStyles.submitButton}>
              {isSubmitting ? 'Recording...' : 'Log Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  backdrop: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modal: { position: 'relative' as const, width: '500px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' },
  closeButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' },
  form: { padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '4px', fontSize: '14px', fontWeight: '500' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '14px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelButton: { padding: '8px 16px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' },
  submitButton: { padding: '8px 16px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};