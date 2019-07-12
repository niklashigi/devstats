import chalk from 'chalk'
import * as M from 'moment'
import fetch from 'node-fetch'

import { parseAccountUrl } from '../libs/urls'
import { getDayIndex } from '../time'
import { Account } from './account'

const BASE_URL = 'https://codestats.net/api/users/'

export class CodeStatsAccount implements Account {

  public static title = 'Code::Stats'
  public static aliases = ['codestats', 'cs']
  public static statistic = 'XP gained'
  public static theme = chalk.hex('#3e4053')

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://codestats.net/users/${this.username}`
  }

  public static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/codestats.net\/users\/([^/\s]+)/i)
  }

  public dates: Map<number, number> = new Map()

  public async getReport(day: number) {
    if (!this.dates.size) {
      await this.fetchDates()
    }

    return this.dates.has(day) ? this.dates.get(day) as number : 0
  }

  public async fetchDates() {
    try {
      const userDates = (await (await fetch(`${BASE_URL}${this.username}`)).json()).dates

      for (const date in userDates) {
        this.dates.set(getDayIndex(M(date)), userDates[date])
      }
    } catch {
      return null
    }
  }
}
