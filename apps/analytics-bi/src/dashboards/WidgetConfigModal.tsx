import React, { useState } from 'react';
import { Modal } from '@workspace/ui-kit/modal';
import { Button } from '@workspace/ui-kit/button';

interface WidgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ isOpen, onClose, onSave }) => {
  const [metric, setMetric] = useState('revenue');
  const [chartType, setChartType] = useState('line');

  const handleSave = () => {
    onSave({ metric, chartType });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Analytics Widget">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Metric</label>
          <select className="w-full border-gray-300 rounded-md shadow-sm" value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="revenue">Gross Revenue</option>
            <option value="mrr">MRR</option>
            <option value="turnover">Inventory Turnover</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visualization Type</label>
          <select className="w-full border-gray-300 rounded-md shadow-sm" value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="line">Line Chart</option>
            <option value="bar">Bar Graph</option>
            <option value="metric">Single KPI Value</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="solid" onClick={handleSave}>Save Widget</Button>
      </div>
    </Modal>
  );
};