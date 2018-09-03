import chalk from 'chalk';

import showUpdateNotification from '../libs/update-notifier';
import {resolveAccountUrl} from '../libs/accounts';
import getConfig from '../libs/config';

export default function add(url?: string) {
  if (!url) throw new Error('You have to specify an account URL to add.');

  const accountUrl = resolveAccountUrl(url).canonicalUrl;

  const config = getConfig();
  const accounts = config.get('accounts');

  if (accounts.includes(accountUrl)) {
    throw new Error(chalk`You've already added {bold ${accountUrl}} to your accounts.`);
  }

  config.set('accounts', [...accounts, accountUrl]);
  console.log(chalk`
  {blue You've successfully added {bold ${accountUrl}} to your accounts!}
  `);

  showUpdateNotification();
}
