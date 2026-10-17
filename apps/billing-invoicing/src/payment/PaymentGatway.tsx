import React, { useState } from 'react';
import { ReconciliationService } from './reconciliation.service';

interface PaymentGatewayProps {
  invoiceId: string;
  amountDue: number;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function PaymentGateway({ invoiceId, amountDue, onSuccess, onCancel }: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const cardName = formData.get('cardName') as string;
      
      if (!cardName) throw new Error('Cardholder name is required');

      // Simulate the gateway tokenization and reconciliation charge[cite: 3]
      const transaction = await ReconciliationService.processPayment(invoiceId, amountDue, 'tok_visa_simulated');
      onSuccess(transaction.id as string);
    } catch (err: any) {
      setError(err.message || 'Payment failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>Secure Checkout</h3>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Invoice: {invoiceId}</p>
        <div style={{ marginTop: '16px', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountDue)}
        </div>
      </header>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>Cardholder Name</label>
          <input name="cardName" required placeholder="Jane Doe" defaultValue="Aditya Kumar" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>Card Details</label>
          {/* Simulated secure element field */}
          <div style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', display: 'flex', gap: '8px', alignItems: 'center', color: '#9ca3af' }}>
            <span>💳</span>
            <span style={{ letterSpacing: '2px' }}>•••• •••• •••• 4242</span>
            <span style={{ marginLeft: 'auto' }}>12/28</span>
            <span>CVC</span>
          </div>
          <span style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right' }}>Secured by Business OS Demo</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="button" onClick={onCancel} disabled={isProcessing} style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
            Cancel
          </button>
          <button type="submit" disabled={isProcessing} style={{ flex: 2, padding: '12px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isProcessing ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountDue)}`}
          </button>
        </div>
      </form>
    </div>
  );
}