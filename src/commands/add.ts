import chalk from 'chalk'

import { resolveAccountArguments } from '../libs/accounts'
import getConfig from '../libs/config'
import showUpdateNotification from '../libs/update-notifier'

export default function add(args: string[]) {
  const accountUrl = resolveAccountArguments(args).canonicalUrl

  const config = getConfig()
  const accountUrls = config.get('accounts')

  if (accountUrls.includes(accountUrl)) {
    throw chalk`You've already added {bold ${accountUrl}} to your accounts.`
  }

  config.set('accounts', [...accountUrls, accountUrl])
  console.log(chalk`
  {blue You've successfully added {bold ${accountUrl}} to your accounts!}
  `)

  showUpdateNotification()
}
