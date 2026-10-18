import React, { useState } from 'react';
import { Modal } from '@workspace/ui-kit/modal';
import { Button } from '@workspace/ui-kit/button';
import { apiClient } from '@workspace/api-client';

interface KeyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const KeyCreateModal: React.FC<KeyCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [scopes, setScopes] = useState<string[]>(['read:crm']);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    const res = await apiClient.post('/api/developers/keys', { name, scopes });
    setNewKey(res.data.rawKey);
    onSuccess();
  };

  const handleClose = () => {
    setNewKey(null);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create API Key">
      {newKey ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800 font-bold mb-2">Key generated successfully!</p>
          <p className="text-xs text-gray-600 mb-2">Copy this key now. You will not be able to see it again.</p>
          <code className="block p-3 bg-white border rounded font-mono text-sm break-all">{newKey}</code>
          <Button variant="solid" className="mt-4 w-full" onClick={handleClose}>Done</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
            <input 
              type="text" 
              className="w-full border-gray-300 rounded" 
              placeholder="e.g., Zapier Integration"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Scoping modal allowing users to restrict keys to read-only access or specific modules[cite: 3]. */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions (Scopes)</label>
            <select 
              multiple 
              className="w-full border-gray-300 rounded h-32"
              value={scopes}
              onChange={(e) => setScopes(Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="read:crm">CRM (Read Only)</option>
              <option value="write:crm">CRM (Read & Write)</option>
              <option value="read:inventory">Inventory (Read Only)</option>
              <option value="write:inventory">Inventory (Read & Write)</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button variant="solid" onClick={handleGenerate} disabled={!name}>Generate Key</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};