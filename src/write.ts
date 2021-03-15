import * as Transactions from '@waves/waves-transactions'

export const FEE_MULTIPLIER = 10 ** 5
export const WVS = 10 ** 8

type TxDeps = {
  chainId: string
  broadcast: (tx: Transactions.TTx) => Promise<string>
}

export type BroadcastDeps = { nodeUrl: string }
export const broadcast = async (tx: Transactions.TTx, deps: BroadcastDeps) => {
  const ttx = await Transactions.broadcast(tx, deps.nodeUrl)
  await Transactions.waitForTx(ttx.id, { apiBase: deps.nodeUrl })
  return ttx.id
}

export type TransferKeyDeps = TxDeps
export const transferKey = async (
  receiver: string,
  assetId: string,
  seed: string,
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
  return await deps.broadcast(tx)
}

export type InteractWithDeviceDeps = TxDeps
export const interactWithDevice = async (
  key: string,
  dapp: string,
  action: string,
  seed: string,
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
  return await deps.broadcast(tx)
}

export type GenerateKeyDeps = TxDeps
export const generateKey = async (
  device: string,
  validTo: number,
  seed: string,
  name = 'SmartKey',
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
  return await deps.broadcast(tx)
}

export type InsertDataDeps = TxDeps
export const insertData = async (
  entries: Entry[],
  seed: string,
  deps: InsertDataDeps
) => {
  const params: Transactions.IDataParams = {
    data: entries as any,
    fee: 5 * FEE_MULTIPLIER,
    chainId: deps.chainId
  }

  const tx = Transactions.data(params, seed)
  return await deps.broadcast(tx)
}