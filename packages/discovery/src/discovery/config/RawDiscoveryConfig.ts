import { ManualProxyType } from '@l2beat/discovery-types'
import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z.object({
  extends: z.optional(z.string()),
  ignoreDiscovery: z.optional(z.boolean()),
  proxyType: z.optional(ManualProxyType),
  ignoreInWatchMode: z.optional(z.array(z.string())),
  ignoreMethods: z.optional(z.array(z.string())),
  ignoreRelatives: z.optional(z.array(z.string())),
  fields: z.optional(
    z.record(z.string().regex(/^[a-z_][a-z\d_]*$/i), UserHandlerDefinition),
  ),
  description: z.optional(z.string()),
  // TODO: in fields?
  methods: z.optional(z.record(z.string(), z.string())),
})

export type RawDiscoveryConfig = z.infer<typeof RawDiscoveryConfig>
export const RawDiscoveryConfig = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
  maxAddresses: z.optional(z.number().positive()),
  maxDepth: z.optional(z.number().positive()),
  overrides: z.optional(z.record(z.string(), DiscoveryContract)),
  names: z.optional(
    z.record(
      stringAs(EthereumAddress).transform((a) => a.toString()),
      z.string(),
    ),
  ),
  sharedModules: z.optional(z.record(z.string(), z.string())),
})
