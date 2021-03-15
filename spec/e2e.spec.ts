import * as helper from './helper'
import { getInstance } from '../src/index'
import { stderr } from 'process'

// createAccount            DONE
// extractValuesFromKey     DONE
// fetchKeyOwner            DONE
// fetchHeight              DONE
// fetchDataWithRegex       DONE
// fetchDevices
// request                  DONE
// fetchKeyWhitelist        DONE
// waitForNBlocks           DONE
// delay                    DONE
// broadcast                DONE
// transferKey              DONE
// fetchDevice
// interactWithDevice
// onBlockchainUpdate       DONE
// generateKey              DONE
// insertData               DONE

const progress = Object.assign(
  () => process.stdout.write((progress.counter++).toString()),
  { counter: 0 }
)

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
  key: {
    assetId: '',
    device: '',
    validTo: 999999999999999
  }
}

const { nodeUrl, chainId } = helper.config
const lib = getInstance({ nodeUrl, chainId })

describe('e2e', () => {
  it('creates accounts', async () => {
    ctx.dapp = lib.createAccount()
    ctx.device = lib.createAccount()
    ctx.user = lib.createAccount()

    await Promise.all([
      helper.fund(ctx.dapp.address),
      helper.fund(ctx.device.address),
      helper.fund(ctx.user.address)
    ])

    progress()
  })

  it('generateKey', async () => {
    ctx.key.device = ctx.device.address

    ctx.key.assetId = await lib.generateKey(
      ctx.key.device,
      ctx.key.validTo,
      ctx.dapp.seed
    )

    progress()
  })

  it('transferKey', async () => {
    await lib.transferKey(ctx.user.address, ctx.key.assetId, ctx.dapp.seed)

    progress()
  })

  it('extract values from key', async () => {
    const itx = await lib.request(`/assets/details/${ctx.key.assetId}`)
    const values = lib.extractValuesFromKey(itx.description)

    expect(values.device).toBe(ctx.key.device)
    expect(values.validTo).toBe(ctx.key.validTo)

    progress()
  })

  it('onBlockchainUpdate', async () => {
    const heights: number[] = []
    const promise = lib.onBlockchainUpdate((height) => heights.push(height), 200)
    await lib.waitForNBlocks(2)
    await promise.cancel()

    // TODO Promise leaking?
    await lib.delay(500)

    expect(heights[0]).toBeGreaterThanOrEqual(0)
    expect(heights[1]).toBeGreaterThanOrEqual(0)
    expect(heights[1]).toBeGreaterThan(heights[0])
    expect(heights.length).toBe(2)

    progress()
  })

  it('check key owner', async () => {
    // should be at least one block after transfer
    const height = await lib.fetchHeight()
    const owner = await lib.fetchKeyOwner(ctx.key.assetId, height - 1)

    expect(owner).toBe(ctx.user.address)

    progress()
  })

  it('fetchKeyWhitelist', async () => {
    const keys = [helper.randomAssetId(), helper.randomAssetId()]

    await lib.insertData(
      [
        { key: `key_${keys[0]}`, value: 'active' },
        { key: `key_${keys[1]}`, value: 'active' }
      ],
      ctx.device.seed
    )

    const [fromWhitelist, fromRegex] = await Promise.all([
      lib.fetchKeyWhitelist(ctx.device.address),
      lib.fetchDataWithRegex('key_.{32,44}', ctx.device.address)
    ])

    expect(fromWhitelist).toContainEqual({ assetId: keys[0], status: 'active' })
    expect(fromWhitelist).toContainEqual({ assetId: keys[1], status: 'active' })

    expect(fromRegex).toContainEqual({
      key: `key_${keys[0]}`,
      value: 'active',
      type: 'string'
    })
    expect(fromRegex).toContainEqual({
      key: `key_${keys[1]}`,
      value: 'active',
      type: 'string'
    })

    progress()
  })
})
