import chalk from 'chalk';

import {StackExchangeAccount} from '../stackexchange';
import {parseAccountUrl} from '../../libs/urls';

export class ReverseEngineeringAccount extends StackExchangeAccount {
  static aliases = ['reverseengineering', 're'];

  static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/reverseengineering\.stackexchange\.com\/users\/(\d+)/i);
  }

  constructor(userId: string) {
    super('stackoverflow', userId);
  }

  get canonicalUrl() {
    return `https://reverseengineering.stackexchange.com/users/${this.userId}`;
  }

  title = 'Reverse Eng.';
  statistic = 'reputation earned';

  // This color should be changed once the site receives its own theme
  theme = chalk.hex('#d03d34');
}
