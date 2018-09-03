import * as moment from 'moment';
import chalk from 'chalk';

import {getDayIndex, parseDayIndex} from '../time';
import {Account} from '../accounts/account';
import {Report} from '../report';

import accounts from '../libs/accounts';

import * as Terminal from '../libs/terminal';

export default function show({interactive}: {interactive: boolean}) {
  const todayIndex = getDayIndex(moment());

  let dayIndex = todayIndex;
  let dayMoment = parseDayIndex(dayIndex);
  let dayString = dayMoment.format('MMMM Do, YYYY');

  const reports: Map<Account, Report> = new Map();

  const {stdin} = process;
  if (interactive) {
    Terminal.interactify();

    stdin.on('data', (key: string) => {
      if (['\u0003', 'x', 'q'].includes(key.toLowerCase())) {
        process.exit();
      } else if (key.startsWith('\u001b[') && key.length === 3) {
        if (key[2] === 'D') {
          // Left arrow key
          dayIndex--;
          printDailyReport();
        } else if (key[2] === 'C' && dayIndex < todayIndex) {
          // Right arrow key
          dayIndex++;
          printDailyReport();
        }
      }
    });
  }

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

  const renderReport = ({statistic}: Account, report: Report) =>
    report !== undefined && report !== null ?
    chalk`{bold ${report + ''}} ${statistic}` : chalk.red('An error occurred.');

  function render() {
    let output = '';
    output += chalk`\n{blue   Daily report for {bold ${dayString}}}\n`;
    output += '\n';
    for (const account of accounts) {
      if (reports.has(account)) {
        const report = reports.get(account) as Report;
        output += chalk`  {inverse ${account.theme(' ')}} ${account.theme(account.title.padEnd(15))}${renderReport(account, report)}\n`;
      } else {
        output += chalk`  {gray.inverse  } {gray.dim ${account.title.padEnd(15)}}{dim Loading ...}\n`;
      }
    }
    if (interactive) {
      output += chalk`
  {blue {dim [}{bold ←} Previous day{dim ]} ${(dayIndex < todayIndex ? chalk.blue : chalk.gray)(chalk`{dim [}{bold →} Next day{dim ]}`)} {dim [}{bold Q} Quit{dim ]}}
      `;
    }
    output += '\n';
    Terminal.render(output);
  }

  printDailyReport();
}
