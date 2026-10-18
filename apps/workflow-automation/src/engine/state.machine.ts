import { db } from '@workspace/database';
import type { WorkflowExecutionState } from '@workspace/types/workflow';

export class StateMachine {
  /**
   * Controls workflow progression states and persists execution history for idempotency[cite: 3].
   */
  static async transitionExecution(executionId: string, newState: WorkflowExecutionState, errorMsg?: string) {
    return db.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: newState,
        errorMessage: errorMsg || null,
        completedAt: newState === 'COMPLETED' || newState === 'FAILED' ? new Date() : undefined,
      }
    });
  }

  static async transitionNode(nodeExecutionId: string, newState: WorkflowExecutionState, outputPayload?: any, errorMsg?: string) {
    return db.workflowNodeExecution.update({
      where: { id: nodeExecutionId },
      data: {
        status: newState,
        outputData: outputPayload || null,
        errorMessage: errorMsg || null,
        completedAt: newState === 'COMPLETED' || newState === 'FAILED' ? new Date() : undefined,
      }
    });
  }
}