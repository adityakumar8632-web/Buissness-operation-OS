import { BaseEntity } from './common';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type DealStage = 'Prospecting' | 'Proposal' | 'Negotiation' | 'ClosedWon' | 'ClosedLost';

export interface Contact extends BaseEntity {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
}

export interface Account extends BaseEntity {
  name: string;
  website?: string;
  industry?: string;
  ownerId: string;
}

export interface Deal extends BaseEntity {
  accountId: string;
  name: string;
  amount: number;
  stage: DealStage;
  closeDate: string;
  ownerId: string;
}

export interface Lead extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  status: LeadStatus;
}