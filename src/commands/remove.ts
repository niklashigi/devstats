import chalk from 'chalk';
import {resolveAccountUrl} from '../libs/accounts';
import getConfig from '../libs/config';

export default function remove(url?: string) {
  if (!url) throw new Error('You have to specify an account URL to remove.');

  const accountUrl = resolveAccountUrl(url).canonicalUrl;

  const config = getConfig();
  const accounts = config.get('accounts');

  if (!accounts.includes(accountUrl)) {
    throw new Error(chalk`Your accounts don't contain {bold ${accountUrl}}.`);
  }

  config.set('accounts', accounts.filter(account => account !== accountUrl));
  console.log(chalk`
  {blue You've successfully removed {bold ${accountUrl}} from your accounts!}
`);
}
