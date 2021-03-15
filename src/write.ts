import * as Transactions from '@waves/waves-transactions'

export const FEE_MULTIPLIER = 10 ** 5
export const WVS = 10 ** 8

export type BroadcastDeps = { nodeUrl: string }
export const broadcast = async (tx: Transactions.TTx, deps: BroadcastDeps) => {
  const ttx = await Transactions.broadcast(tx, deps.nodeUrl)
  await Transactions.waitForTx(ttx.id, { apiBase: deps.nodeUrl })
  return ttx.id
}

export type TransferKeyDeps = {
  chainId: string
  broadcast: (tx: Transactions.TTx) => Promise<string>
}
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

export type InteractWithDeviceDeps = {
  chainId: string
  broadcast: (tx: Transactions.TTx) => Promise<string>
}
export const interactWithDevice = async (
  key: string,
  dapp: string,
  action: string,
  seed: string,
  deps: InteractWithDeviceDeps
) => {
  const params: Transactions.IInvokeScriptParams = {
    dApp: dapp,
    call: {
      function: 'deviceAction',
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
