import chalk from 'chalk';

import {StackExchangeAccount} from './stackexchange';
import {parseAccountUrl} from '../libs/urls';

export class StackOverflowAccount extends StackExchangeAccount {
  static title = 'StackOverflow';
  static aliases = ['stackoverflow', 'so'];
  static statistic = 'reputation earned';
  static theme = chalk.hex('#ff7e39');

  static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/stackoverflow\.com\/users\/(\d+)/i);
  }

  constructor(userId: string) {
    super('stackoverflow', userId);
  }

  get canonicalUrl() {
    return `https://stackoverflow.com/users/${this.userId}`;
  }
}
