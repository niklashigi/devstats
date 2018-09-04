import chalk from 'chalk';

import {Account} from '../account'
import {StackExchangeAccount} from '../stackexchange';
import {parseAccountUrl} from '../../libs/urls';

export class ReverseEngineeringAccount extends StackExchangeAccount implements Account {
  static title = 'Reverse Eng.';
  static aliases = ['reverseengineering', 're'];
  static statistic = 'reputation earned';
  static theme = chalk.hex('#d03d34'); // TODO: Change this once the site receives its own SE theme

  static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/reverseengineering\.stackexchange\.com\/users\/(\d+)/i);
  }

  constructor(userId: string) {
    super('stackoverflow', userId);
  }

  get canonicalUrl() {
    return `https://reverseengineering.stackexchange.com/users/${this.userId}`;
  }
}
