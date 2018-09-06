import * as os from 'os';
import * as fs from 'fs-extra';
import * as path from 'path';

import {stringify as querify} from 'query-string';
import fetch from 'node-fetch';
import * as M from 'moment';
import chalk from 'chalk';

import {Account} from './account';
import {parseDayIndex} from '../time';
import {parseSlashAccountUrl} from '../libs/urls';

const BASE_URL = 'https://wakatime.com/api/v1';

interface Response {
  data: {
    grand_total: {
      total_seconds: number;
    };
  }[];
}

const formatMoment = (moment: M.Moment) => moment.format('YYYY-MM-DD');

export class WakaTimeAccount implements Account {
  static title = 'WakaTime';
  static aliases = ['wakatime', 'wt'];
  static statistic = 'spent coding';
  static theme = chalk.hex('#2595ff');

  static resolveUrlToId(url: string) {
    return parseSlashAccountUrl(url, 'wakatime.com');
  }

  constructor(private username: string) {}

  get canonicalUrl() {
    return `https://wakatime.com/@${this.username}`;
  }

  apiKey: string | null | undefined;
  durations: Map<number, M.Duration> = new Map();

  async getReport(day: number) {
    if (this.durations.has(day)) {
      return this.durations.get(day)!;
    }

    this.apiKey = await this.findApiKey();
    if (!this.apiKey) {
      return null;
    }

    const dayMoment = parseDayIndex(day);
    const url = `${BASE_URL}/users/${this.username}/summaries?` + querify({
      start: formatMoment(dayMoment),
      end: formatMoment(dayMoment.add(1, 'day')),
      api_key: this.apiKey
    });
    try {
      const response: Response = (await (await fetch(url)).json());
      const seconds = response.data[0].grand_total.total_seconds;
      const duration = M.duration(seconds, 'seconds');
      this.durations.set(day, duration);

      return duration;
    } catch {
      // `null` will be returned below
    }

    return null;
  }

  async findApiKey() {
    try {
      const cfgPath = path.join(os.homedir(), '.wakatime.cfg');
      const cfgContent = await fs.readFile(cfgPath, 'utf8');
      const match = cfgContent.match(/api_key ?= ?(.+)/);

      if (match && match[1]) {
        return match[1];
      }
    } catch {
      return null;
    }
  }
}
