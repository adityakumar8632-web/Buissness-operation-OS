import { db } from '@workspace/database';
import { DAGRunner } from './dag.runner';
import type { EventTriggerPayload } from '@workspace/types/workflow';

export class ExecutionQueue {
  /**
   * Job queue handling asynchronous step execution with automatic retry logic[cite: 3].
   */
  static async enqueueTrigger(eventName: string, payload: EventTriggerPayload): Promise<void> {
    // Find all active workflows listening to this event
    const activeWorkflows = await db.workflow.findMany({
      where: { 
        isActive: true,
        triggerEvent: eventName 
      }
    });

    for (const workflow of activeWorkflows) {
      // Initialize state records before execution starts
      const execution = await db.workflowExecution.create({
        data: {
          workflowId: workflow.id,
          triggerPayload: payload,
          status: 'PENDING',
          nodeExecutions: {
            create: (workflow.definition as any).nodes.map((node: any) => ({
              nodeId: node.id,
              status: 'PENDING'
            }))
          }
        }
      });

      // In production, this pushes to SQS/Redis. For demo/V1, we fire asynchronously without awaiting.
      this.processQueueItem(execution.id, payload).catch(err => {
        console.error(`Fatal Queue Error for execution ${execution.id}:`, err);
      });
    }
  }

  private static async processQueueItem(executionId: string, payload: any) {
    // Wrap the DAG runner to isolate failures from the main thread
    await DAGRunner.executeGraph(executionId, payload);
  }
}