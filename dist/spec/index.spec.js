"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const fs_1 = require("fs");
const lib = index_1.getInstance({ nodeUrl: '', chainId: '' });
describe('index', () => {
    it('contains all utility funcions', async () => {
        expect(lib.createAccount).toBeDefined();
        expect(lib.extractValuesFromKey).toBeDefined();
        expect(lib.fetchKeyOwner).toBeDefined();
        expect(lib.fetchHeight).toBeDefined();
        expect(lib.fetchDataWithRegex).toBeDefined();
        expect(lib.fetchDevices).toBeDefined();
        expect(lib.request).toBeDefined();
        expect(lib.fetchKeyWhitelist).toBeDefined();
        expect(lib.waitForNBlocks).toBeDefined();
        expect(lib.delay).toBeDefined();
        expect(lib.broadcast).toBeDefined();
        expect(lib.transferKey).toBeDefined();
        expect(lib.WVS).toBeDefined();
        expect(lib.FEE_MULTIPLIER).toBeDefined();
        expect(lib.fetchDevice).toBeDefined();
        expect(lib.interactWithDevice).toBeDefined();
        expect(lib.onBlockchainUpdate).toBeDefined();
        expect(lib.generateKey).toBeDefined();
        expect(lib.insertData).toBeDefined();
        expect(lib.setScript).toBeDefined();
        expect(lib.interactWithDeviceAs).toBeDefined();
        expect(lib.fetchKey).toBeDefined();
        expect(lib.transfer).toBeDefined();
        expect(lib.setAlias).toBeDefined();
        expect(lib.fetchAliases).toBeDefined();
        expect(lib.findAddressByAlias).toBeDefined();
    });
    it('contains exact number of properties', async () => {
        const EXPECTED = 26;
        const no = Object.keys(lib).length;
        expect(no).toBe(EXPECTED);
    });
    it('is documented', async () => {
        const docs = fs_1.readFileSync('./README.md').toString();
        const prefix = '### **';
        const suffix = '**';
        Object.keys(lib).forEach((identifier) => {
            const search = `${prefix}${identifier}${suffix}`;
            const exists = docs.includes(search);
            if (!exists)
                throw new Error(`${identifier} is not documented`);
            expect(exists).toBe(true);
        });
    });
});
//# sourceMappingURL=index.spec.js.map