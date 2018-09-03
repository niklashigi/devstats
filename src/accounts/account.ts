import {Report} from '../report';

export interface Account {
  title: string;
  statistic: string;
  theme(str: string): string;
  getReport(day: number): Promise<Report>;
  canonicalUrl: string;
}
