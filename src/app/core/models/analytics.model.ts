import { Provider } from './integration.model';

export interface TeamLoadBucket {
  source: Provider;
  hourBucket: number;         // 0–23
  count: number;
}

export interface TeamLoad {
  data: TeamLoadBucket[];
  fromDate: string;
  toDate: string;
}

export interface Recommendation {
  id: string;
  text: string;
  patternDescription: string;
}
