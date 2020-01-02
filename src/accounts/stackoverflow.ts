import chalk = require('chalk')

import { parseAccountUrl } from '../libs/urls'
import { StackExchangeAccount } from './stackexchange'

export class StackOverflowAccount extends StackExchangeAccount {

  public static title = 'StackOverflow'
  public static aliases = ['stackoverflow', 'so']
  public static statistic = 'reputation earned'
  public static theme = chalk.hex('#ff7e39')

  constructor(userId: string) {
    super('stackoverflow', userId)
  }

  public static resolveUrlToId(url: string) {
    return parseAccountUrl(url, /\/\/stackoverflow\.com\/users\/(\d+)/i)
  }

  get canonicalUrl() {
    return `https://stackoverflow.com/users/${this.userId}`
  }

}
