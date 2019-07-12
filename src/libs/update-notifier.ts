import updateNotifier = require('update-notifier')
import pkg = require('../../package.json')

const notifier = updateNotifier({ pkg })
export default function showUpdateNotification() {
  notifier.notify()
}
