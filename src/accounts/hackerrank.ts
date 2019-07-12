import chalk from 'chalk'
import * as M from 'moment'
import fetch from 'node-fetch'

import { parseAccountUrl } from '../libs/urls'
import { getDayIndex } from '../time'
import { Account } from './account'

const BASE_URL = 'https://hackerrank.com'

export class HackerRankAccount implements Account {

  public static title = 'HackerRank'
  public static aliases = ['hackerrank', 'hr']
  public static statistic = 'submissions made'
  public static theme = chalk.hex('#23b355')

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://hackerrank.com/${this.username}`
  }

  public static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/(?:www\.)?hackerrank\.com\/(?:profile\/)?([^/\s?]+)/i)
  }

  public submissions: Map<number, number> = new Map()

  public async getReport(day: number) {
    if (!this.submissions.has(day)) {
      try {
        const url = `${BASE_URL}/rest/hackers/${this.username}/submission_histories`

        const contributions = await (await fetch(url)).json()

        for (const contributionDate of Object.keys(contributions)) {
          const contributionDay = getDayIndex(M(contributionDate))
          this.submissions.set(contributionDay, parseInt(contributions[contributionDate], 10))
        }

        if (!this.submissions.has(day)) {
          this.submissions.set(day, 0)
        }
      } catch {
        return null
      }
    }

    return this.submissions.get(day) as number
  }

}
