import * as moment from 'moment';
import chalk from 'chalk';
import * as ora from 'ora';

import {getDayIndex, parseDayIndex} from './time';
import {Account} from './accounts/account';

import {GitHubAccount} from './accounts/github';
import {StackOverflowAccount} from './accounts/stackoverflow';
import {WakaTimeAccount} from './accounts/wakatime';

const accounts: Account[] = [
  new StackOverflowAccount(2901002),
  new WakaTimeAccount('shroudedcode'),
  new GitHubAccount('sindresorhus')
];

const time = process.argv.slice(2).join(' ');
let dayIndex = getDayIndex(moment());
if (time === 'yesterday') {
  dayIndex--;
}
const dayMoment = parseDayIndex(dayIndex);
const dayString = dayMoment.format('MMMM Do, YYYY');

const spinner = ora(`Fetching stats for ${dayString} ...`).start();

Promise.all(accounts.map(account => account.getReport(dayIndex))).then(reports => {
  spinner.stop();

  console.log(chalk`\n{blue   Daily report for {bold ${dayString}}}`);
  console.log('');
  for (const report of reports) {
    console.log(chalk`  {inverse ${report.theme(' ')}} ${report.theme(report.title.padEnd(15))}{bold ${report.value + ''}} ${report.statistic}`);
  }
  console.log('');
});
