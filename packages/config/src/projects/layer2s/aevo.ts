import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aevo')

export const aevo: Layer2 = opStackL2({
  createdAt: new UnixTime(1694090052), // 2023-09-07T12:34:12Z
  badges: [Badge.DA.Celestia, Badge.RaaS.Conduit],
  daProvider: CELESTIA_DA_PROVIDER,
  associatedTokens: ['AEVO'],
  discovery,
  additionalPurposes: ['Exchange'],
  display: {
    name: 'Aevo',
    slug: 'aevo',
    architectureImage: 'aevo',
    description:
      'Aevo is a high-performance decentralized options exchange, powered by the OP Stack and Celestia DA.',
    links: {
      websites: ['https://aevo.xyz/'],
      apps: ['https://app.aevo.xyz/'],
      documentation: ['https://docs.aevo.xyz/'],
      explorers: ['https://explorer.aevo.xyz/'],
      repositories: ['https://github.com/aevoxyz'],
      socialMedia: [
        'https://twitter.com/aevoxyz',
        'https://discord.com/invite/aevo',
        'https://t.me/aevoupdates',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'aevo',
    chainId: 2999,
    explorerUrl: 'https://explorer.aevo.xyz',
    explorerApi: {
      url: 'https://explorer.aevo.xyz/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        sinceBlock: 2790111,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-09-05T03:00:00Z')),
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://l2-aevo-mainnet-prod-0.t.conduit.xyz/',
    startBlock: 1,
    defaultCallsPerMinute: 800,
    assessCount: subtractOne,
  },
  genesisTimestamp: new UnixTime(1679202395),
  isNodeAvailable: false,
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Aevo Open Mainnet Launch',
      link: 'https://aevo.mirror.xyz/hV7VYkpk7caoYl2DbOFcSaZRRrK-8NeWqKczrgUff6k',
      date: '2023-06-14T00:00:00.00Z',
      description:
        'Aevo removes the whitelist and opens the mainnet to the public.',
      type: 'general',
    },
    {
      name: 'Aevo switches to Celestia',
      link: 'https://twitter.com/aevoxyz/status/1750013642278633510',
      date: '2024-01-16T00:00:00.00Z',
      description: 'Aevo starts using Celestia for data availability.',
      type: 'general',
    },
    {
      name: 'AEVO Token Airdrop',
      link: 'https://aevo.mirror.xyz/5LfLIxt_lfdoVBUTtdofAVU6YXioBzGkbhtUWnaRT-U',
      date: '2024-03-13T00:00:00.00Z',
      description: 'AEVO token launches.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Blobstream and Celestia Architecture',
      url: 'https://www.youtube.com/watch?v=cn_fN6pkakQ',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
})
