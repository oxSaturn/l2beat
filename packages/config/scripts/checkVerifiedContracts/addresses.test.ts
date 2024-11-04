import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  bridges,
  daLayers,
  getChainNames,
  getChainNamesForDA,
  layer2s,
  layer3s,
} from '../../src/'
import { bridge1WithDups } from '../../src/test/stubs/bridge1WithDups'
import { bridge2WithDups } from '../../src/test/stubs/bridge2WithDups'
import { layer2aWithDups } from '../../src/test/stubs/layer2aWithDups'
import {
  getUniqueAddressesForDaBridge,
  getUniqueContractsForAllProjects,
  getUniqueContractsForProject,
} from './addresses'
import {
  getOutputPath as getVerificationFilePath,
  loadVerifiedJson,
} from './output'

describe('checkVerifiedContracts:addresses', () => {
  function verifyContracts(
    contracts: EthereumAddress[],
    verified: Record<string, boolean>,
    chain: string,
  ) {
    for (const contract of contracts) {
      if (verified[contract.toString()] === undefined) {
        throw new Error(
          `Not all contracts have been checked for verification.\nGo to packages/config and run pnpm check-verified-contracts\n The missing contract's address is ${contract.toString()} on ${chain}`,
        )
      }
    }
  }
  describe('all current L2BEAT contracts are included in verified.json', () => {
    const projects = [...bridges, ...layer2s, ...layer3s]
    const chains = getChainNames(...projects)
    for (const chain of chains) {
      it(`for L2BEAT:${chain}`, async () => {
        const filePath = getVerificationFilePath(chain)
        const verifiedJson = await loadVerifiedJson(filePath)
        const allContracts = getUniqueContractsForAllProjects(projects, chain)

        verifyContracts(allContracts, verifiedJson, chain)
      })
    }
  })

  describe('all current DABEAT contracts are included in verified.json', () => {
    const chains = getChainNamesForDA(...daLayers)
    for (const chain of chains) {
      it(`for DABEAT:${chain}`, async () => {
        const addresses = []
        const filePath = getVerificationFilePath(chain)
        const verifiedJson = await loadVerifiedJson(filePath)
        for (const daLayer of daLayers) {
          for (const bridge of daLayer.bridges) {
            addresses.push(...getUniqueAddressesForDaBridge(bridge, chain))
          }
        }

        verifyContracts(addresses, verifiedJson, chain)
      })
    }
  })

  describe('getUniqueContractsForAllProjects()', () => {
    describe('can parse all current layer2s and bridges', () => {
      const projects = [...bridges, ...layer2s, ...layer3s]
      const chains = getChainNames(...projects)
      for (const chain of chains) {
        it(`for ${chain}`, async () => {
          expect(() =>
            getUniqueContractsForAllProjects(
              [...bridges, ...layer2s],
              'ethereum',
            ),
          ).not.toThrow()
        })
      }
    })

    it('correctly finds unique addresses for all stub projects with duplicates', () => {
      const addresses = getUniqueContractsForAllProjects(
        [layer2aWithDups, bridge1WithDups, bridge2WithDups],
        'ethereum',
      )
      addresses.sort()
      expect(addresses).toEqual(
        [
          '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
          '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
          '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
          '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
          '0x3Ee764C95e9d2264DE3717a4CB45BCd3c5F00035',
          '0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB',
          '0x42F38ec5A75acCEc50054671233dfAC9C0E7A3F6',
          '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
          '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
          '0x53D23ba1c38D6ECf2B7f213F7CF22b17AE3BB868',
          '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          '0x5a51E2ebF8D136926b9cA7b59B60464E7C44d2Eb',
          '0x7b9Bb72F187B3cb2CaA9Cf1cE95A938f0a66DB54',
          '0x81910675DbaF69deE0fD77570BFD07f8E436386A',
          '0x82B67a43b69914E611710C62e629dAbB2f7AC6AB',
          '0x87D48c565D0D85770406D248efd7dc3cbd41e729',
          '0x88ad09518695c6c3712AC10a214bE5109a655671',
          '0x8eB3b7D8498a6716904577b2579e1c313d48E347',
          '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
          '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
          '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          '0xD16463EF9b0338CE3D73309028ef1714D220c024',
          '0xD83893F31AA1B6B9D97C9c70D3492fe38D24d218',
          '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
          '0xcF2afe102057bA5c16f899271045a0A37fCb10f2',
          '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
          '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
          '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
          '0xed84a648b3c51432ad0fD1C2cD2C45677E9d4064',
        ].map(EthereumAddress),
      )
    })
  })

  describe('getUniqueContractsForProject', () => {
    it('correctly finds unique addresses for a single stub project with duplicates', () => {
      const addresses = getUniqueContractsForProject(
        layer2aWithDups,
        'ethereum',
      )
      addresses.sort()
      expect(addresses.sort()).toEqual(
        [
          '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
          '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
          '0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB',
          '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
          '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
          '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          '0x82B67a43b69914E611710C62e629dAbB2f7AC6AB',
          '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
          '0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A',
          '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
          '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          '0xD16463EF9b0338CE3D73309028ef1714D220c024',
          '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
          '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
          '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
          '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
        ].map(EthereumAddress),
      )
    })
  })
})
