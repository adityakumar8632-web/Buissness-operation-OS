import React from 'react';
import { UINodeRegistry } from '../nodes/node.registry';

export const NodePalette: React.FC = () => {
  const items = UINodeRegistry.getToolboxItems();

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/workflow-node', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="node-palette w-64 bg-gray-50 border-r border-gray-200 h-full p-4 flex flex-col">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Toolbox</h3>
      {/* Sidebar toolbox listing draggable automation blocks onto the canvas[cite: 3]. */}
      <div className="space-y-3 flex-grow overflow-y-auto">
        {items.map(item => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            className={`cursor-grab p-3 rounded border shadow-sm ${item.color} hover:opacity-90 transition-opacity`}
          >
            <div className="text-xs text-gray-500 mb-1">{item.category}</div>
            <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};