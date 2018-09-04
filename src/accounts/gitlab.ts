import fetch from 'node-fetch';
import chalk from 'chalk';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';
import {parseSlashAccountUrl} from '../libs/urls';

const BASE_URL = 'https://gitlab.com';

export class GitLabAccount implements Account {
  static title = 'GitLab';
  static aliases = ['gitlab', 'gl'];
  static statistic = 'contributions made';
  static theme = chalk.hex('#f24533');

  static resolveUrlToId(url: string) {
    return parseSlashAccountUrl(url, 'gitlab.com');
  }

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://gitlab.com/${this.username}`;
  }

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
