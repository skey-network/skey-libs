import * as Read from '../src/read'
import * as helper from './helper'
import * as constants from '../src/constants'

describe('read', () => {
  describe('fetchKeyOwner', () => {
    it('works correctly', async () => {
      const mockRequest = async (_: string) => {
        return {
          items: {
            owner123123: 1
          }
        }
      }

      expect(await Read.fetchKeyOwner('', 1, { request: mockRequest })).toBe(
        'owner123123'
      )
    })

    it('owner not found', async () => {
      const mockRequest = async (_: string) => {
        return {
          items: {}
        }
      }

      expect(await Read.fetchKeyOwner('', 1, { request: mockRequest })).toBe(undefined)
    })

    it('calls correct path', async () => {
      let path = ''
      const mockRequest = async (p: string) => {
        path = p
        return {}
      }

      Read.fetchKeyOwner(':assetId', 0, { request: mockRequest })

      expect(path).toBe('/assets/:assetId/distribution/0/limit/1')
    })
  })

  describe('fetchKey', () => {
    it('calls correct path', async () => {
      const mockRequest = async (path: string) => {
        expect(path).toBe('/assets/details/aaa')
        return 10
      }

      const res = await Read.fetchKey('aaa', { request: mockRequest })
      expect(res).toBe(10)
    })
  })

  describe('request', () => {
    it('returns response', async () => {
      const { address } = helper.createAccount()
      const res = await Read.request(`/addresses/balance/${address}`, {
        baseUrl: helper.config.nodeUrl
      })
      expect(res.balance).toBe(0)
    })

    it('throws error', async () => {
      expect(() =>
        Read.request(`/addresses/balance/${123123123123}`, {
          baseUrl: helper.config.nodeUrl
        })
      ).rejects.toBeDefined()
    })

    it('no connection', async () => {
      expect(() =>
        Read.request('/dfdsfadfasdf', { baseUrl: helper.config.nodeUrl })
      ).rejects.toBeDefined()
    })
  })

  describe('fetchHeight', () => {
    it('returns height', async () => {
      const mockRequest = async () => ({ height: 50 })
      expect(await Read.fetchHeight({ request: mockRequest })).toBe(50)
    })

    it('calls correct path', async () => {
      let path = ''
      const mockRequest = async (p: string) => {
        path = p
        return { height: 0 }
      }

      Read.fetchHeight({ request: mockRequest })

      expect(path).toBe('/blocks/height')
    })
  })

  describe('fetchDataWithRegex', () => {
    it('calls corrent path', async () => {
      let path = ''
      const mockRequest = async (p: string) => {
        path = p
      }

      Read.fetchDataWithRegex('b', 'a', { request: mockRequest })

      expect(path).toBe('/addresses/data/a?matches=b')
    })
  })

  describe('fetchDevices', () => {
    it('works correctly', async () => {
      let [regex, address] = ['', '']

      const mockFetchDataWithRegex = async (r: string, a: string) => {
        regex = r
        address = a

        return [
          { key: 'device_aaa', value: 'active' },
          { key: 'device_bbb', value: 'active' }
        ]
      }

      const devices = await Read.fetchDevices('address', {
        fetchDataWithRegex: mockFetchDataWithRegex
      })

      expect(regex).toBe(constants.deviceRegex)
      expect(address).toBe('address')
      expect(devices[0]).toEqual({ address: 'aaa', status: 'active' })
      expect(devices[1]).toEqual({ address: 'bbb', status: 'active' })
    })
  })

  describe('fetchKeyWhitelist', () => {
    it('works correctly', async () => {
      const mockFetchDataWithRegex = async (regex: string, address: string) => {
        expect(regex).toBe(constants.keyRegex)
        expect(address).toBe('aaa')

        return [
          { key: 'key_aaa', value: 'active' },
          { key: 'key_bbb', value: 'active' }
        ]
      }

      const keys = await Read.fetchKeyWhitellist('aaa', {
        fetchDataWithRegex: mockFetchDataWithRegex
      })

      expect(keys[0]).toEqual({ assetId: 'aaa', status: 'active' })
      expect(keys[1]).toEqual({ assetId: 'bbb', status: 'active' })
    })
  })

  describe('fetchDevice', () => {
    it('retruns parsed data', async () => {
      const mockRequest = async (path: string) => {
        expect(/\/addresses\/data\/aaa/.test(path)).toBe(true)
        expect(/lat/.test(path)).toBe(true)
        expect(/name/.test(path)).toBe(true)

        return [
          { key: 'lat', value: '34.2' },
          { key: 'name', value: 'test' },
          { key: 'owner', value: 'owner' },
          { key: 'active', value: 'whatever' }
        ]
      }

      const device = await Read.fetchDevice('aaa', { request: mockRequest })

      expect(device.address).toBe('aaa')
      expect(device.location?.lat).toBe(34.2)
      expect(device.name).toBe('test')
      expect(device.owner).toBe('owner')
      expect(device.active).toBe(true)
      expect(device.description).toBe(undefined)
      expect(device.location?.alt).toBe(undefined)
    })
  })

  describe('fetchAliases', () => {
    it('returns aliases of account', async () => {
      const mockAddress = 'foobarbaz'
      const mockRequest = async (path: string) => {
        const pathRegex = new RegExp(`\/alias\/by-address\/${mockAddress}`)
        expect(pathRegex.test(path)).toBe(true)
        
        return [
          'foo',
          'bar',
          'foobarbaz'
        ]
      }

      const aliases = await Read.fetchAliases(mockAddress, { request: mockRequest })

      expect(aliases.length).toBe(3)

    })
  })
})
