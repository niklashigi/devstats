import chalk from 'chalk';

import {StackExchangeAccount} from './stackexchange';

export class StackOverflowAccount extends StackExchangeAccount {
  constructor(userId: number) {
    super('stackoverflow', userId);
  }

  title = 'StackOverflow';
  statistic = 'reputation earned';
  theme = chalk.hex('#ff7e39');
}
