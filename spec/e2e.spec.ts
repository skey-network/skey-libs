import * as helper from './helper'
import { getInstance } from '../src/index'

// createAccount            DONE
// extractValuesFromKey
// fetchKeyOwner
// fetchHeight
// fetchDataWithRegex
// fetchDevices
// request
// fetchKeyWhitelist
// waitForNBlocks
// delay
// broadcast
// transferKey              DONE
// WVS
// FEE_MULTIPLIER
// fetchDevice
// interactWithDevice
// onBlockchainUpdate

const ctx = {
  dapp: {
    address: '',
    seed: ''
  },
  device: {
    address: '',
    seed: ''
  },
  user: {
    address: '',
    seed: ''
  },
  key: ''
}

const { nodeUrl, chainId } = helper.config
const lib = getInstance({ nodeUrl, chainId })

describe('e2e', () => {
  it('create dapp', async () => {
    ctx.dapp = lib.createAccount()
    await helper.fund(ctx.dapp.address)
  })

  it('create device', async () => {
    ctx.device = lib.createAccount()
    await helper.fund(ctx.device.address)
  })

  it('create user', async () => {
    ctx.user = lib.createAccount()
    await helper.fund(ctx.user.address)
  })

  // use later?
  it('generateKey', async () => {
    ctx.key = await helper.generateKey(ctx.device.address, 999999999999, ctx.dapp.seed)
  })

  it('transferKey', async () => {
    await lib.transferKey(ctx.user.address, ctx.key, ctx.dapp.address)
  })

  it('fetchKeyOwner', async () => {})
})
