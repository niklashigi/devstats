import chalk = require('chalk')
import * as M from 'moment'
import fetch from 'node-fetch'

import { parseSlashAccountUrl } from '../libs/urls'
import { getDayIndex } from '../time'
import { Account } from './account'

const BASE_URL = 'https://gitlab.com'

export class GitLabAccount implements Account {

  public static title = 'GitLab'
  public static aliases = ['gitlab', 'gl']
  public static statistic = 'contributions made'
  public static theme = chalk.hex('#f24533')

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://gitlab.com/${this.username}`
  }

  public static resolveUrlToId(url: string) {
    return parseSlashAccountUrl(url, 'gitlab.com')
  }

  public contributions: Map<number, number> = new Map()

  public async getReport(day: number) {
    if (!this.contributions.has(day)) {
      try {
        const contributions = await (await fetch(`${BASE_URL}/users/${this.username}/calendar.json`)).json()

        for (const contributionDate of Object.keys(contributions)) {
          const contributionDay = getDayIndex(M(contributionDate))
          this.contributions.set(contributionDay, parseInt(contributions[contributionDate], 10))
        }

        if (!this.contributions.has(day)) {
          this.contributions.set(day, 0)
        }
      } catch {
        return null
      }
    }

    return this.contributions.get(day) as number
  }

}
