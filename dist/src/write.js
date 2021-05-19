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
exports.setAlias = exports.transfer = exports.interactWithDeviceAs = exports.setScript = exports.insertData = exports.generateKey = exports.interactWithDevice = exports.transferKey = exports.broadcast = exports.waitForTx = exports.WVS = exports.FEE_MULTIPLIER = void 0;
const Transactions = __importStar(require("@waves/waves-transactions"));
exports.FEE_MULTIPLIER = 10 ** 5;
exports.WVS = 10 ** 8;
exports.waitForTx = Transactions.waitForTx;
const broadcast = async (tx, options, deps) => {
    const ttx = await Transactions.broadcast(tx, deps.nodeUrl);
    const wait = options.waitForTx === undefined ? true : options.waitForTx;
    if (wait) {
        await exports.waitForTx(ttx.id, { apiBase: deps.nodeUrl });
    }
    return ttx.id;
};
exports.broadcast = broadcast;
const transferKey = async (receiver, assetId, seed, options, deps) => {
    const params = {
        recipient: receiver,
        amount: 1,
        assetId,
        chainId: deps.chainId,
        fee: 5 * exports.FEE_MULTIPLIER
    };
    const tx = Transactions.transfer(params, seed);
    return await deps.broadcast(tx, options);
};
exports.transferKey = transferKey;
const interactWithDevice = async (key, dapp, action, seed, options, deps) => {
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
    return await deps.broadcast(tx, options);
};
exports.interactWithDevice = interactWithDevice;
const generateKey = async (device, validTo, seed, name = 'SmartKey', options, deps) => {
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
    return await deps.broadcast(tx, options);
};
exports.generateKey = generateKey;
const insertData = async (entries, seed, options, deps) => {
    const params = {
        data: entries,
        fee: 5 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.data(params, seed);
    return await deps.broadcast(tx, options);
};
exports.insertData = insertData;
const setScript = async (script, seed, options, deps) => {
    const params = {
        script,
        fee: 14 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.setScript(params, seed);
    return await deps.broadcast(tx, options);
};
exports.setScript = setScript;
const interactWithDeviceAs = async (key, dapp, action, seed, fromAddress, options, deps) => {
    const FUNC_NAME = 'deviceActionAs';
    const params = {
        dApp: dapp,
        call: {
            function: FUNC_NAME,
            args: [
                { type: 'string', value: key },
                { type: 'string', value: action },
                { type: 'string', value: fromAddress }
            ]
        },
        fee: 9 * exports.FEE_MULTIPLIER,
        chainId: deps.chainId
    };
    const tx = Transactions.invokeScript(params, seed);
    return await deps.broadcast(tx, options);
};
exports.interactWithDeviceAs = interactWithDeviceAs;
const transfer = async (receiver, amount, seed, options, deps) => {
    const params = {
        recipient: receiver,
        amount: Math.floor(amount * exports.WVS),
        chainId: deps.chainId,
        fee: 5 * exports.FEE_MULTIPLIER
    };
    const tx = Transactions.transfer(params, seed);
    return await deps.broadcast(tx, options);
};
exports.transfer = transfer;
const setAlias = async (alias, seed, options, deps) => {
    const params = {
        alias,
        chainId: deps.chainId,
        fee: 5 * exports.FEE_MULTIPLIER
    };
    const tx = Transactions.alias(params, seed);
    return await deps.broadcast(tx, options);
};
exports.setAlias = setAlias;
//# sourceMappingURL=write.js.map