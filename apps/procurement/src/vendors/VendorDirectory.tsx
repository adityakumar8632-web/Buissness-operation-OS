import React, { useEffect, useState } from 'react';
import { VendorService, Vendor } from './vendor.service';

export function VendorDirectory() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    VendorService.getVendors().then(data => {
      setVendors(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading vendor directory...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Vendor & Supplier Directory</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Onboard Vendor
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Vendor Name</th>
            <th style={{ padding: '12px 8px' }}>Contact Email</th>
            <th style={{ padding: '12px 8px' }}>Payment Terms</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <tr key={vendor.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{vendor.name}</td>
              <td style={{ padding: '12px 8px' }}>{vendor.contactEmail}</td>
              <td style={{ padding: '12px 8px' }}>{vendor.paymentTerms}</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: vendor.status === 'ACTIVE' ? '#dcfce7' : '#f3f4f6',
                  color: vendor.status === 'ACTIVE' ? '#166534' : '#374151'
                }}>
                  {vendor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}