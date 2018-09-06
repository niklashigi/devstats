import * as moment from 'moment';
import chalk from 'chalk';

import * as Terminal from '../libs/terminal';
import showUpdateNotification from '../libs/update-notifier';
import {getDayIndex, parseDayIndex} from '../time';

import getConfig from '../libs/config';
import {Account} from '../accounts/account';
import {Report} from '../report';
import {resolveAccountUrl, getAccountType} from '../libs/accounts';

export default function show({interactive}: {interactive: boolean}) {
  const accounts = getConfig().get('accounts').map(resolveAccountUrl);

  if (accounts.length === 0) {
    console.log(chalk`
  {blue {bold You don't have any accounts at the moment!}

  Add some like this:}

  {dim $} {bold devstats} add github shroudedcode

  {blue Or like this:}

  {dim $} {bold devstats} add https://github.com/shroudedcode

  {blue For a list of all commands and examples, run:}

  {dim $} {bold devstats} --help
`);
    return;
  }

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
        showUpdateNotification();
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
    const currentDayIndex = dayIndex;

    reports.clear();
    render();

    for (const account of accounts) {
      account.getReport(currentDayIndex).then(report => {
        if (currentDayIndex !== dayIndex) return;

        reports.set(account, report);
        render();
      });
    }
  }

  function formatDuration(duration: moment.Duration) {
    return duration.asSeconds ? duration.humanize() : 'no time';
  }

  function parseReport(report: Report): string | undefined {
    // tslint:disable-next-line:triple-equals
    if (report == null) return;
    if (moment.isDuration(report)) return formatDuration(report);
    return String(report);
  }

  function renderReport(account: Account, report: Report) {
    const accountType = getAccountType(account);
    const parsedReport = parseReport(report);

    return parsedReport ?
      chalk`{bold ${parsedReport}} ${accountType.statistic}`
      : chalk.red('An error occurred.');
  }

  function render() {
    let output = '';
    output += chalk`\n{blue   Daily report for {bold ${dayString}}}\n`;
    output += '\n';
    for (const account of accounts) {
      const {title, theme} = getAccountType(account);
      if (reports.has(account)) {
        const report = reports.get(account) as Report;
        output += chalk`  {inverse ${theme(' ')}}${chalk.reset(' ')}${theme(title.padEnd(15))}${renderReport(account, report)}\n`;
      } else {
        output += chalk`  {gray.inverse  } {gray.dim ${title.padEnd(15)}}{dim Loading ...}\n`;
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
