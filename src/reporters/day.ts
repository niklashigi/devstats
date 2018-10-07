import * as moment from 'moment';
import chalk from 'chalk';

import {Reporter} from './reporter';
import {Report} from '../report';
import {Account} from '../accounts/account';
import {getDayIndex, parseDayIndex} from '../time';

export default class DayReporter implements Reporter {
  previousLabel = 'Previous day';
  nextLabel = 'Next day';

  todayIndex = getDayIndex(moment());

  report(
    index: number, accounts: Account[],
    cb: (account: Account, report: Report) => void
  ) {
    const dayIndex = this.todayIndex + index;

    for (const account of accounts) {
      account.getReport(this.todayIndex + index).then(report => cb(account, report));
    }

    const dayString = parseDayIndex(dayIndex).format('MMMM Do, YYYY');
    return chalk`Daily report for {bold ${dayString}}`;
  }
}
