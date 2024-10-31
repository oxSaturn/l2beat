import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('vemp', 'arbitrum')

export const oev: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1730367731), // 	Thu Oct 31 2024 09:42:11 GMT+0000
  additionalPurposes: ['Gaming'],
  badges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  display: {
    name: 'VEMP Horizon',
    shortName: 'Horizon',
    slug: 'vemp',
    description:
      'Horizon is a specialist Orbit stack Optimium L3 designed by VEMP Studios to empower community-driven game economies, particularly for indie and smaller game developers.',
    links: {
      websites: ['https://www.vemp.xyz/'],
      apps: ['https://vemp-horizon.bridge.caldera.xyz/'],
      documentation: ['https://docs.vemp.xyz/'],
      explorers: ['https://vemp-horizon.calderaexplorer.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/VEMPHorizon/',
        'https://discord.gg/vemp',
        'https://t.me/VEMPCommunityHub',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://vemp-horizon.calderachain.xyz/http',
  discovery,
  discoveryDrivenData: true,
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://www.vemp.xyz/announcements/vemp-horizon',
      date: '2024-07-26T00:00:00Z',
      description:
        'VEMP Horizon is launched as an Orbit stack Optimium on Arbitrum.',
      type: 'general',
    },
  ],
})
