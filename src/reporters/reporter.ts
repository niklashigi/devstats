import {Report} from '../report';
import {Account} from '../accounts/account';

export interface Reporter {
  previousLabel: string;
  nextLabel: string;
  report(index: number, accounts: Account[], cb: (account: Account, report: Report) => void): string;
}
