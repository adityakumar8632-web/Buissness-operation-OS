import React, { useState } from 'react';
import { NodePalette } from './NodePalette';
import { Button } from '@workspace/ui-kit/button';

export const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<{ id: string, type: string, x: number, y: number }[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/workflow-node');
    if (!nodeType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => [...prev, {
      id: `node_${Date.now()}`,
      type: nodeType,
      x,
      y
    }]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div className="workflow-builder flex h-screen bg-white">
      <NodePalette />
      
      {/* Interactive graph canvas where users visually connect, arrange, and debug automation steps[cite: 3]. */}
      <div 
        className="canvas flex-grow relative bg-gray-100 overflow-hidden custom-grid-pattern"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline">Test Runner</Button>
          <Button variant="solid">Save Workflow</Button>
        </div>

        {nodes.map(node => (
          <div 
            key={node.id}
            className="absolute p-4 bg-white border border-gray-300 rounded shadow-md min-w-[200px]"
            style={{ left: node.x, top: node.y }}
          >
            <div className="text-xs text-gray-400 mb-2 font-mono">{node.id}</div>
            <div className="font-bold text-gray-800">{node.type.replace(/_/g, ' ')}</div>
            <div className="mt-4 pt-2 border-t border-gray-100">
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};