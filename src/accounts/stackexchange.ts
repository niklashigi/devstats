import {stringify as querify} from 'query-string';
import fetch from 'node-fetch';

import {parseDayIndex} from '../time';

const BASE_URL = 'https://api.stackexchange.com/2.2';

interface Response {
  items: {
    reputation_change?: number;
  }[];
}

export abstract class StackExchangeAccount {
  constructor(private site: string, private userId: number) {}

  reputation: Map<number, number> = new Map();

  async getReport(day: number) {
    if (this.reputation.has(day)) {
      return this.reputation.get(day) as number;
    }

    const dayMoment = parseDayIndex(day);

    const url = `${BASE_URL}/users/${this.userId}/reputation?` + querify({
      site: this.site,
      fromdate: dayMoment.unix(),
      todate: dayMoment.add(1, 'day').unix(),
      pagesize: 100
    });

    try {
      const response: Response = (await (await fetch(url)).json());
      const changes = response.items;
      const report = changes.map(item => item.reputation_change || 0)
        .reduce((sum, add) => sum + add, 0);
      this.reputation.set(day, report);

      return report;
    } catch {
      return null;
    }
  }
}
