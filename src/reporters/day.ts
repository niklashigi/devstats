import chalk from 'chalk'
import * as moment from 'moment'

import { Account } from '../accounts/account'
import { Report } from '../report'
import { getDayIndex, parseDayIndex } from '../time'
import { Reporter } from './reporter'

export default class DayReporter implements Reporter {

  public previousLabel = 'Previous day'
  public nextLabel = 'Next day'

  public todayIndex = getDayIndex(moment())

  public report(
    index: number, accounts: Account[],
    cb: (account: Account, report: Report) => void,
  ) {
    const dayIndex = this.todayIndex + index

    for (const account of accounts) {
      account.getReport(this.todayIndex + index).then(report => cb(account, report))
    }

    const dayString = parseDayIndex(dayIndex).format('MMMM Do, YYYY')
    return chalk`Daily report for {bold ${dayString}}`
  }

}
