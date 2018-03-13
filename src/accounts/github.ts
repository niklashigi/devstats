import fetch from 'node-fetch';
import chalk from 'chalk';
import {JSDOM} from 'jsdom';

import {Account} from './account';
import {parseDayIndex} from '../time';

const BASE_URL = 'https://github.com';

export class GitHubAccount implements Account {
  constructor(private userName: string) {}

  title = 'GitHub';
  theme = chalk.greenBright;

  async getReport(day: number) {
    const dayMoment = parseDayIndex(day);

    const html = await (await fetch(`${BASE_URL}/${this.userName}`)).text();
    const document = new JSDOM(html).window.document;

    let value = 0;

    const date = dayMoment.format('YYYY-MM-DD');
    const dayElement = Array.from(document.querySelectorAll('.day'))
      .filter(el => el.getAttribute('data-date') === date);
    if (dayElement.length) {
      const dataCount = dayElement[0].getAttribute('data-count');
      if (dataCount) {
        value = parseInt(dataCount);
      }
    }

    return {
      theme: chalk.greenBright,
      title: 'GitHub',
      statistic: 'contributions made',
      value
    };
  }
}
