import { Account } from '../accounts/account'
import { Report } from '../report'

export interface Reporter {
  previousLabel: string
  nextLabel: string
  report(index: number, accounts: Account[], cb: (account: Account, report: Report) => void): string
}
