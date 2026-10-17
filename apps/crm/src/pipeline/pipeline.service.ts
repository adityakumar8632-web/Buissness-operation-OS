import { z } from 'zod';

export const DealStageEnum = z.enum([
  'LEAD',
  'QUALIFIED',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST'
]);

export const DealSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Deal title is required"),
  accountId: z.string().uuid(),
  value: z.number().min(0),
  currency: z.string().default('USD'),
  stage: DealStageEnum.default('LEAD'),
  probability: z.number().min(0).max(100),
  assignedRep: z.string(),
  expectedCloseDate: z.string().optional(),
});

export type Deal = z.infer<typeof DealSchema>;
export type DealStage = z.infer<typeof DealStageEnum>;

export class PipelineService {
  static async getDeals(): Promise<Deal[]> {
    // Simulated API fetch returning deals across the pipeline
    return [
      { id: 'd1', title: 'Enterprise License', accountId: 'a1', value: 50000, stage: 'PROPOSAL', probability: 60, assignedRep: 'Sarah' },
      { id: 'd2', title: 'Cloud Migration', accountId: 'a2', value: 120000, stage: 'NEGOTIATION', probability: 80, assignedRep: 'Mike' },
      { id: 'd3', title: 'Support SLA', accountId: 'a1', value: 15000, stage: 'QUALIFIED', probability: 30, assignedRep: 'Sarah' }
    ];
  }

  static async updateDealStage(dealId: string, newStage: DealStage): Promise<void> {
    // Simulated PATCH request moving the deal
    console.log(`Moved deal ${dealId} to stage: ${newStage}`);
    
    // In Phase 9, this will emit events like DealWon or DealLost
    if (newStage === 'WON') {
      console.log(`[Event Emitted]: DealWon -> Triggering invoice creation workflow...`);
    }
  }

  static calculateForecast(deals: Deal[]): number {
    // Forecast calculation based on value * probability[cite: 3]
    return deals.reduce((total, deal) => {
      if (deal.stage === 'WON') return total + deal.value;
      if (deal.stage === 'LOST') return total;
      return total + (deal.value * (deal.probability / 100));
    }, 0);
  }
}