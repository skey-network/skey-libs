import * as Write from '../src/write'
import * as Transactions from '@waves/waves-transactions'
import * as Crypto from '@waves/ts-lib-crypto'
import * as helper from './helper'
import { TRANSACTION_TYPE } from '@waves/waves-transactions/dist/transactions'

describe('write', () => {
  describe('broadcast', () => {
    it('sends tx', async () => {
      const params: Transactions.ITransferParams = {
        recipient: helper.createAccount().address,
        amount: 100,
        chainId: helper.config.chainId,
        fee: 5 * helper.config.feeMultiplier
      }

      const tx = Transactions.transfer(params, helper.config.seed)
      const txHash = await Write.broadcast(tx, { nodeUrl: helper.config.nodeUrl })

      expect(typeof txHash).toBe('string')
    })
  })

  describe('transferKey', () => {
    it('broadcasts correct tx', async () => {
      const assetId = await helper.generateKey('aaa', 0)
      const receiver = helper.createAccount()
      const sender = helper.createAccount()

      const mockBroadcast = async (tx: Transactions.TTx) => {
        const ttx = tx as Transactions.ITransferTransaction

        expect(ttx.amount).toBe(1)
        expect(ttx.assetId).toBe(assetId)
        expect(ttx.recipient).toBe(receiver.address)
        expect(ttx.fee).toBe(5 * helper.config.feeMultiplier)
        expect(ttx.proofs[0]).toBeDefined()
        expect(ttx.type).toBe(TRANSACTION_TYPE.TRANSFER)
        expect(ttx.chainId).toBe(helper.config.chainId.charCodeAt(0))
        expect(ttx.senderPublicKey).toBe(Crypto.publicKey(sender.seed))

        return ''
      }

      await Write.transferKey(receiver.address, assetId, sender.seed, {
        broadcast: mockBroadcast,
        chainId: helper.config.chainId
      })
    })
  })

  describe('interactWithDevice', () => {
    it('broadcast correct tx', async () => {
      const dapp = helper.createAccount()
      const sender = helper.createAccount()

      const mockBroadcast = async (tx: Transactions.TTx) => {
        const itx = tx as Transactions.IInvokeScriptTransaction

        expect(itx.dApp).toBe(dapp.address)
        expect(itx.call?.function).toBe('deviceAction')
        expect(itx.call?.args[0]).toEqual({ type: 'string', value: 'key' })
        expect(itx.call?.args[1]).toEqual({ type: 'string', value: 'action' })
        expect(itx.chainId).toBe(helper.config.chainId.charCodeAt(0))
        expect(itx.fee).toBe(9 * helper.config.feeMultiplier)
        expect(itx.type).toBe(TRANSACTION_TYPE.INVOKE_SCRIPT)
        expect(itx.proofs[0]).toBeDefined()
        expect(itx.senderPublicKey).toBe(Crypto.publicKey(sender.seed))

        return ''
      }

      await Write.interactWithDevice('key', dapp.address, 'action', sender.seed, {
        broadcast: mockBroadcast,
        chainId: helper.config.chainId
      })
    })
  })
})
