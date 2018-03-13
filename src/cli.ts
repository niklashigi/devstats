import * as moment from 'moment';
import chalk from 'chalk';

import {getDayIndex, parseDayIndex} from './time';
import {Account} from './accounts/account';
import {Report} from './report';

import {GitHubAccount} from './accounts/github';
import {StackOverflowAccount} from './accounts/stackoverflow';
import {WakaTimeAccount} from './accounts/wakatime';

import args from './args';
import * as T from './libs/terminal';

let dayIndex = getDayIndex(moment());
let dayMoment = parseDayIndex(dayIndex);
let dayString = dayMoment.format('MMMM Do, YYYY');

const reports: Map<Account, Report> = new Map();

const {stdin} = process;
if (args.interactive) {
  T.interactify();
}

if (args.interactive) {
  stdin.on('data', (key: string) => {
    if (['\u0003', 'x', 'q'].includes(key.toLowerCase())) {
      process.exit();
    } else if (key.startsWith('\u001b\u005b') && key.length === 3) {
      if (key[2] === '\u0044') {
        // Left arrow key
        dayIndex--;
        printDailyReport();
      } else if (key[2] === '\u0043') {
        // Right arrow key
        dayIndex++;
        printDailyReport();
      }
    }
  });
}

const accounts: Account[] = [
  new StackOverflowAccount(2901002),
  new WakaTimeAccount('shroudedcode'),
  new GitHubAccount('sindresorhus')
];

T.render('\n'.repeat(7));

function printDailyReport() {
  dayMoment = parseDayIndex(dayIndex);
  dayString = dayMoment.format('MMMM Do, YYYY');

  reports.clear();
  render();

  for (const account of accounts) {
    account.getReport(dayIndex).then(report => {
      reports.set(account, report);
      render();
    });
  }
}

function render() {
  let output = '';
  output += chalk`\n{blue   Daily report for {bold ${dayString}}}\n`;
  output += '\n';
  for (const account of accounts) {
    if (reports.has(account)) {
      const report = reports.get(account) as Report;
      output += chalk`  {inverse ${report.theme(' ')}} ${report.theme(account.title.padEnd(15))}{bold ${report.value + ''}} ${report.statistic}\n`;
    } else {
      output += chalk`  {gray.inverse  } {gray.dim ${account.title.padEnd(15)}}{dim Loading ...}\n`;
    }
  }
  output += '\n';
  T.render(output);
}

printDailyReport();
