import * as moment from 'moment';
import chalk from 'chalk';
import * as readline from 'readline';

import {getDayIndex, parseDayIndex} from './time';
import {Account} from './accounts/account';

import {GitHubAccount} from './accounts/github';
import {StackOverflowAccount} from './accounts/stackoverflow';
import {WakaTimeAccount} from './accounts/wakatime';

import args from './args';
import * as T from './libs/terminal';

let dayIndex = getDayIndex(moment());

const {stdin, stdout} = process;
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

stdout.write('\n'.repeat(7));

function printDailyReport() {
  const dayMoment = parseDayIndex(dayIndex);
  const dayString = dayMoment.format('MMMM Do, YYYY');

  readline.moveCursor(stdout, 0, -7);
  readline.clearScreenDown(stdout);
  stdout.write(chalk`
  Fetching statistics for {bold ${dayString}} ...

  {inverse  } {gray.inverse              }  {gray ...}
  {inverse  } {gray.inverse         }       {gray ...}
  {inverse  } {gray.inverse       }         {gray ...}

`);

  Promise.all(accounts.map(account => account.getReport(dayIndex))).then(reports => {
    readline.moveCursor(stdout, 0, -7);
    readline.clearScreenDown(stdout);
    stdout.write(chalk`\n{blue   Daily report for {bold ${dayString}}}\n`);
    stdout.write('\n');
    for (const report of reports) {
      stdout.write(chalk`  {inverse ${report.theme(' ')}} ${report.theme(report.title.padEnd(15))}{bold ${report.value + ''}} ${report.statistic}\n`);
    }
    stdout.write('\n');
  });
}

printDailyReport();
