import React, { useState } from 'react';
import { Button } from '@workspace/ui-kit/button';
import { PackagingService } from './packaging.service';

export const PackingStation: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [scannedSkus, setScannedSkus] = useState<string[]>([]);
  const [currentScan, setCurrentScan] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScan.trim()) return;
    setScannedSkus(prev => [...prev, currentScan.trim()]);
    setCurrentScan('');
  };

  const handleSealBox = async () => {
    try {
      setError(null);
      await PackagingService.sealPackage(orderId, scannedSkus, 'MEDIUM_BOX');
      // Success state routing handled here
    } catch (err: any) {
      setError(err.message || 'Failed to seal package.');
    }
  };

  return (
    <div className="packing-station">
      <h3>Packing Station: Order {orderId}</h3>
      
      <form onSubmit={handleScan} className="scan-input-group">
        <input 
          type="text" 
          value={currentScan} 
          onChange={(e) => setCurrentScan(e.target.value)} 
          placeholder="Scan SKU barcode..."
          autoFocus
        />
        <Button type="submit" variant="outline">Enter</Button>
      </form>

      <div className="scanned-list">
        <h4>Scanned Items ({scannedSkus.length})</h4>
        <ul>
          {scannedSkus.map((sku, idx) => (
            <li key={idx}>{sku}</li>
          ))}
        </ul>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Button variant="solid" onClick={handleSealBox} disabled={scannedSkus.length === 0}>
        Verify & Seal Box
      </Button>
    </div>
  );
};