import chalk from 'chalk';

import {StackExchangeAccount} from './stackexchange';
import {parseAccountUrl} from '../libs/urls';

export class StackOverflowAccount extends StackExchangeAccount {
  constructor(url: string) {
    super(
      'stackoverflow',
      parseAccountUrl(url, /\/\/stackoverflow\.com\/users\/(\d+)/i),
    );
  }

  title = 'StackOverflow';
  statistic = 'reputation earned';
  theme = chalk.hex('#ff7e39');
}
