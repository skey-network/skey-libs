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
const helper = __importStar(require("./helper"));
const index_1 = require("../src/index");
const constants = __importStar(require("../src/constants"));
const fs_1 = require("fs");
// createAccount            DONE
// extractValuesFromKey     DONE
// fetchKeyOwner            DONE
// fetchHeight              DONE
// fetchDataWithRegex       DONE
// fetchDevices             DONE
// request                  DONE
// fetchKeyWhitelist        DONE
// waitForNBlocks           DONE
// delay                    DONE
// broadcast                DONE
// transferKey              DONE
// fetchDevice              DONE
// interactWithDevice       DONE
// setScript                DONE
// onBlockchainUpdate       DONE
// generateKey              DONE
// insertData               DONE
// interactWithDeviceAs     DONE
// transfer                 DONE
// setAsset                 DONE
// fetchAssets              DONE
const ctx = {
    dapp: {
        address: '',
        seed: ''
    },
    device: {
        address: '',
        seed: ''
    },
    user: {
        address: '',
        seed: ''
    },
    org: {
        address: '',
        seed: ''
    },
    key: {
        assetId: '',
        device: '',
        validTo: 999999999999999
    }
};
const { nodeUrl, chainId } = helper.config;
const lib = index_1.getInstance({ nodeUrl, chainId });
const alias = 'test_dapp_' + Math.random().toString(36).substring(5);
describe('e2e', () => {
    it('creates accounts', async () => {
        ctx.dapp = lib.createAccount();
        ctx.device = lib.createAccount();
        ctx.user = lib.createAccount();
        ctx.org = lib.createAccount();
        await Promise.all([
            helper.fund(ctx.dapp.address),
            helper.fund(ctx.device.address),
            helper.fund(ctx.user.address),
            helper.fund(ctx.org.address)
        ]);
    });
    it('transfer', async () => {
        await lib.transfer(ctx.user.address, 0.1, ctx.dapp.seed);
    });
    it('generateKey', async () => {
        ctx.key.device = ctx.device.address;
        ctx.key.assetId = await lib.generateKey(ctx.key.device, ctx.key.validTo, ctx.dapp.seed);
    });
    it('fetchKey', async () => {
        const res = await lib.fetchKey(ctx.key.assetId);
        expect(res.assetId).toBe(ctx.key.assetId);
        expect(res.issuer).toBe(ctx.dapp.address);
    });
    it('transferKey', async () => {
        await lib.transferKey(ctx.user.address, ctx.key.assetId, ctx.dapp.seed);
    });
    it('extract values from key', async () => {
        const itx = await lib.request(`/assets/details/${ctx.key.assetId}`);
        const values = lib.extractValuesFromKey(itx.description);
        expect(values.device).toBe(ctx.key.device);
        expect(values.validTo).toBe(ctx.key.validTo);
    });
    it('onBlockchainUpdate', async () => {
        const heights = [];
        const promise = lib.onBlockchainUpdate((height) => heights.push(height), 200);
        await lib.waitForNBlocks(2);
        await promise.cancel();
        // TODO Promise leaking?
        await lib.delay(500);
        expect(heights[0]).toBeGreaterThanOrEqual(0);
        expect(heights[1]).toBeGreaterThanOrEqual(0);
        expect(heights[1]).toBeGreaterThan(heights[0]);
        expect(heights.length).toBe(2);
    });
    it('check key owner', async () => {
        // should be at least one block after transfer
        const height = await lib.fetchHeight();
        const owner = await lib.fetchKeyOwner(ctx.key.assetId, height - 1);
        expect(owner).toBe(ctx.user.address);
    });
    it('fetchKeyWhitelist', async () => {
        const keys = [helper.randomAssetId(), helper.randomAssetId()];
        await lib.insertData([
            { key: `key_${keys[0]}`, value: 'active' },
            { key: `key_${keys[1]}`, value: 'active' }
        ], ctx.device.seed);
        const [fromWhitelist, fromRegex] = await Promise.all([
            lib.fetchKeyWhitelist(ctx.device.address),
            lib.fetchDataWithRegex(constants.keyRegex, ctx.device.address)
        ]);
        expect(fromWhitelist).toContainEqual({ assetId: keys[0], status: 'active' });
        expect(fromWhitelist).toContainEqual({ assetId: keys[1], status: 'active' });
        expect(fromRegex).toContainEqual({
            key: `key_${keys[0]}`,
            value: 'active',
            type: 'string'
        });
        expect(fromRegex).toContainEqual({
            key: `key_${keys[1]}`,
            value: 'active',
            type: 'string'
        });
    });
    it('fetchDevices', async () => {
        const devices = [helper.createAccount().address, helper.createAccount().address];
        await lib.insertData([
            { key: `device_${devices[0]}`, value: 'active' },
            { key: `device_${devices[1]}`, value: 'active' }
        ], ctx.dapp.seed);
        const result = await lib.fetchDevices(ctx.dapp.address);
        expect(result.map((x) => x.address)).toContain(devices[0]);
        expect(result.map((x) => x.address)).toContain(devices[1]);
    });
    it('fetchDevice', async () => {
        var _a;
        await lib.insertData([
            { key: 'name', value: 'Adam' },
            { key: 'active', value: true },
            { key: 'lat', value: '5.6345' },
            { key: `key_${ctx.key.assetId}`, value: 'active' }
        ], ctx.device.seed);
        const device = await lib.fetchDevice(ctx.device.address);
        expect(device.name).toBe('Adam');
        expect(device.active).toBe(true);
        expect((_a = device.location) === null || _a === void 0 ? void 0 : _a.lat).toBe(5.6345);
        expect(device[`key_${ctx.key.assetId}`]).toBeUndefined();
    });
    it('setScript', async () => {
        const script = fs_1.readFileSync('./spec/fixtures/dapp.base64.txt').toString();
        await lib.setScript(script, ctx.dapp.seed);
    });
    it('setAlias', async () => {
        await lib.setAlias(alias, ctx.dapp.seed);
    });
    it('findAddressByAlias', async () => {
        const res = await lib.findAddressByAlias(alias);
        expect(res.address).toBe(ctx.dapp.address);
    });
    it('fetchAliases', async () => {
        const res = await lib.fetchAliases(ctx.dapp.address);
        expect(res.length).toBe(1);
        expect(res[0]).toBe(`alias:${chainId}:${alias}`);
    });
    it('interactWithDevice', async () => {
        await lib.interactWithDevice(ctx.key.assetId, ctx.dapp.address, 'open', ctx.user.seed);
    });
    it('interactWithDeviceAs', async () => {
        await Promise.all([
            lib.insertData([{ key: `org_${ctx.org.address}`, value: 'active', type: 'string' }], ctx.dapp.seed),
            lib.insertData([{ key: `user_${ctx.user.address}`, value: 'active', type: 'string' }], ctx.org.seed),
            lib.transferKey(ctx.org.address, ctx.key.assetId, ctx.user.seed)
        ]);
        await lib.interactWithDeviceAs(ctx.key.assetId, ctx.dapp.address, 'open', ctx.user.seed, ctx.org.address);
    });
});
//# sourceMappingURL=e2e.spec.js.map