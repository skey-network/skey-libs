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
exports.delay = exports.broadcast = exports.fund = exports.generateKey = exports.createAccount = exports.randomAssetId = exports.address = exports.config = void 0;
const Transactions = __importStar(require("@waves/waves-transactions"));
const Crypto = __importStar(require("@waves/ts-lib-crypto"));
exports.config = {
    nodeUrl: 'https://srv-de-1.testnet.node.smartkeyplatform.io',
    chainId: 'A',
    feeMultiplier: 10 ** 5,
    wvs: 10 ** 8,
    seed: 'furnace defy model disagree stick pepper pony angle avocado open still innocent blood room gun'
};
const address = () => {
    return Crypto.address(exports.config.seed, exports.config.chainId);
};
exports.address = address;
const randomAssetId = () => {
    return Crypto.address(Crypto.randomSeed(15), exports.config.chainId);
};
exports.randomAssetId = randomAssetId;
const createAccount = () => {
    const seed = Crypto.randomSeed(15);
    const address = Crypto.address(seed, exports.config.chainId);
    return { address, seed };
};
exports.createAccount = createAccount;
const generateKey = async (device, validTo, seed = exports.config.seed) => {
    const params = {
        decimals: 0,
        reissuable: false,
        name: 'smartkey',
        description: `${device}_${validTo}`,
        quantity: 1,
        chainId: exports.config.chainId,
        fee: 5 * exports.config.feeMultiplier
    };
    const tx = Transactions.issue(params, seed);
    return await exports.broadcast(tx);
};
exports.generateKey = generateKey;
const fund = async (address, amount = 0.1 * exports.config.wvs) => {
    const params = {
        recipient: address,
        amount,
        chainId: exports.config.chainId,
        fee: 5 * exports.config.feeMultiplier
    };
    const tx = Transactions.transfer(params, exports.config.seed);
    return await exports.broadcast(tx);
};
exports.fund = fund;
const broadcast = async (tx) => {
    const ttx = await Transactions.broadcast(tx, exports.config.nodeUrl);
    await Transactions.waitForTx(ttx.id, { apiBase: exports.config.nodeUrl });
    return ttx.id;
};
exports.broadcast = broadcast;
const delay = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
exports.delay = delay;
//# sourceMappingURL=helper.js.map