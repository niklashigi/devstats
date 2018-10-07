import * as moment from 'moment';
import chalk from 'chalk';

import {Reporter} from './reporter';
import {Report} from '../report';
import {Account} from '../accounts/account';
import {getDayIndex, parseDayIndex} from '../time';
import sumReports from '../libs/sum-reports';

export default class WeekReporter implements Reporter {
  previousLabel = 'Previous day';
  nextLabel = 'Next day';

  todayIndex = getDayIndex(moment());

  report(
    index: number, accounts: Account[],
    cb: (account: Account, report: Report) => void
  ) {
    const dayIndex = this.todayIndex;
    const firstDayIndex = getDayIndex(parseDayIndex(dayIndex).isoWeekday(1)) + (index * 7);
    const lastDayIndex = Math.min(dayIndex, firstDayIndex + 6);

    const dayIndeces = [];
    for (let i = firstDayIndex; i < lastDayIndex; i++) {
      dayIndeces.push(i);
    }

    for (const account of accounts) {
      Promise.all(dayIndeces.map(i => account.getReport(i)))
        .then(sumReports).then(report => cb(account, report));
    }

    const format = (i: number) => parseDayIndex(i).format('MMM D, YY');
    const firstDayString = format(firstDayIndex);
    const lastDayString = format(lastDayIndex);
    return chalk`Weekly report for {bold ${firstDayString}} to {bold ${lastDayString}}`;
  }
}
