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
exports.onBlockchainUpdate = exports.delay = exports.waitForNBlocks = exports.createAccount = exports.extractValuesFromKey = void 0;
const Crypto = __importStar(require("@waves/ts-lib-crypto"));
const extractValuesFromKey = (description) => {
    if (!description)
        return { device: undefined, validTo: undefined };
    const values = description.split('_');
    const validTo = Number(values[1]);
    return { device: values[0], validTo: isNaN(validTo) ? undefined : validTo };
};
exports.extractValuesFromKey = extractValuesFromKey;
const createAccount = (deps) => {
    const seed = Crypto.randomSeed(15);
    const privateKey = Crypto.privateKey(seed);
    const publicKey = Crypto.publicKey({ privateKey });
    const address = Crypto.address({ publicKey }, deps.chainId);
    return { seed, privateKey, publicKey, address };
};
exports.createAccount = createAccount;
const waitForNBlocks = (amount, interval = 500, deps) => {
    return new Promise(async (resolve) => {
        let initialHeight = await deps.fetchHeight();
        const handle = setInterval(async () => {
            const currentHeight = await deps.fetchHeight();
            if (currentHeight - initialHeight !== amount)
                return;
            clearInterval(handle);
            resolve();
        }, interval);
    });
};
exports.waitForNBlocks = waitForNBlocks;
const delay = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
exports.delay = delay;
const onBlockchainUpdate = (callback, interval = 500, deps) => {
    let stop = false;
    const promise = new Promise(async (resolve) => {
        let lastHeight = await deps.fetchHeight();
        const handle = setInterval(async () => {
            if (stop) {
                clearInterval(handle);
                resolve();
                return;
            }
            const currentHeight = await deps.fetchHeight();
            if (currentHeight === lastHeight)
                return;
            const amount = currentHeight - lastHeight;
            const heights = Array(amount)
                .fill(null)
                .map((_, index) => index + lastHeight + 1);
            lastHeight = currentHeight;
            for (const height of heights) {
                await callback(height);
            }
        }, interval);
    });
    return Object.assign(promise, {
        cancel: async () => {
            stop = true;
            await deps.delay(interval);
        }
    });
};
exports.onBlockchainUpdate = onBlockchainUpdate;
//# sourceMappingURL=utils.js.map