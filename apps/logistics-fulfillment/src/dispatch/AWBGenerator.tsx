import React, { useState } from 'react';
import { Button } from '@workspace/ui-kit/button';
import { Modal } from '@workspace/ui-kit/modal';
import { apiClient } from '@workspace/api-client';

interface AWBGeneratorProps {
  orderId: string;
  trackingNumber: string;
}

export const AWBGenerator: React.FC<AWBGeneratorProps> = ({ orderId, trackingNumber }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAWBDocument = async () => {
    setIsGenerating(true);
    try {
      const response = await apiClient.get<{ documentUrl: string }>(`/api/logistics/awb/${trackingNumber}/generate-pdf`);
      setPdfUrl(response.data.documentUrl);
      setModalOpen(true);
    } catch (error) {
      console.error('AWB generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={generateAWBDocument} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Print AWB'}
      </Button>
      
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Airway Bill: ${trackingNumber}`}>
        <div className="awb-preview">
          {pdfUrl ? (
            <iframe src={pdfUrl} width="100%" height="500px" title="AWB Document" />
          ) : (
            <p>Document unavailable.</p>
          )}
        </div>
      </Modal>
    </>
  );
};