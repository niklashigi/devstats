import Conf = require('conf')

export default function getConfig() {
  return new Conf<string[]>({
    defaults: {
      accounts: [],
    },
  })
}
