export type Provider = 'SLACK' | 'GMAIL' | 'OUTLOOK' | 'CALENDAR';
export type IntegrationStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface Integration {
  id: string;
  provider: Provider;
  status: IntegrationStatus;
  lastSyncedAt: string;
}
