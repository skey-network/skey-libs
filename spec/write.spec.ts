import * as Write from '../src/write'
import * as Transactions from '@waves/waves-transactions'
import * as Crypto from '@waves/ts-lib-crypto'
import * as helper from './helper'
import { TRANSACTION_TYPE } from '@waves/waves-transactions/dist/transactions'

describe('write', () => {
  describe('constants', () => {
    it('WVS', () => {
      expect(Write.WVS).toBe(10 ** 8)
    })

    it('FEE_MULTIPLIER', () => {
      expect(Write.FEE_MULTIPLIER).toBe(10 ** 5)
    })
  })

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

  describe('generateKey', () => {
    it('broadcast correct tx', async () => {
      const dapp = helper.createAccount()

      const mockBroadcast = async (tx: Transactions.TTx) => {
        const itx = tx as Transactions.IIssueTransaction

        expect(itx.chainId).toBe(helper.config.chainId.charCodeAt(0))
        expect(itx.fee).toBe(5 * helper.config.feeMultiplier)
        expect(itx.type).toBe(TRANSACTION_TYPE.ISSUE)
        expect(itx.proofs[0]).toBeDefined()
        expect(itx.senderPublicKey).toBe(Crypto.publicKey(dapp.seed))
        expect(itx.reissuable).toBe(false)
        expect(itx.quantity).toBe(1)
        expect(itx.decimals).toBe(0)
        expect(itx.name).toBe('SmartKey')
        expect(itx.description.split('_')[0]).toBe('aaa')
        expect(itx.description.split('_')[1]).toBe('111')

        return ''
      }

      await Write.generateKey('aaa', 111, dapp.seed, 'SmartKey', {
        broadcast: mockBroadcast,
        chainId: helper.config.chainId
      })
    })
  })

  describe('insertData', () => {
    it('broadcast correct tx', async () => {
      const dapp = helper.createAccount()

      const mockBroadcast = async (tx: Transactions.TTx) => {
        const dtx = tx as Transactions.IDataTransaction

        expect(dtx.chainId).toBe(helper.config.chainId.charCodeAt(0))
        expect(dtx.fee).toBe(5 * helper.config.feeMultiplier)
        expect(dtx.type).toBe(TRANSACTION_TYPE.DATA)
        expect(dtx.proofs[0]).toBeDefined()
        expect(dtx.senderPublicKey).toBe(Crypto.publicKey(dapp.seed))

        expect(dtx.data).toEqual([
          { type: 'integer', key: 'integer', value: 1 },
          { type: 'string', key: 'string', value: 'aaa' },
          { type: 'boolean', key: 'boolean', value: true }
        ])

        return ''
      }

      await Write.insertData(
        [
          { key: 'integer', value: 1 },
          { key: 'string', value: 'aaa' },
          { key: 'boolean', value: true }
        ],
        dapp.seed,
        {
          broadcast: mockBroadcast,
          chainId: helper.config.chainId
        }
      )
    })
  })
})