import * as Utils from '../src/utils'
import * as Crypto from '@waves/ts-lib-crypto'
import * as helper from './helper'

describe('utils', () => {
  describe('extractValuesFromKey', () => {
    it('extracts correctly', async () => {
      const { device, validTo } = Utils.extractValuesFromKey('aaa_111')
      expect(device).toBe('aaa')
      expect(validTo).toBe(111)
    })

    it('undefined', async () => {
      const { device, validTo } = Utils.extractValuesFromKey(
        undefined as unknown as string
      )
      expect(device).toBe(undefined)
      expect(validTo).toBe(undefined)
    })

    it('empty string', async () => {
      const { device, validTo } = Utils.extractValuesFromKey('')
      expect(device).toBe(undefined)
      expect(validTo).toBe(undefined)
    })

    it('validTo NaN', async () => {
      const { device, validTo } = Utils.extractValuesFromKey('aaa_bbb')
      expect(validTo).toBe(undefined)
    })
  })

  describe('createAccount', () => {
    it('creates account', async () => {
      const account = Utils.createAccount({ chainId: 'T' })

      expect(account.seed).toBeDefined()
      expect(account.privateKey).toBeDefined()
      expect(account.publicKey).toBeDefined()
      expect(account.address).toBeDefined()

      const address = Crypto.address(account.seed, 'T')
      expect(account.address).toBe(address)
    })
  })

  describe('waitForNBlocks', () => {
    it('waits for multiple blocks', async () => {
      const heights = [3, 2, 2, 1, 0]
      const mockFetchHeight = async () => heights.pop()!

      const start = Date.now()
      await Utils.waitForNBlocks(3, 50, { fetchHeight: mockFetchHeight })
      const diff = Date.now() - start

      expect(diff).toBeGreaterThanOrEqual(200)
      expect(diff).toBeLessThanOrEqual(250)
      expect(heights.length).toBe(0)
    })
  })

  describe('delay', () => {
    it('works', async () => {
      const start = Date.now()
      await Utils.delay(200)
      const diff = Date.now() - start

      expect(diff).toBeGreaterThanOrEqual(200)
      expect(diff).toBeLessThanOrEqual(220)
    })
  })

  describe('onBlockchainUpdate', () => {
    it('works', async () => {
      const heights = [4, 3, 2, 1, 0]
      const interval = 50
      const received: number[] = []

      const mockFetchHeight = async () => heights.pop()!

      const callback = async (height: number) => {
        received.push(height)
      }

      const promise = Utils.onBlockchainUpdate(callback, interval, {
        fetchHeight: mockFetchHeight,
        delay: helper.delay
      })

      await helper.delay((heights.length + 1) * interval)
      await promise.cancel()

      expect(received).toEqual([1, 2, 3, 4])
    })
  })
})
