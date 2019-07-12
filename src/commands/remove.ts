import chalk from 'chalk'

import { resolveAccountArguments } from '../libs/accounts'
import getConfig from '../libs/config'
import showUpdateNotification from '../libs/update-notifier'

export default function remove(args: string[]) {
  const accountUrl = resolveAccountArguments(args).canonicalUrl

  const config = getConfig()
  const accounts = config.get('accounts')

  if (!accounts.includes(accountUrl)) {
    throw chalk`Your accounts don't contain {bold ${accountUrl}}.`
  }

  config.set('accounts', accounts.filter(url => url !== accountUrl))
  console.log(chalk`
  {blue You've successfully removed {bold ${accountUrl} } from your accounts!}
`)

  showUpdateNotification()
}
