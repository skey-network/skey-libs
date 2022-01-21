import * as Transactions from '@waves/waves-transactions'

import * as Write from './write'
import * as Read from './read'

export interface Device {
  address: string
  name?: string
  description?: string
  lat?: number
  lng?: number
  alt?: number
  type?: string
  dapp?: string
  supplier?: string
  owner?: string
  active?: boolean
  connected?: boolean
  visible?: boolean
}

export interface Key {
  assetId: string
  name: string
  device: string
  owner: string
  issuer: string
  validTo: number
  issueTimestamp: number
  active: boolean
}

export type Entry = BinaryEntry | BooleanEntry | DeleteEntry | IntegerEntry | StringEntry

export interface BinaryEntry {
  key: string
  type?: 'binary'
  value: string
}

export interface BooleanEntry {
  key: string
  type?: 'boolean'
  value: boolean
}

export interface DataEntry {
  type?: 'integer' | 'boolean' | 'binary' | 'string'
  key: string
  /** integer/boolean/binary/string value */
  value: { [key: string]: any }
}

export interface DeleteEntry {
  key: string
  /** null for entry deletion */
  value: { [key: string]: any }
}

export interface IntegerEntry {
  key: string
  type?: 'integer'
  value: number
}

export interface StringEntry {
  key: string
  type?: 'string'
  value: string
}

export interface Account {
  seed: string
  publicKey: string
  privateKey: string
  address: string
}

export interface SkeyInstance {
  fetchHeight: () => Promise<number>
  fetchKeyOwner: (assetId: string, height: number) => Promise<string | undefined>
  extractValuesFromKey: (description: string) => {
    device?: string | undefined
    validTo?: number | undefined
  }
  request: (path: string) => Promise<any>
  fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>
  createAccount: () => Account
  fetchDevices: (address: string) => Promise<{ address: string; status: string }[]>
  fetchKeyWhitelist: (address: string) => Promise<{ assetId: string; status: string }[]>
  waitForNBlocks: (amount: number, interval?: number) => Promise<void>
  delay: (timeout: number) => Promise<any>
  FEE_MULTIPLIER: number
  WVS: number
  broadcast: (tx: Transactions.TTx, options?: Write.TxOptions) => Promise<string>
  transferKey: (
    receiver: string,
    assetId: string,
    seed: string,
    options?: Write.TxOptions
  ) => Promise<string>
  fetchDevice: (address: string) => Promise<Device>
  interactWithDevice: (
    key: string,
    dapp: string,
    action: string,
    seed: string,
    options?: Write.TxOptions
  ) => Promise<string>
  onBlockchainUpdate: (
    callback: (height: number) => any,
    interval: number
  ) => Promise<void> & { cancel: () => Promise<void> }
  generateKey: (
    device: string,
    validTo: number,
    seed: string,
    name?: string,
    options?: Write.TxOptions
  ) => Promise<string>
  insertData: (
    entries: Entry[],
    seed: string,
    options?: Write.TxOptions
  ) => Promise<string>
  setScript: (script: string, seed: string, options?: Write.TxOptions) => Promise<string>
  interactWithDeviceAs: (
    key: string,
    dapp: string,
    action: string,
    seed: string,
    fromAddress: string,
    options?: Write.TxOptions
  ) => Promise<string>
  fetchKey: (assetId: string) => Promise<any>
  transfer: (
    receiver: string,
    amount: number,
    seed: string,
    options?: Write.TxOptions
  ) => Promise<string>
  setAlias: (alias: string, seed: string, options?: Write.TxOptions) => Promise<string>
  fetchAliases: (account: string) => Promise<string[]>
  findAddressByAlias: (address: string) => Promise<any>
  fetchScripts: () => Promise<Read.DappScripts>
}
