import chalk = require('chalk')
import * as moment from 'moment'

import * as Terminal from '../libs/terminal'
import showUpdateNotification from '../libs/update-notifier'

import { Account } from '../accounts/account'
import { getAccountType, resolveAccountUrl } from '../libs/accounts'
import getConfig from '../libs/config'
import { Report } from '../report'

import DayReporter from '../reporters/day'
import DaysReporter from '../reporters/days'
import WeekReporter from '../reporters/week'

export default function show(
  {interactive, days, week}: {
    interactive: boolean,
    days?: number,
    week: boolean,
  }) {
  const accounts = getConfig().get('accounts').map(resolveAccountUrl)

  if (accounts.length === 0) {
    console.log(chalk`
  {blue {bold You don't have any accounts at the moment!}

  Add some like this:}

  {dim $} {bold devstats} add github shroudedcode

  {blue Or like this:}

  {dim $} {bold devstats} add https://github.com/shroudedcode

  {blue For a list of all commands and examples, run:}

  {dim $} {bold devstats} --help
`)
    return
  }

  let index = 0
  let reportTitle: string

  const reporter = week ?
    new WeekReporter()
    : (days && days !== 1) ?
      new DaysReporter(days)
      : new DayReporter()

  const reports: Map<Account, Report> = new Map()

  const {stdin} = process
  if (interactive) {
    Terminal.interactify()

    stdin.on('data', (key: string) => {
      if (['\u0003', 'x', 'q'].includes(key.toLowerCase())) {
        showUpdateNotification()
        process.exit()
      } else if (key.startsWith('\u001b[') && key.length === 3) {
        if (key[2] === 'D') {
          // Left arrow key
          index--
          printDailyReport()
        } else if (key[2] === 'C' && index < 0) {
          // Right arrow key
          index++
          printDailyReport()
        }
      }
    })
  }

  function printDailyReport() {
    reports.clear()

    const currentIndex = index

    reportTitle = reporter.report(index, accounts, (account, report) => {
      if (currentIndex === index) reports.set(account, report)
      render()
    })

    render()
  }

  function formatDuration(duration: moment.Duration) {
    return duration.asSeconds() > 0 ? duration.humanize() : 'no time'
  }

  function parseReport(report: Report): string | undefined {
    // tslint:disable-next-line:triple-equals
    if (report == null) return
    if (moment.isDuration(report)) return formatDuration(report)
    return String(report)
  }

  function renderReport(account: Account, report: Report) {
    const accountType = getAccountType(account)
    const parsedReport = parseReport(report)

    return parsedReport ?
      chalk`{bold ${parsedReport}} ${accountType.statistic}`
      : chalk.red('An error occurred.')
  }

  function render() {
    let output = ''

    output += chalk`\n{blue   ${reportTitle}}\n`
    output += '\n'

    for (const account of accounts) {
      const {title, theme} = getAccountType(account)
      if (reports.has(account)) {
        const report = reports.get(account) as Report

        output += chalk`  {inverse ${theme(' ')}}`
        output += chalk`${chalk.reset(' ')}`
        output += chalk`${theme(title.padEnd(15))}`
        output += chalk`${renderReport(account, report)}\n`
      } else {
        output += chalk`  {gray.inverse  } {gray.dim ${title.padEnd(15)}}{dim Loading ...}\n`
      }
    }

    if (interactive) {
      output += '\n'

      const buttons = [
        chalk`{blue {dim [}{bold ←} ${reporter.previousLabel}{dim ]}}`,
        (index < 0 ? chalk.blue : chalk.gray)(chalk`{dim [}{bold →} ${reporter.nextLabel}{dim ]}`),
        chalk`{blue {dim [}{bold Q} Quit{dim ]}}`,
      ]
      output += buttons.join(' ')

      output += '\n'
    }

    output += '\n'
    Terminal.render(output)
  }

  printDailyReport()
}
