import { StateMachine } from './state.machine';
import { ActionRegistry } from '../actions/registry';
import { db } from '@workspace/database';
import type { WorkflowNode, WorkflowEdge } from '@workspace/types/workflow';

export class DAGRunner {
  /**
   * Performs a topological sort to guarantee dependency order execution[cite: 3].
   */
  static sortNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
    const adjacencyList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(n => {
      adjacencyList.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    edges.forEach(e => {
      adjacencyList.get(e.sourceId)?.push(e.targetId);
      inDegree.set(e.targetId, (inDegree.get(e.targetId) || 0) + 1);
    });

    const queue: string[] = [];
    nodes.forEach(n => {
      if (inDegree.get(n.id) === 0) queue.push(n.id);
    });

    const sorted: WorkflowNode[] = [];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = nodes.find(n => n.id === currentId);
      if (node) sorted.push(node);

      adjacencyList.get(currentId)?.forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) queue.push(neighbor);
      });
    }

    if (sorted.length !== nodes.length) {
      throw new Error('Cycle detected in workflow DAG. Cannot execute.');
    }
    return sorted;
  }

  /**
   * Executes the sorted graph nodes sequentially, passing context payloads[cite: 3].
   */
  static async executeGraph(executionId: string, initialPayload: any) {
    await StateMachine.transitionExecution(executionId, 'RUNNING');

    try {
      const executionRecord = await db.workflowExecution.findUniqueOrThrow({
        where: { id: executionId },
        include: { workflow: true, nodeExecutions: true }
      });

      const { nodes, edges } = executionRecord.workflow.definition as any;
      const sortedNodes = this.sortNodes(nodes, edges);

      // Context accumulates outputs from previous nodes
      const executionContext = { ...initialPayload };

      for (const node of sortedNodes) {
        const nodeExec = executionRecord.nodeExecutions.find(ne => ne.nodeId === node.id);
        
        // Idempotency check: Skip if already completed (useful for retries)
        if (nodeExec?.status === 'COMPLETED') {
          Object.assign(executionContext, nodeExec.outputData);
          continue;
        }

        await StateMachine.transitionNode(nodeExec!.id, 'RUNNING');

        const actionHandler = ActionRegistry.getHandler(node.type);
        if (!actionHandler) {
          throw new Error(`Unregistered action type: ${node.type}`);
        }

        const result = await actionHandler.execute(node.config, executionContext);

        if (result.success) {
          await StateMachine.transitionNode(nodeExec!.id, 'COMPLETED', result.output);
          Object.assign(executionContext, { [node.id]: result.output });
        } else {
          await StateMachine.transitionNode(nodeExec!.id, 'FAILED', null, result.error);
          throw new Error(`Node ${node.id} failed: ${result.error}`);
        }
      }

      await StateMachine.transitionExecution(executionId, 'COMPLETED');
    } catch (error: any) {
      await StateMachine.transitionExecution(executionId, 'FAILED', error.message);
    }
  }
}