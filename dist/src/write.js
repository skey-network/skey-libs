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
exports.setScript = exports.insertData = exports.generateKey = exports.interactWithDevice = exports.transferKey = exports.broadcast = exports.WVS = exports.FEE_MULTIPLIER = void 0;
const Transactions = __importStar(require("@waves/waves-transactions"));
exports.FEE_MULTIPLIER = 10 ** 5;
exports.WVS = 10 ** 8;
const broadcast = async (tx, deps) => {
    const ttx = await Transactions.broadcast(tx, deps.nodeUrl);
    await Transactions.waitForTx(ttx.id, { apiBase: deps.nodeUrl });
    return ttx.id;
};
exports.broadcast = broadcast;
const transferKey = async (receiver, assetId, seed, deps) => {
    const params = {
        recipient: receiver,
        amount: 1,
        assetId,
        chainId: deps.chainId,
        fee: 5 * exports.FEE_MULTIPLIER
    };
    const tx = Transactions.transfer(params, seed);
    return await deps.broadcast(tx);
};
exports.transferKey = transferKey;
const interactWithDevice = async (key, dapp, action, seed, deps) => {
    const FUNC_NAME = 'deviceAction';
    const params = {
        dApp: dapp,
        call: {
            function: FUNC_NAME,
            args: [
                { type: 'string', value: key },
                { type: 'string', value: action }
            ]
        },
        fee: 9 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.invokeScript(params, seed);
    return await deps.broadcast(tx);
};
exports.interactWithDevice = interactWithDevice;
const generateKey = async (device, validTo, seed, name = 'SmartKey', deps) => {
    const params = {
        decimals: 0,
        reissuable: false,
        name,
        description: `${device}_${validTo}`,
        quantity: 1,
        chainId: deps.chainId,
        fee: 5 * exports.FEE_MULTIPLIER
    };
    const tx = Transactions.issue(params, seed);
    return await deps.broadcast(tx);
};
exports.generateKey = generateKey;
const insertData = async (entries, seed, deps) => {
    const params = {
        data: entries,
        fee: 5 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.data(params, seed);
    return await deps.broadcast(tx);
};
exports.insertData = insertData;
const setScript = async (script, seed, deps) => {
    const params = {
        script,
        fee: 14 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.setScript(params, seed);
    return await deps.broadcast(tx);
};
exports.setScript = setScript;
//# sourceMappingURL=write.js.map