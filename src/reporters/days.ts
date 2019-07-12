import chalk from 'chalk'
import * as moment from 'moment'

import { Account } from '../accounts/account'
import sumReports from '../libs/sum-reports'
import { Report } from '../report'
import { getDayIndex, parseDayIndex } from '../time'
import { Reporter } from './reporter'

export default class DaysReporter implements Reporter {

  public previousLabel = 'Previous day'
  public nextLabel = 'Next day'

  public todayIndex = getDayIndex(moment())

  constructor(private days: number) {}

  public report(
    index: number, accounts: Account[],
    cb: (account: Account, report: Report) => void,
  ) {
    const dayIndex = this.todayIndex + index

    const dayIndeces = []
    for (let i = this.days - 1; i >= 0; i--) {
      dayIndeces.push(dayIndex - i)
    }

    for (const account of accounts) {
      Promise.all(dayIndeces.map(i => account.getReport(i)))
        .then(sumReports).then(report => cb(account, report))
    }

    const format = (i: number) => parseDayIndex(i).format('MMM D, YY')
    const firstDayString = format(dayIndex - this.days + 1)
    const lastDayString = format(dayIndex)
    return chalk`${this.days + ''}-day report for {bold ${firstDayString}} to {bold ${lastDayString}}`
  }

}
