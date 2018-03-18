import fetch from 'node-fetch';
import chalk from 'chalk';
import {JSDOM} from 'jsdom';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';

const BASE_URL = 'https://github.com';

export class GitHubAccount implements Account {
  constructor(private userName: string) {}

  title = 'GitHub';
  statistic = 'contributions made';
  theme = chalk.greenBright;

  contributions: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.contributions.has(day)) {
      const html = await (await fetch(`${BASE_URL}/${this.userName}`)).text();
      const document = new JSDOM(html).window.document;

      for (const dayElement of Array.from(document.querySelectorAll('.day'))) {
        this.contributions.set(getDayIndex(M((dayElement.getAttribute('data-date') as string).trim())),
        parseInt(dayElement.getAttribute('data-count') as string));
      }
    }

    return this.contributions.get(day) as number;
  }
}
