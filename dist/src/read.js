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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchScripts = exports.fetchAliases = exports.fetchKey = exports.fetchKeyWhitellist = exports.fetchDevices = exports.fetchDataWithRegex = exports.request = exports.fetchHeight = exports.fetchKeyOwner = exports.fetchDevice = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("./constants");
const constants = __importStar(require("../src/constants"));
const fetchDevice = async (address, deps) => {
    const query = constants_1.deviceFields.map((field) => `key=${field}&`).join('');
    const path = `/addresses/data/${address}?${query}`;
    const data = await deps.request(path);
    const obj = { address };
    for (const item of data) {
        if (item.key === 'lat' || item.key === 'lng' || item.key === 'alt') {
            obj[item.key] = Number(item.value);
        }
        else {
            obj[item.key] = item.value;
        }
    }
    obj.location = { lat: obj.lat, lng: obj.lng, alt: obj.alt };
    delete obj.lat;
    delete obj.lng;
    delete obj.alt;
    // TODO Remove later
    obj.active = true;
    obj.connected = true;
    return obj;
};
exports.fetchDevice = fetchDevice;
const fetchKeyOwner = async (assetId, height, deps) => {
    const path = `/assets/${assetId}/distribution/${height}/limit/${1}`;
    const data = await deps.request(path);
    if (!data.items)
        return undefined;
    const owner = Object.keys(data.items)[0];
    if (data.items[owner] !== 1) {
        return undefined;
    }
    return owner;
};
exports.fetchKeyOwner = fetchKeyOwner;
const fetchHeight = async (deps) => {
    const path = '/blocks/height';
    const res = await deps.request(path);
    return res.height;
};
exports.fetchHeight = fetchHeight;
const request = async (path, deps) => {
    const url = `${deps.baseUrl}${path}`;
    try {
        const res = await node_fetch_1.default(url);
        if (res.status !== 200) {
            throw new Error(`Error while fetching data from blockchain. Request to ${deps.baseUrl}${path} got ${res.status}`);
        }
        return await res.json();
    }
    catch {
        throw new Error(`Error while fetching data from blockchain. Request to ${deps.baseUrl}${path} cannot connect`);
    }
};
exports.request = request;
const fetchDataWithRegex = async (regex, address, deps) => {
    const path = `/addresses/data/${address}?matches=${encodeURI(regex)}`;
    const res = await deps.request(path);
    return res;
};
exports.fetchDataWithRegex = fetchDataWithRegex;
const fetchDevices = async (address, deps) => {
    const entries = await deps.fetchDataWithRegex(constants.deviceRegex, address);
    return entries.map((entry) => ({
        address: entry.key.replace('device_', ''),
        status: entry.value
    }));
};
exports.fetchDevices = fetchDevices;
const fetchKeyWhitellist = async (address, deps) => {
    const entries = await deps.fetchDataWithRegex(constants.keyRegex, address);
    return entries.map((entry) => ({
        assetId: entry.key.replace('key_', ''),
        status: entry.value
    }));
};
exports.fetchKeyWhitellist = fetchKeyWhitellist;
const fetchKey = async (assetId, deps) => {
    const path = `/assets/details/${assetId}`;
    return await deps.request(path);
};
exports.fetchKey = fetchKey;
const fetchAliases = async (address, deps) => {
    const path = `/alias/by-address/${address}`;
    return await deps.request(path);
};
exports.fetchAliases = fetchAliases;
const fetchScripts = async () => {
    const url = 'https://raw.githubusercontent.com/skey-network/skey-client-config/master/dapps.json';
    const res = await node_fetch_1.default(url);
    const body = await res.json();
    const scripts = await body.scripts;
    await Promise.all(Object.entries(scripts).map(async ([key, val]) => {
        const scriptRes = await node_fetch_1.default(val.url);
        const scriptBody = await scriptRes.text();
        scripts[key].raw = scriptBody;
    }));
    return scripts;
};
exports.fetchScripts = fetchScripts;
//# sourceMappingURL=read.js.map