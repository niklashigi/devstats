import chalk from 'chalk';

import {StackExchangeAccount} from '../stackexchange';

export class ReverseEngineeringAccount extends StackExchangeAccount {
  constructor(userId: number) {
    super('reverseengineering', userId);
  }

  title = 'Reverse Eng.';
  statistic = 'reputation earned';

  // This color should be changed once the site receives its own theme
  theme = chalk.hex('#d03d34');
}
