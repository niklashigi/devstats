import Conf from 'conf'

export default function getConfig() {
  return new Conf<StoreType>({
    projectName: 'devstats',
    defaults: {
      accounts: [],
    },
  })
}

interface StoreType {
  accounts: string[]
}
