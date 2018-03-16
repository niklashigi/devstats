export interface Report {
  theme(str: string): string;
  statistic: string;
  value: string | number;
  errored?: boolean;
}
