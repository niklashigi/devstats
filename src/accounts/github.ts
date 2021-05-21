import chalk = require('chalk')
import { JSDOM } from 'jsdom'
import * as Moment from 'moment'
import fetch from 'node-fetch'

import { parseAccountUrl } from '../libs/urls'
import { getDayIndex } from '../time'
import { Account } from './account'

const BASE_URL = 'https://github.com'

export class GitHubAccount implements Account {

  public static title = 'GitHub'
  public static aliases = ['github', 'gh']
  public static statistic = 'contributions made'
  public static theme = chalk.hex('#34d058')

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://github.com/${this.username}`
  }

  public static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/github.com\/([^/\s]+)/i)
  }

  public contributions: Map<number, number> = new Map()

  public async getReport(day: number) {
    if (!this.contributions.has(day)) {
      try {
        const html = await (await fetch(`${BASE_URL}/${this.username}`)).text()
        const document = new JSDOM(html).window.document

        for (const dayElement of Array.from(document.querySelectorAll('.ContributionCalendar-day[data-date]'))) {
          this.contributions.set(
            getDayIndex(Moment(dayElement.getAttribute('data-date')!)),
            parseInt(dayElement.getAttribute('data-count')!, 10),
          )
        }
      } catch {
        return null
      }
    }

    return this.contributions.get(day) as number
  }

}
