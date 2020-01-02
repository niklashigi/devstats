import chalk = require('chalk')
import { JSDOM } from 'jsdom'
import * as M from 'moment'
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

        for (const dayElement of Array.from(document.querySelectorAll('.day'))) {
          this.contributions.set(
            getDayIndex(M((dayElement.getAttribute('data-date') as string).trim())),
            parseInt(dayElement.getAttribute('data-count') as string, 10),
          )
        }
      } catch {
        return null
      }
    }

    return this.contributions.get(day) as number
  }

}
