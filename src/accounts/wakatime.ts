import * as os from 'os';
import * as fs from 'fs-extra';
import * as path from 'path';

import {stringify as querify} from 'query-string';
import fetch from 'node-fetch';
import * as M from 'moment';
import chalk from 'chalk';

import {Account} from './account';
import {parseDayIndex} from '../time';

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
  constructor(private userName: string) {}

  title = 'WakaTime';
  statistic = 'spent coding';
  theme = chalk.cyan;

  async getReport(day: number) {
    const apiKey = await this.findApiKey();

    if (apiKey) {
      const dayMoment = parseDayIndex(day);
      const url = `${BASE_URL}/users/${this.userName}/summaries?` + querify({
        start: formatMoment(dayMoment),
        end: formatMoment(dayMoment.add(1, 'day')),
        api_key: apiKey
      });
      try {
        const response: Response = (await (await fetch(url)).json());
        const seconds = response.data[0].grand_total.total_seconds;
        if (seconds > 0) {
          return M.duration(seconds, 'seconds').humanize();
        }
      } catch {
        return null;
      }
    }

    return 'no time';
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
