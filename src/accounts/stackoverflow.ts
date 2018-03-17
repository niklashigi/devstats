import {stringify as querify} from 'query-string';
import fetch from 'node-fetch';
import chalk from 'chalk';

import {Account} from './account';
import {parseDayIndex} from '../time';

const BASE_URL = 'https://api.stackexchange.com/2.2';

interface Response {
  items: {
    reputation_change?: number;
  }[];
}

export class StackOverflowAccount implements Account {
  constructor(private userId: number) {}

  title = 'StackOverflow';
  statistic = 'reputation earned';
  theme = chalk.yellow;

  async getReport(day: number) {
    const dayMoment = parseDayIndex(day);

    const url = `${BASE_URL}/users/${this.userId}/reputation?` + querify({
      site: 'stackoverflow',
      fromdate: dayMoment.unix(),
      todate: dayMoment.add(1, 'day').unix(),
      pagesize: 100
    });

    const response: Response = (await (await fetch(url)).json());
    const changes = response.items;

    return changes.map(item => item.reputation_change || 0)
      .reduce((sum, add) => sum + add, 0);
  }
}
