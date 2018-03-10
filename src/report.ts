export interface Report {
  theme(str: string): string;
  title: string;
  statistic: string;
  value: string | number;
  errored?: boolean;
}
