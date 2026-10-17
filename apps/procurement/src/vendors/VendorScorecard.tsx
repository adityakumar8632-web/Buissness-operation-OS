import React, { useEffect, useState } from 'react';
import { VendorService, VendorMetrics } from './vendor.service';

interface VendorScorecardProps {
  vendorId: string;
  vendorName: string;
}

export function VendorScorecard({ vendorId, vendorName }: VendorScorecardProps) {
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null);

  useEffect(() => {
    VendorService.getVendorScorecard(vendorId).then(setMetrics);
  }, [vendorId]);

  if (!metrics) return <div>Loading scorecard...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>{vendorName} - Performance Scorecard</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Fulfillment Speed</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
            {metrics.fulfillmentSpeedDays} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>days avg</span>
          </p>
        </div>
        
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Defect Rate</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: metrics.defectRatePercentage > 5 ? '#dc2626' : '#166534' }}>
            {metrics.defectRatePercentage}%
          </p>
        </div>

        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#166534', textTransform: 'uppercase' }}>Reliability Score</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
            {metrics.reliabilityScore}/100
          </p>
        </div>
      </div>
    </div>
  );
}