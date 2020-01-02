import chalk = require('chalk')

import { parseAccountUrl } from '../../libs/urls'
import { Account } from '../account'
import { StackExchangeAccount } from '../stackexchange'

export class ReverseEngineeringAccount extends StackExchangeAccount implements Account {

  public static title = 'Reverse Eng.'
  public static aliases = ['reverseengineering', 're']
  public static statistic = 'reputation earned'
  public static theme = chalk.hex('#d03d34') // TODO: Change this once the site receives its own SE theme

  constructor(userId: string) {
    super('stackoverflow', userId)
  }

  public static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/reverseengineering\.stackexchange\.com\/users\/(\d+)/i)
  }

  get canonicalUrl() {
    return `https://reverseengineering.stackexchange.com/users/${this.userId}`
  }

}
