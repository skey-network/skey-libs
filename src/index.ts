import * as Utils from './utils'
import * as Read from './read'
import * as Write from './write'
import * as Transactions from '@waves/waves-transactions'

export interface Config {
  nodeUrl: string
  chainId: string
}

export const getInstance = (config: Config) => {
  const request = (path: string) => Read.request(path, { baseUrl: config.nodeUrl })
  const fetchDataWithRegex = (regex: string, address: string) =>
    Read.fetchDataWithRegex(regex, address, { request })
  const fetchHeight = () => Read.fetchHeight({ request })
  const broadcast = (tx: Transactions.TTx) =>
    Write.broadcast(tx, { nodeUrl: config.nodeUrl })

  return {
    fetchHeight,
    fetchKeyOwner: (assetId: string, height: number) =>
      Read.fetchKeyOwner(assetId, height, { request }),
    extractValuesFromKey: Utils.extractValuesFromKey,
    request,
    fetchDataWithRegex,
    createAccount: () => Utils.createAccount({ chainId: config.chainId }),
    fetchDevices: (address: string) => Read.fetchDevices(address, { fetchDataWithRegex }),
    fetchKeyWhitelist: (address: string) =>
      Read.fetchKeyWhitellist(address, { fetchDataWithRegex }),
    waitForNBlocks: (amount: number, interval = 500) =>
      Utils.waitForNBlocks(amount, interval, { fetchHeight }),
    delay: Utils.delay,
    FEE_MULTIPLIER: Write.FEE_MULTIPLIER,
    WVS: Write.WVS,
    broadcast,
    transferKey: (receiver: string, assetId: string, seed: string) =>
      Write.transferKey(receiver, assetId, seed, { broadcast, chainId: config.chainId }),
    fetchDevice: (address: string) => Read.fetchDevice(address, { request }),
    interactWithDevice: (key: string, dapp: string, action: string, seed: string) =>
      Write.interactWithDevice(key, dapp, action, seed, {
        broadcast,
        chainId: config.chainId
      }),
    onBlockchainUpdate: (callback: (height: number) => any, interval = 500) =>
      Utils.onBlockchainUpdate(callback, interval, { fetchHeight, delay: Utils.delay }),
    generateKey: (device: string, validTo: number, seed: string, name = 'SmartKey') =>
      Write.generateKey(device, validTo, seed, name, {
        broadcast,
        chainId: config.chainId
      }),
    insertData: (entries: Entry[], seed: string) =>
      Write.insertData(entries, seed, { broadcast, chainId: config.chainId })
  }
}

export default { getInstance }
