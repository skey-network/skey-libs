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
exports.getInstance = void 0;
const Utils = __importStar(require("./utils"));
const Read = __importStar(require("./read"));
const Write = __importStar(require("./write"));
const getInstance = (config) => {
    const request = (path) => Read.request(path, { baseUrl: config.nodeUrl });
    const fetchDataWithRegex = (regex, address) => Read.fetchDataWithRegex(regex, address, { request });
    const fetchHeight = () => Read.fetchHeight({ request });
    const broadcast = (tx, options) => Write.broadcast(tx, (options = {}), { nodeUrl: config.nodeUrl });
    return {
        fetchHeight,
        fetchKeyOwner: (assetId, height) => Read.fetchKeyOwner(assetId, height, { request }),
        extractValuesFromKey: Utils.extractValuesFromKey,
        request,
        fetchDataWithRegex,
        createAccount: () => Utils.createAccount({ chainId: config.chainId }),
        fetchDevices: (address) => Read.fetchDevices(address, { fetchDataWithRegex }),
        fetchKeyWhitelist: (address) => Read.fetchKeyWhitellist(address, { fetchDataWithRegex }),
        waitForNBlocks: (amount, interval = 500) => Utils.waitForNBlocks(amount, interval, { fetchHeight }),
        delay: Utils.delay,
        FEE_MULTIPLIER: Write.FEE_MULTIPLIER,
        WVS: Write.WVS,
        broadcast,
        transferKey: (receiver, assetId, seed, options = {}) => Write.transferKey(receiver, assetId, seed, options, {
            broadcast,
            chainId: config.chainId
        }),
        fetchDevice: (address) => Read.fetchDevice(address, { request }),
        interactWithDevice: (key, dapp, action, seed, options = {}) => Write.interactWithDevice(key, dapp, action, seed, options, {
            broadcast,
            chainId: config.chainId
        }),
        onBlockchainUpdate: (callback, interval = 500) => Utils.onBlockchainUpdate(callback, interval, { fetchHeight, delay: Utils.delay }),
        generateKey: (device, validTo, seed, name = 'SmartKey', options = {}) => Write.generateKey(device, validTo, seed, name, options, {
            broadcast,
            chainId: config.chainId
        }),
        insertData: (entries, seed, options = {}) => Write.insertData(entries, seed, options, { broadcast, chainId: config.chainId }),
        setScript: (script, seed, options = {}) => Write.setScript(script, seed, options, { broadcast, chainId: config.chainId }),
        interactWithDeviceAs: (key, dapp, action, seed, fromAddress, options = {}) => Write.interactWithDeviceAs(key, dapp, action, seed, fromAddress, options, {
            broadcast,
            chainId: config.chainId
        }),
        fetchKey: (assetId) => Read.fetchKey(assetId, { request }),
        transfer: (receiver, amount, seed, options = {}) => Write.transfer(receiver, amount, seed, options, {
            broadcast,
            chainId: config.chainId
        }),
        setAlias: (alias, seed, options = {}) => Write.setAlias(alias, seed, options, {
            broadcast,
            chainId: config.chainId
        }),
        fetchAliases: (account) => Read.fetchAliases(account, { request }),
        findAddressByAlias: (alias) => Read.findAddressByAlias(alias, { request }),
        fetchScripts: () => {
            return Read.fetchScripts();
        }
    };
};
exports.getInstance = getInstance;
exports.default = { getInstance: exports.getInstance };
//# sourceMappingURL=index.js.map