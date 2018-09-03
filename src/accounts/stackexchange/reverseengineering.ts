import chalk from 'chalk';

import {StackExchangeAccount} from '../stackexchange';
import {parseAccountUrl} from '../../libs/urls';

export class ReverseEngineeringAccount extends StackExchangeAccount {
  constructor(url: string) {
    super(
      'stackoverflow',
      parseAccountUrl(url, /\/\/reverseengineering\.stackexchange\.com\/users\/(\d+)/i),
    );
  }

  title = 'Reverse Eng.';
  statistic = 'reputation earned';

  // This color should be changed once the site receives its own theme
  theme = chalk.hex('#d03d34');
}
