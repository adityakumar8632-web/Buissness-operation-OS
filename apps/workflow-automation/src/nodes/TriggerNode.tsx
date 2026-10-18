import React from 'react';
import { Button } from '@workspace/ui-kit/button';

interface TriggerNodeProps {
  nodeId: string;
  config: { eventName?: string };
  onUpdate: (nodeId: string, config: any) => void;
}

export const TriggerNode: React.FC<TriggerNodeProps> = ({ nodeId, config, onUpdate }) => {
  // Starting node component binding workflows to system events (e.g., deal.won, stock.low)[cite: 3].
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(nodeId, { ...config, eventName: e.target.value });
  };

  return (
    <div className="trigger-node-config p-4 bg-white border border-green-200 rounded-md shadow-sm">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Configure Trigger</h4>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Listen for System Event
      </label>
      <select 
        className="w-full text-sm border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
        value={config.eventName || ''}
        onChange={handleEventChange}
      >
        <option value="" disabled>Select an event...</option>
        <option value="deal.won">Deal Won (CRM)</option>
        <option value="stock.low">Low Stock Alert (Inventory)</option>
        <option value="invoice.overdue">Invoice Overdue (Billing)</option>
        <option value="ticket.created">Support Ticket Created</option>
      </select>
      <p className="text-xs text-gray-500 mt-2">
        This workflow will execute immediately when this event occurs.
      </p>
    </div>
  );
};