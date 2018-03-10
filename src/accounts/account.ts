import {Report} from '../report';

export interface Account {
  getReport(day: number): Promise<Report>;
}
