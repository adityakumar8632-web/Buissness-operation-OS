import React from 'react';

interface ActionNodeProps {
  nodeId: string;
  actionType: string;
  config: Record<string, any>;
  onUpdate: (nodeId: string, config: any) => void;
}

export const ActionNode: React.FC<ActionNodeProps> = ({ nodeId, actionType, config, onUpdate }) => {
  // Execution node component configuring output operations (e.g., send email, trigger webhook)[cite: 3].
  
  const handleConfigChange = (key: string, value: string) => {
    onUpdate(nodeId, { ...config, [key]: value });
  };

  const renderActionSpecificFields = () => {
    switch (actionType) {
      case 'SEND_EMAIL':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Recipient (To)</label>
              <input 
                type="text" 
                placeholder="{{customer.email}}" 
                className="w-full text-sm border-gray-300 rounded"
                value={config.to || ''}
                onChange={(e) => handleConfigChange('to', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Template ID</label>
              <input 
                type="text" 
                placeholder="tmpl_12345" 
                className="w-full text-sm border-gray-300 rounded"
                value={config.templateId || ''}
                onChange={(e) => handleConfigChange('templateId', e.target.value)}
              />
            </div>
          </>
        );
      case 'HTTP_WEBHOOK':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target URL</label>
              <input 
                type="url" 
                placeholder="https://api.external.com/webhook" 
                className="w-full text-sm border-gray-300 rounded"
                value={config.url || ''}
                onChange={(e) => handleConfigChange('url', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">HTTP Method</label>
              <select 
                className="w-full text-sm border-gray-300 rounded"
                value={config.method || 'POST'}
                onChange={(e) => handleConfigChange('method', e.target.value)}
              >
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="GET">GET</option>
              </select>
            </div>
          </>
        );
      case 'IN_APP_NOTIFICATION':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target User ID</label>
              <input 
                type="text" 
                placeholder="{{deal.ownerId}}" 
                className="w-full text-sm border-gray-300 rounded"
                value={config.targetUserId || ''}
                onChange={(e) => handleConfigChange('targetUserId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Message Body</label>
              <textarea 
                rows={3}
                placeholder="Alert: Action required on {{deal.name}}" 
                className="w-full text-sm border-gray-300 rounded"
                value={config.message || ''}
                onChange={(e) => handleConfigChange('message', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return <p className="text-xs text-gray-500">No configuration required.</p>;
    }
  };

  return (
    <div className="action-node-config p-4 bg-white border border-blue-200 rounded-md shadow-sm">
      <h4 className="text-sm font-bold text-gray-800 mb-3 capitalize">
        Configure {actionType.replace(/_/g, ' ').toLowerCase()}
      </h4>
      <div className="space-y-3">
        {renderActionSpecificFields()}
      </div>
    </div>
  );
};