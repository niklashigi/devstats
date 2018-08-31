import fetch from 'node-fetch';
import chalk from 'chalk';
import * as M from 'moment';

import {Account} from './account';
import {getDayIndex} from '../time';

const BASE_URL = 'https://hackerrank.com';

export class HackerRankAccount implements Account {
  constructor(private userName: string) {}

  title = 'HackerRank';
  statistic = 'submissions made';
  theme = chalk.hex('#23b355');

  submissions: Map<number, number> = new Map();

  async getReport(day: number) {
    if (!this.submissions.has(day)) {
      try {
        const contributions = await (await fetch(`${BASE_URL}/rest/hackers/${this.userName}/submission_histories`)).json();
        for (const contributionDate of Object.keys(contributions)) {
          const contributionDay = getDayIndex(M(contributionDate));
          this.submissions.set(contributionDay, parseInt(contributions[contributionDate]));
        }
        if (!this.submissions.has(day)) {
          this.submissions.set(day, 0);
        }
      } catch {
        return null;
      }
    }

    return this.submissions.get(day) as number;
  }
}
