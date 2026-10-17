import React from 'react';
import { Invoice } from './invoice.service';

interface InvoicePDFTemplateProps {
  invoice: Invoice;
}

export function InvoicePDFTemplate({ invoice }: InvoicePDFTemplateProps) {
  return (
    <div style={{ padding: '40px', backgroundColor: '#fff', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#111827' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '24px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#111827' }}>INVOICE</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Reference: <strong>{invoice.invoiceNumber}</strong></p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Business Operations OS</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>123 Enterprise Way<br/>Tech City, TC 90210</p>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Bill To:</h3>
          <p style={{ margin: 0, fontWeight: '500' }}>Customer ID: {invoice.customerId}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px 0' }}><strong>Issue Date:</strong> {invoice.issueDate}</p>
          <p style={{ margin: 0 }}><strong>Due Date:</strong> {invoice.dueDate}</p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Qty</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Unit Price</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px' }}>{item.description}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280' }}>Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ color: '#6b7280' }}>Tax:</span>
            <span>${invoice.taxTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontWeight: 'bold', fontSize: '20px' }}>
            <span>Total Due:</span>
            <span>${(invoice.grandTotal - invoice.amountPaid).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}