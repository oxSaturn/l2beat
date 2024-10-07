import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('world')

export const world: Layer2 = opStackL2({
  display: {
    name: 'World Chain',
    slug: 'world',
    description:
      "World Chain is a new OP Stack L2 that will leverage World ID's Proof of Personhood.",
    purposes: ['Universal', 'Identity'],
    links: {
      websites: ['https://worldcoin.org/world-chain'],
      apps: ['https://worldcoin.org/download-app'],
      documentation: ['https://docs.worldcoin.org/'],
      explorers: [],
      repositories: ['https://github.com/worldcoin'],
      socialMedia: [
        'https://twitter.com/worldcoin',
        'https://discord.com/invite/worldcoin',
        'https://t.me/worldcoin',
        'https://linkedin.com/company/worldcoinproject/',
        'https://youtube.com/@worldcoinofficial',
      ],
    },
  },
  discoveryDrivenData: true,
  discovery,
  genesisTimestamp: new UnixTime(1661178839),
})
