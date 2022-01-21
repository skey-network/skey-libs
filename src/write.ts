import { Entry } from './types'
import * as Transactions from '@waves/waves-transactions'

export const FEE_MULTIPLIER = 10 ** 5
export const WVS = 10 ** 8

type TxDeps = {
  chainId: string
  broadcast: (tx: Transactions.TTx, options?: TxOptions) => Promise<string>
}

export type TxOptions = {
  waitForTx?: boolean
}

export const waitForTx = Transactions.waitForTx

export type BroadcastDeps = { nodeUrl: string }
export const broadcast = async (
  tx: Transactions.TTx,
  options: TxOptions,
  deps: BroadcastDeps
) => {
  const ttx = await Transactions.broadcast(tx, deps.nodeUrl)
  const wait = options.waitForTx === undefined ? true : options.waitForTx

  if (wait) {
    await waitForTx(ttx.id, { apiBase: deps.nodeUrl })
  }

  return ttx.id
}

export type TransferKeyDeps = TxDeps
export const transferKey = async (
  receiver: string,
  assetId: string,
  seed: string,
  options: TxOptions,
  deps: TransferKeyDeps
) => {
  const params: Transactions.ITransferParams = {
    recipient: receiver,
    amount: 1,
    assetId,
    chainId: deps.chainId,
    fee: 5 * FEE_MULTIPLIER
  }

  const tx = Transactions.transfer(params, seed)
  return await deps.broadcast(tx, options)
}

export type InteractWithDeviceDeps = TxDeps
export const interactWithDevice = async (
  key: string,
  dapp: string,
  action: string,
  seed: string,
  options: TxOptions,
  deps: InteractWithDeviceDeps
) => {
  const FUNC_NAME = 'deviceAction'

  const params: Transactions.IInvokeScriptParams = {
    dApp: dapp,
    call: {
      function: FUNC_NAME,
      args: [
        { type: 'string', value: key },
        { type: 'string', value: action }
      ]
    },
    fee: 9 * FEE_MULTIPLIER,
    chainId: deps.chainId
  }

  const tx = Transactions.invokeScript(params, seed)
  return await deps.broadcast(tx, options)
}

export type GenerateKeyDeps = TxDeps
export const generateKey = async (
  device: string,
  validTo: number,
  seed: string,
  name = 'SmartKey',
  options: TxOptions,
  deps: GenerateKeyDeps
) => {
  const params: Transactions.IIssueParams = {
    decimals: 0,
    reissuable: false,
    name,
    description: `${device}_${validTo}`,
    quantity: 1,
    chainId: deps.chainId,
    fee: 5 * FEE_MULTIPLIER
  }

  const tx = Transactions.issue(params, seed)
  return await deps.broadcast(tx, options)
}

export type InsertDataDeps = TxDeps
export const insertData = async (
  entries: Entry[],
  seed: string,
  options: TxOptions,
  deps: InsertDataDeps
) => {
  const params: Transactions.IDataParams = {
    data: entries as any,
    fee: 5 * FEE_MULTIPLIER,
    chainId: deps.chainId
  }

  const tx = Transactions.data(params, seed)
  return await deps.broadcast(tx, options)
}

export type SetScriptDeps = TxDeps
export const setScript = async (
  script: string,
  seed: string,
  options: TxOptions,
  deps: SetScriptDeps
) => {
  const params: Transactions.ISetScriptParams = {
    script,
    fee: 14 * FEE_MULTIPLIER,
    chainId: deps.chainId
  }

  const tx = Transactions.setScript(params, seed)
  return await deps.broadcast(tx, options)
}

export type InteractWithDeviceAsDeps = TxDeps
export const interactWithDeviceAs = async (
  key: string,
  dapp: string,
  action: string,
  seed: string,
  fromAddress: string,
  options: TxOptions,
  deps: InteractWithDeviceDeps
) => {
  const FUNC_NAME = 'deviceActionAs'

  const params: Transactions.IInvokeScriptParams = {
    dApp: dapp,
    call: {
      function: FUNC_NAME,
      args: [
        { type: 'string', value: key },
        { type: 'string', value: action },
        { type: 'string', value: fromAddress }
      ]
    },
    fee: 9 * FEE_MULTIPLIER,
    chainId: deps.chainId
  }

  const tx = Transactions.invokeScript(params, seed)
  return await deps.broadcast(tx, options)
}

export type TransferDeps = TxDeps
export const transfer = async (
  receiver: string,
  amount: number,
  seed: string,
  options: TxOptions,
  deps: TransferKeyDeps
) => {
  const params: Transactions.ITransferParams = {
    recipient: receiver,
    amount: Math.floor(amount * WVS),
    chainId: deps.chainId,
    fee: 5 * FEE_MULTIPLIER
  }

  const tx = Transactions.transfer(params, seed)
  return await deps.broadcast(tx, options)
}

export type SetAliasDeps = TxDeps
export const setAlias = async (
  alias: string,
  seed: string,
  options: TxOptions,
  deps: SetAliasDeps
) => {
  const params: Transactions.IAliasParams = {
    alias,
    chainId: deps.chainId,
    fee: 5 * FEE_MULTIPLIER
  }

  const tx = Transactions.alias(params, seed)
  return await deps.broadcast(tx, options)
}
