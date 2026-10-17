import React, { useState, useRef, useEffect } from 'react';
import { TrackingService, ScanResult } from './tracking.service';

export function BarcodeScanner() {
  const [scanInput, setScanInput] = useState('');
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input to ensure handheld scanner wedge inputs are captured
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const result = await TrackingService.processScannedBarcode(scanInput.trim());
    setLastScan(result);
    setScanInput(''); // Clear for next scan
    
    // Maintain focus for continuous scanning
    inputRef.current?.focus();
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>Real-Time Barcode Scanner</h2>
        <span style={{ fontSize: '24px' }}>📷</span>
      </header>
      
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
        Ensure this window is focused. Use your handheld scanner to scan a barcode, or manually type the serial/lot number and press Enter.
      </p>

      <form onSubmit={handleScanSubmit} style={{ marginBottom: '24px' }}>
        <input
          ref={inputRef}
          type="text"
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          placeholder="Awaiting scanner input..."
          style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: '8px', border: '2px solid #3b82f6', outline: 'none' }}
        />
      </form>

      {lastScan && (
        <div style={{ 
          padding: '16px', 
          borderRadius: '8px', 
          backgroundColor: lastScan.isValid ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${lastScan.isValid ? '#bbf7d0' : '#fecaca'}` 
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: lastScan.isValid ? '#166534' : '#991b1b' }}>
            {lastScan.isValid ? '✅ Scan Successful' : '❌ Scan Unrecognized'}
          </h4>
          <p style={{ margin: '4px 0', fontFamily: 'monospace', fontSize: '16px' }}><strong>Code:</strong> {lastScan.code}</p>
          <p style={{ margin: '4px 0' }}><strong>Type:</strong> {lastScan.type}</p>
          {lastScan.details && <p style={{ margin: '4px 0' }}><strong>Details:</strong> {lastScan.details}</p>}
        </div>
      )}
    </div>
  );
}