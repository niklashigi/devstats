import fetch from 'node-fetch';
import chalk from 'chalk';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';

const BASE_URL = 'https://gitlab.com';

export class GitLabAccount implements Account {
  constructor(private userName: string) {}

  title = 'GitLab';
  statistic = 'contributions made';
  theme = chalk.hex('#f24533');

  contributions: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.contributions.has(day)) {
      try {
        const contributions = await (await fetch(`${BASE_URL}/users/${this.userName}/calendar.json`)).json();
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
