import './types'
import * as Utils from './utils'
import * as Read from './read'
import * as Write from './write'
import * as Transactions from '@waves/waves-transactions'
import { Readable } from 'stream'

export interface Config {
  nodeUrl: string
  chainId: string
}

export const getInstance = (config: Config) => {
  const request = (path: string) => Read.request(path, { baseUrl: config.nodeUrl })
  const fetchDataWithRegex = (regex: string, address: string) =>
    Read.fetchDataWithRegex(regex, address, { request })
  const fetchHeight = () => Read.fetchHeight({ request })
  const broadcast = (tx: Transactions.TTx, options?: Write.TxOptions) =>
    Write.broadcast(tx, (options = {}), { nodeUrl: config.nodeUrl })

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
    transferKey: (
      receiver: string,
      assetId: string,
      seed: string,
      options: Write.TxOptions = {}
    ) =>
      Write.transferKey(receiver, assetId, seed, options, {
        broadcast,
        chainId: config.chainId
      }),
    fetchDevice: (address: string) => Read.fetchDevice(address, { request }),
    interactWithDevice: (
      key: string,
      dapp: string,
      action: string,
      seed: string,
      options: Write.TxOptions = {}
    ) =>
      Write.interactWithDevice(key, dapp, action, seed, options, {
        broadcast,
        chainId: config.chainId
      }),
    onBlockchainUpdate: (callback: (height: number) => any, interval = 500) =>
      Utils.onBlockchainUpdate(callback, interval, { fetchHeight, delay: Utils.delay }),
    generateKey: (
      device: string,
      validTo: number,
      seed: string,
      name = 'SmartKey',
      options: Write.TxOptions = {}
    ) =>
      Write.generateKey(device, validTo, seed, name, options, {
        broadcast,
        chainId: config.chainId
      }),
    insertData: (entries: Entry[], seed: string, options: Write.TxOptions = {}) =>
      Write.insertData(entries, seed, options, { broadcast, chainId: config.chainId }),
    setScript: (script: string, seed: string, options: Write.TxOptions = {}) =>
      Write.setScript(script, seed, options, { broadcast, chainId: config.chainId }),
    interactWithDeviceAs: (
      key: string,
      dapp: string,
      action: string,
      seed: string,
      fromAddress: string,
      options: Write.TxOptions = {}
    ) =>
      Write.interactWithDeviceAs(key, dapp, action, seed, fromAddress, options, {
        broadcast,
        chainId: config.chainId
      }),
    fetchKey: (assetId: string) => Read.fetchKey(assetId, { request }),
    transfer: (
      receiver: string,
      amount: number,
      seed: string,
      options: Write.TxOptions = {}
    ) =>
      Write.transfer(receiver, amount, seed, options, {
        broadcast,
        chainId: config.chainId
      }),
    setAlias: (alias: string, seed: string, options: Write.TxOptions = {}) =>
      Write.setAlias(alias, seed, options, {
        broadcast,
        chainId: config.chainId
      }),
    fetchAliases: (account: string) => {
      return Read.fetchAliases(account, { request })
    },
    fetchScripts: () => {
      return Read.fetchScripts()
    }
  }
}

export default { getInstance }
