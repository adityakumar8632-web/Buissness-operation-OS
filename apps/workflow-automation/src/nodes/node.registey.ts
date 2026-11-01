import { ActionRegistry } from '../actions/registry';

export const UINodeRegistry = {
  /**
   * Catalog exposing all available node types, schemas, and UI components to the builder[cite: 3].
   */
  getToolboxItems: () => [
    { type: 'TRIGGER', label: 'System Event Trigger', category: 'Inputs', color: 'bg-green-100 border-green-400' },
    { type: 'CONDITION', label: 'If / Else Branch', category: 'Logic', color: 'bg-yellow-100 border-yellow-400' },
    ...ActionRegistry.getAvailableNodes().map(type => ({
      type,
      label: type.replace(/_/g, ' '),
      category: 'Actions',
      color: 'bg-blue-100 border-blue-400'
    }))
  ]
};