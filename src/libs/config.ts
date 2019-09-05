import Conf = require('conf')

export default function getConfig() {
  return new Conf<string[]>({
    projectName: 'devstats',
    defaults: {
      accounts: [],
    },
  })
}
