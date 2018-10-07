import * as moment from 'moment';
import chalk from 'chalk';

import {Reporter} from './reporter';
import {Report} from '../report';
import {Account} from '../accounts/account';
import {getDayIndex, parseDayIndex} from '../time';
import sumReports from '../libs/sum-reports';

export default class DaysReporter implements Reporter {
  previousLabel = 'Previous day';
  nextLabel = 'Next day';

  todayIndex = getDayIndex(moment());

  constructor(private days: number) {}

  report(
    index: number, accounts: Account[],
    cb: (account: Account, report: Report) => void
  ) {
    const dayIndex = this.todayIndex + index;

    const dayIndeces = [];
    for (let i = this.days - 1; i >= 0; i--) {
      dayIndeces.push(dayIndex - i);
    }

    for (const account of accounts) {
      Promise.all(dayIndeces.map(i => account.getReport(i)))
        .then(sumReports).then(report => cb(account, report));
    }

    const format = (i: number) => parseDayIndex(i).format('MMM D, YY');
    const firstDayString = format(dayIndex - this.days + 1);
    const lastDayString = format(dayIndex);
    return chalk`${this.days + ''}-day report for {bold ${firstDayString}} to {bold ${lastDayString}}`;
  }
}
