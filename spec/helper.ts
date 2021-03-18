import * as Transactions from '@waves/waves-transactions'
import * as Crypto from '@waves/ts-lib-crypto'

export const config = {
  nodeUrl: 'https://srv-de-1.testnet.node.smartkeyplatform.io',
  chainId: 'A',
  feeMultiplier: 10 ** 5,
  wvs: 10 ** 8,
  seed:
    'furnace defy model disagree stick pepper pony angle avocado open still innocent blood room gun'
}

export const address = () => {
  return Crypto.address(config.seed, config.chainId)
}

export const randomAssetId = () => {
  return Crypto.address(Crypto.randomSeed(15), config.chainId)
}

export const createAccount = () => {
  const seed = Crypto.randomSeed(15)
  const address = Crypto.address(seed, config.chainId)
  return { address, seed }
}

export const generateKey = async (
  device: string,
  validTo: number,
  seed = config.seed
) => {
  const params: Transactions.IIssueParams = {
    decimals: 0,
    reissuable: false,
    name: 'smartkey',
    description: `${device}_${validTo}`,
    quantity: 1,
    chainId: config.chainId,
    fee: 5 * config.feeMultiplier
  }

  const tx = Transactions.issue(params, seed)
  return await broadcast(tx)
}

export const fund = async (address: string, amount = 0.1 * config.wvs) => {
  const params: Transactions.ITransferParams = {
    recipient: address,
    amount,
    chainId: config.chainId,
    fee: 5 * config.feeMultiplier
  }

  const tx = Transactions.transfer(params, config.seed)
  return await broadcast(tx)
}

export const broadcast = async (tx: Transactions.TTx) => {
  const ttx = await Transactions.broadcast(tx, config.nodeUrl)
  await Transactions.waitForTx(ttx.id, { apiBase: config.nodeUrl })
  return ttx.id
}

export const delay = (timeout: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
}
