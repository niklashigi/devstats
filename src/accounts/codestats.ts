import fetch from 'node-fetch';
import chalk from 'chalk';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';
import {parseAccountUrl} from '../libs/urls';

const BASE_URL = 'https://codestats.net/api/users/';

export class CodeStatsAccount implements Account {
  static title = 'Code::Stats';
  static aliases = ['codestats', 'cs'];
  static statistic = 'XP gained';
  static theme = chalk.hex('#3e4053');

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://codestats.net/users/${this.username}`;
  }

  static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/codestats.net\/users\/([^/\s]+)/i);
  }

  dates: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.dates.size) {
        await this.fetchDates();
    }

    return this.dates.has(day) ? this.dates.get(day) as number : 0;
  }

  async fetchDates() {
      console.log('Fetching dates');
      try {
        const userData = await (await fetch(`${BASE_URL}${this.username}`)).text();
        const userDates = JSON.parse(userData).dates;
        for (const date in userDates) {
            this.dates.set(getDayIndex(M(date)), userDates[date]);
        }
      } catch {
        return null;
      }
  }
}
