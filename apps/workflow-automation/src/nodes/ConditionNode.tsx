import React from 'react';

interface ConditionNodeProps {
  nodeId: string;
  config: { field?: string; operator?: string; value?: string };
  onUpdate: (nodeId: string, config: any) => void;
}

export const ConditionNode: React.FC<ConditionNodeProps> = ({ nodeId, config, onUpdate }) => {
  // UI node component evaluating boolean logic and splitting execution into conditional branches[cite: 3].
  const handleChange = (field: string, value: string) => {
    onUpdate(nodeId, { ...config, [field]: value });
  };

  return (
    <div className="condition-node-config p-4 bg-white border border-yellow-200 rounded-md shadow-sm">
      <h4 className="text-sm font-bold text-gray-800 mb-3">Branch Condition</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Data Field</label>
          <input 
            type="text" 
            placeholder="e.g., deal.amount" 
            className="w-full text-sm border-gray-300 rounded"
            value={config.field || ''}
            onChange={(e) => handleChange('field', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Operator</label>
          <select 
            className="w-full text-sm border-gray-300 rounded"
            value={config.operator || 'equals'}
            onChange={(e) => handleChange('operator', e.target.value)}
          >
            <option value="equals">Equals</option>
            <option value="not_equals">Does Not Equal</option>
            <option value="greater_than">Greater Than</option>
            <option value="less_than">Less Than</option>
            <option value="contains">Contains</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Compare Value</label>
          <input 
            type="text" 
            placeholder="Value" 
            className="w-full text-sm border-gray-300 rounded"
            value={config.value || ''}
            onChange={(e) => handleChange('value', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};