import fetch from 'node-fetch';
import chalk from 'chalk';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';
import {parseSlashAccountUrl} from '../libs/urls';

const BASE_URL = 'https://gitlab.com';

export class GitLabAccount implements Account {
  private username: string;

  constructor(url: string) {
    this.username = parseSlashAccountUrl(url, 'gitlab.com');
  }

  get canonicalUrl() {
    return `https://gitlab.com/${this.username}`;
  }

  title = 'GitLab';
  statistic = 'contributions made';
  theme = chalk.hex('#f24533');

  contributions: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.contributions.has(day)) {
      try {
        const contributions = await (await fetch(`${BASE_URL}/users/${this.username}/calendar.json`)).json();
        for (const contributionDate of Object.keys(contributions)) {
          const contributionDay = getDayIndex(M(contributionDate));
          this.contributions.set(contributionDay, parseInt(contributions[contributionDate]));
        }
        if (!this.contributions.has(day)) {
          this.contributions.set(day, 0);
        }
      } catch {
        return null;
      }
    }

    return this.contributions.get(day) as number;
  }
}
