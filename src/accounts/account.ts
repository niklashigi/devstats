import { Report } from '../report'

export interface Account {
  canonicalUrl: string
  getReport(day: number): Promise<Report>
}
