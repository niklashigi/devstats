import fetch from 'node-fetch';
import chalk from 'chalk';
import {JSDOM} from 'jsdom';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';
import {parseAccountUrl} from '../libs/urls';

const BASE_URL = 'https://github.com';

export class GitHubAccount implements Account {
  static title = 'GitHub';
  static aliases = ['github', 'gh'];
  static statistic = 'contributions made';
  static theme = chalk.hex('#34d058');

  static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/github.com\/([^/\s]+)/i);
  }

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://github.com/${this.username}`;
  }

  contributions: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.contributions.has(day)) {
      try {
        const html = await (await fetch(`${BASE_URL}/${this.username}`)).text();
        const document = new JSDOM(html).window.document;

        for (const dayElement of Array.from(document.querySelectorAll('.day'))) {
          this.contributions.set(getDayIndex(M((dayElement.getAttribute('data-date') as string).trim())),
          parseInt(dayElement.getAttribute('data-count') as string));
        }
      } catch {
        return null;
      }
    }

    return this.contributions.get(day) as number;
  }
}
