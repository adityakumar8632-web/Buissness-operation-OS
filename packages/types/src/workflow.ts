export type NodeType = 'Trigger' | 'Condition' | 'Action';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionId?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ExecutionPayload {
  executionId: string;
  workflowId: string;
  triggerEvent: string;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}