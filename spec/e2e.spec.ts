import * as helper from './helper'
import { getInstance } from '../src/index'
import * as constants from '../src/constants'

// createAccount            DONE
// extractValuesFromKey     DONE
// fetchKeyOwner            DONE
// fetchHeight              DONE
// fetchDataWithRegex       DONE
// fetchDevices             DONE
// request                  DONE
// fetchKeyWhitelist        DONE
// waitForNBlocks           DONE
// delay                    DONE
// broadcast                DONE
// transferKey              DONE
// fetchDevice              DONE
// interactWithDevice
// onBlockchainUpdate       DONE
// generateKey              DONE
// insertData               DONE

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
  })

  it('generateKey', async () => {
    ctx.key.device = ctx.device.address

    ctx.key.assetId = await lib.generateKey(
      ctx.key.device,
      ctx.key.validTo,
      ctx.dapp.seed
    )
  })

  it('transferKey', async () => {
    await lib.transferKey(ctx.user.address, ctx.key.assetId, ctx.dapp.seed)
  })

  it('extract values from key', async () => {
    const itx = await lib.request(`/assets/details/${ctx.key.assetId}`)
    const values = lib.extractValuesFromKey(itx.description)

    expect(values.device).toBe(ctx.key.device)
    expect(values.validTo).toBe(ctx.key.validTo)
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
  })

  it('check key owner', async () => {
    // should be at least one block after transfer
    const height = await lib.fetchHeight()
    const owner = await lib.fetchKeyOwner(ctx.key.assetId, height - 1)

    expect(owner).toBe(ctx.user.address)
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
      lib.fetchDataWithRegex(constants.keyRegex, ctx.device.address)
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
  })

  it('fetchDevices', async () => {
    const devices = [helper.createAccount().address, helper.createAccount().address]

    await lib.insertData(
      [
        { key: `device_${devices[0]}`, value: 'active' },
        { key: `device_${devices[1]}`, value: 'active' }
      ],
      ctx.dapp.seed
    )

    const result = await lib.fetchDevices(ctx.dapp.address)

    expect(result.map((x) => x.address)).toContain(devices[0])
    expect(result.map((x) => x.address)).toContain(devices[1])
  })

  it('fetchDevice', async () => {
    await lib.insertData(
      [
        { key: 'name', value: 'Adam' },
        { key: 'active', value: true },
        { key: 'lat', value: '5.6345' }
      ],
      ctx.device.seed
    )

    const device = await lib.fetchDevice(ctx.device.address)

    expect(device.name).toBe('Adam')
    expect(device.active).toBe(true)
    expect(device.location?.lat).toBe(5.6345)
  })
})
