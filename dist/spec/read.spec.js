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
const Read = __importStar(require("../src/read"));
const helper = __importStar(require("./helper"));
const constants = __importStar(require("../src/constants"));
describe('read', () => {
    describe('fetchKeyOwner', () => {
        it('works correctly', async () => {
            const mockRequest = async (_) => {
                return {
                    items: {
                        owner123123: 1
                    }
                };
            };
            expect(await Read.fetchKeyOwner('', 1, { request: mockRequest })).toBe('owner123123');
        });
        it('owner not found', async () => {
            const mockRequest = async (_) => {
                return {
                    items: {}
                };
            };
            expect(await Read.fetchKeyOwner('', 1, { request: mockRequest })).toBe(undefined);
        });
        it('calls correct path', async () => {
            let path = '';
            const mockRequest = async (p) => {
                path = p;
                return {};
            };
            Read.fetchKeyOwner(':assetId', 0, { request: mockRequest });
            expect(path).toBe('/assets/:assetId/distribution/0/limit/1');
        });
    });
    describe('fetchKey', () => {
        it('calls correct path', async () => {
            const mockRequest = async (path) => {
                expect(path).toBe('/assets/details/aaa');
                return 10;
            };
            const res = await Read.fetchKey('aaa', { request: mockRequest });
            expect(res).toBe(10);
        });
    });
    describe('request', () => {
        it('returns response', async () => {
            const { address } = helper.createAccount();
            const res = await Read.request(`/addresses/balance/${address}`, {
                baseUrl: helper.config.nodeUrl
            });
            expect(res.balance).toBe(0);
        });
        it('throws error', async () => {
            expect(() => Read.request(`/addresses/balance/${123123123123}`, {
                baseUrl: helper.config.nodeUrl
            })).rejects.toBeDefined();
        });
        it('no connection', async () => {
            expect(() => Read.request('/dfdsfadfasdf', { baseUrl: helper.config.nodeUrl })).rejects.toBeDefined();
        });
    });
    describe('fetchHeight', () => {
        it('returns height', async () => {
            const mockRequest = async () => ({ height: 50 });
            expect(await Read.fetchHeight({ request: mockRequest })).toBe(50);
        });
        it('calls correct path', async () => {
            let path = '';
            const mockRequest = async (p) => {
                path = p;
                return { height: 0 };
            };
            Read.fetchHeight({ request: mockRequest });
            expect(path).toBe('/blocks/height');
        });
    });
    describe('fetchDataWithRegex', () => {
        it('calls corrent path', async () => {
            let path = '';
            const mockRequest = async (p) => {
                path = p;
            };
            Read.fetchDataWithRegex('b', 'a', { request: mockRequest });
            expect(path).toBe('/addresses/data/a?matches=b');
        });
    });
    describe('fetchDevices', () => {
        it('works correctly', async () => {
            let [regex, address] = ['', ''];
            const mockFetchDataWithRegex = async (r, a) => {
                regex = r;
                address = a;
                return [
                    { key: 'device_aaa', value: 'active' },
                    { key: 'device_bbb', value: 'active' }
                ];
            };
            const devices = await Read.fetchDevices('address', {
                fetchDataWithRegex: mockFetchDataWithRegex
            });
            expect(regex).toBe(constants.deviceRegex);
            expect(address).toBe('address');
            expect(devices[0]).toEqual({ address: 'aaa', status: 'active' });
            expect(devices[1]).toEqual({ address: 'bbb', status: 'active' });
        });
    });
    describe('fetchKeyWhitelist', () => {
        it('works correctly', async () => {
            const mockFetchDataWithRegex = async (regex, address) => {
                expect(regex).toBe(constants.keyRegex);
                expect(address).toBe('aaa');
                return [
                    { key: 'key_aaa', value: 'active' },
                    { key: 'key_bbb', value: 'active' }
                ];
            };
            const keys = await Read.fetchKeyWhitellist('aaa', {
                fetchDataWithRegex: mockFetchDataWithRegex
            });
            expect(keys[0]).toEqual({ assetId: 'aaa', status: 'active' });
            expect(keys[1]).toEqual({ assetId: 'bbb', status: 'active' });
        });
    });
    describe('fetchDevice', () => {
        it('retruns parsed data', async () => {
            var _a, _b;
            const mockRequest = async (path) => {
                expect(/\/addresses\/data\/aaa/.test(path)).toBe(true);
                expect(/lat/.test(path)).toBe(true);
                expect(/name/.test(path)).toBe(true);
                return [
                    { key: 'lat', value: '34.2' },
                    { key: 'name', value: 'test' },
                    { key: 'owner', value: 'owner' },
                    { key: 'active', value: 'whatever' }
                ];
            };
            const device = await Read.fetchDevice('aaa', { request: mockRequest });
            expect(device.address).toBe('aaa');
            expect((_a = device.location) === null || _a === void 0 ? void 0 : _a.lat).toBe(34.2);
            expect(device.name).toBe('test');
            expect(device.owner).toBe('owner');
            expect(device.active).toBe(true);
            expect(device.description).toBe(undefined);
            expect((_b = device.location) === null || _b === void 0 ? void 0 : _b.alt).toBe(undefined);
        });
    });
});
//# sourceMappingURL=read.spec.js.map