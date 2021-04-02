"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Write = __importStar(require("../src/write"));
const Transactions = __importStar(require("@waves/waves-transactions"));
const Crypto = __importStar(require("@waves/ts-lib-crypto"));
const helper = __importStar(require("./helper"));
const transactions_1 = require("@waves/waves-transactions/dist/transactions");
const fs_1 = require("fs");
describe('write', () => {
    describe('constants', () => {
        it('WVS', () => {
            expect(Write.WVS).toBe(10 ** 8);
        });
        it('FEE_MULTIPLIER', () => {
            expect(Write.FEE_MULTIPLIER).toBe(10 ** 5);
        });
    });
    describe('broadcast', () => {
        it('sends tx', async () => {
            const params = {
                recipient: helper.createAccount().address,
                amount: 100,
                chainId: helper.config.chainId,
                fee: 5 * helper.config.feeMultiplier
            };
            const tx = Transactions.transfer(params, helper.config.seed);
            const txHash = await Write.broadcast(tx, {}, { nodeUrl: helper.config.nodeUrl });
            expect(typeof txHash).toBe('string');
        });
        it('does not wait for tx when specified', async () => {
            const params = {
                recipient: helper.createAccount().address,
                amount: 100,
                chainId: helper.config.chainId,
                fee: 5 * helper.config.feeMultiplier
            };
            const spy = jest.spyOn(Write, 'waitForTx');
            const tx = Transactions.transfer(params, helper.config.seed);
            const txHash = await Write.broadcast(tx, { waitForTx: false }, { nodeUrl: helper.config.nodeUrl });
            expect(typeof txHash).toBe('string');
            expect(spy).toHaveBeenCalledTimes(0);
        });
    });
    describe('transferKey', () => {
        it('broadcasts correct tx', async () => {
            const assetId = await helper.generateKey('aaa', 0);
            const receiver = helper.createAccount();
            const sender = helper.createAccount();
            const mockBroadcast = async (tx) => {
                const ttx = tx;
                expect(ttx.amount).toBe(1);
                expect(ttx.assetId).toBe(assetId);
                expect(ttx.recipient).toBe(receiver.address);
                expect(ttx.fee).toBe(5 * helper.config.feeMultiplier);
                expect(ttx.proofs[0]).toBeDefined();
                expect(ttx.type).toBe(transactions_1.TRANSACTION_TYPE.TRANSFER);
                expect(ttx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(ttx.senderPublicKey).toBe(Crypto.publicKey(sender.seed));
                return '';
            };
            await Write.transferKey(receiver.address, assetId, sender.seed, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('transfer', () => {
        it('broadcasts correct tx', async () => {
            const receiver = helper.createAccount();
            const sender = helper.createAccount();
            const mockBroadcast = async (tx) => {
                const ttx = tx;
                expect(ttx.amount).toBe(10000000000);
                expect(ttx.recipient).toBe(receiver.address);
                expect(ttx.fee).toBe(5 * helper.config.feeMultiplier);
                expect(ttx.proofs[0]).toBeDefined();
                expect(ttx.type).toBe(transactions_1.TRANSACTION_TYPE.TRANSFER);
                expect(ttx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(ttx.senderPublicKey).toBe(Crypto.publicKey(sender.seed));
                return '';
            };
            await Write.transfer(receiver.address, 100, sender.seed, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('interactWithDevice', () => {
        it('broadcast correct tx', async () => {
            const dapp = helper.createAccount();
            const sender = helper.createAccount();
            const mockBroadcast = async (tx) => {
                var _a, _b, _c;
                const itx = tx;
                expect(itx.dApp).toBe(dapp.address);
                expect((_a = itx.call) === null || _a === void 0 ? void 0 : _a.function).toBe('deviceAction');
                expect((_b = itx.call) === null || _b === void 0 ? void 0 : _b.args[0]).toEqual({ type: 'string', value: 'key' });
                expect((_c = itx.call) === null || _c === void 0 ? void 0 : _c.args[1]).toEqual({ type: 'string', value: 'action' });
                expect(itx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(itx.fee).toBe(9 * helper.config.feeMultiplier);
                expect(itx.type).toBe(transactions_1.TRANSACTION_TYPE.INVOKE_SCRIPT);
                expect(itx.proofs[0]).toBeDefined();
                expect(itx.senderPublicKey).toBe(Crypto.publicKey(sender.seed));
                return '';
            };
            await Write.interactWithDevice('key', dapp.address, 'action', sender.seed, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('interactWithDeviceAs', () => {
        it('broadcast correct tx', async () => {
            const dapp = helper.createAccount();
            const fromAddress = helper.createAccount();
            const sender = helper.createAccount();
            const mockBroadcast = async (tx) => {
                var _a, _b, _c, _d;
                const itx = tx;
                expect(itx.dApp).toBe(dapp.address);
                expect((_a = itx.call) === null || _a === void 0 ? void 0 : _a.function).toBe('deviceActionAs');
                expect((_b = itx.call) === null || _b === void 0 ? void 0 : _b.args[0]).toEqual({ type: 'string', value: 'key' });
                expect((_c = itx.call) === null || _c === void 0 ? void 0 : _c.args[1]).toEqual({ type: 'string', value: 'action' });
                expect((_d = itx.call) === null || _d === void 0 ? void 0 : _d.args[2]).toEqual({ type: 'string', value: fromAddress.address });
                expect(itx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(itx.fee).toBe(9 * helper.config.feeMultiplier);
                expect(itx.type).toBe(transactions_1.TRANSACTION_TYPE.INVOKE_SCRIPT);
                expect(itx.proofs[0]).toBeDefined();
                expect(itx.senderPublicKey).toBe(Crypto.publicKey(sender.seed));
                return '';
            };
            await Write.interactWithDeviceAs('key', dapp.address, 'action', sender.seed, fromAddress.address, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('generateKey', () => {
        it('broadcast correct tx', async () => {
            const dapp = helper.createAccount();
            const mockBroadcast = async (tx) => {
                const itx = tx;
                expect(itx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(itx.fee).toBe(5 * helper.config.feeMultiplier);
                expect(itx.type).toBe(transactions_1.TRANSACTION_TYPE.ISSUE);
                expect(itx.proofs[0]).toBeDefined();
                expect(itx.senderPublicKey).toBe(Crypto.publicKey(dapp.seed));
                expect(itx.reissuable).toBe(false);
                expect(itx.quantity).toBe(1);
                expect(itx.decimals).toBe(0);
                expect(itx.name).toBe('SmartKey');
                expect(itx.description.split('_')[0]).toBe('aaa');
                expect(itx.description.split('_')[1]).toBe('111');
                return '';
            };
            await Write.generateKey('aaa', 111, dapp.seed, 'SmartKey', {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('insertData', () => {
        it('broadcast correct tx', async () => {
            const dapp = helper.createAccount();
            const mockBroadcast = async (tx) => {
                const dtx = tx;
                expect(dtx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(dtx.fee).toBe(5 * helper.config.feeMultiplier);
                expect(dtx.type).toBe(transactions_1.TRANSACTION_TYPE.DATA);
                expect(dtx.proofs[0]).toBeDefined();
                expect(dtx.senderPublicKey).toBe(Crypto.publicKey(dapp.seed));
                expect(dtx.data).toEqual([
                    { type: 'integer', key: 'integer', value: 1 },
                    { type: 'string', key: 'string', value: 'aaa' },
                    { type: 'boolean', key: 'boolean', value: true }
                ]);
                return '';
            };
            await Write.insertData([
                { key: 'integer', value: 1 },
                { key: 'string', value: 'aaa' },
                { key: 'boolean', value: true }
            ], dapp.seed, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
    describe('setScript', () => {
        it('broadcast correct tx', async () => {
            const dapp = helper.createAccount();
            const script = fs_1.readFileSync('./spec/fixtures/dapp.base64.txt').toString();
            const mockBroadcast = async (tx) => {
                var _a;
                const stx = tx;
                expect(stx.chainId).toBe(helper.config.chainId.charCodeAt(0));
                expect(stx.fee).toBe(14 * helper.config.feeMultiplier);
                expect(stx.type).toBe(transactions_1.TRANSACTION_TYPE.SET_SCRIPT);
                expect(stx.proofs[0]).toBeDefined();
                expect(stx.senderPublicKey).toBe(Crypto.publicKey(dapp.seed));
                expect((_a = stx.script) === null || _a === void 0 ? void 0 : _a.replace('base64:', '')).toBe(script);
                return '';
            };
            await Write.setScript(script, dapp.seed, {}, {
                broadcast: mockBroadcast,
                chainId: helper.config.chainId
            });
        });
    });
});
//# sourceMappingURL=write.spec.js.map