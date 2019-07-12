import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'

import chalk from 'chalk'
import * as M from 'moment'
import fetch from 'node-fetch'
import { stringify as querify } from 'query-string'

import { parseSlashAccountUrl } from '../libs/urls'
import { parseDayIndex } from '../time'
import { Account } from './account'

const BASE_URL = 'https://wakatime.com/api/v1'

interface Response {
  data: Array<{
    grand_total: {
      total_seconds: number,
    },
  }>
}

const formatMoment = (moment: M.Moment) => moment.format('YYYY-MM-DD')

export class WakaTimeAccount implements Account {

  public static title = 'WakaTime'
  public static aliases = ['wakatime', 'wt']
  public static statistic = 'spent coding'
  public static theme = chalk.hex('#2595ff')

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://wakatime.com/@${this.username}`
  }

  public static resolveUrlToId(url: string) {
    return parseSlashAccountUrl(url, 'wakatime.com')
  }

  public apiKey: string | null | undefined
  public durations: Map<number, M.Duration> = new Map()

  public async getReport(day: number) {
    if (this.durations.has(day)) {
      return this.durations.get(day)!
    }

    this.apiKey = await this.findApiKey()
    if (!this.apiKey) {
      return null
    }

    const dayMoment = parseDayIndex(day)
    const url = `${BASE_URL}/users/${this.username}/summaries?` + querify({
      start: formatMoment(dayMoment),
      end: formatMoment(dayMoment.add(1, 'day')),
      api_key: this.apiKey,
    })
    try {
      const response: Response = (await (await fetch(url)).json())
      const seconds = response.data[0].grand_total.total_seconds
      const duration = M.duration(seconds, 'seconds')
      this.durations.set(day, duration)

      return duration
    } catch {
      // `null` will be returned below
    }

    return null
  }

  public async findApiKey() {
    try {
      const cfgPath = path.join(os.homedir(), '.wakatime.cfg')
      const cfgContent = await fs.readFile(cfgPath, 'utf8')
      const match = cfgContent.match(/api_key ?= ?(.+)/)

      if (match && match[1]) {
        return match[1]
      }
    } catch {
      return null
    }
  }

}
