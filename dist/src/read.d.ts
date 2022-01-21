import { Device, Entry } from './types';
declare type WithRequest = {
    request: (path: string) => Promise<any>;
};
export declare type FetchDeviceDeps = WithRequest;
export declare const fetchDevice: (address: string, deps: FetchDeviceDeps) => Promise<Device>;
export declare type FetchKeyOwnerDeps = WithRequest;
export declare const fetchKeyOwner: (assetId: string, height: number, deps: FetchKeyOwnerDeps) => Promise<string | undefined>;
export declare type FetchHeightDeps = WithRequest;
export declare const fetchHeight: (deps: FetchHeightDeps) => Promise<number>;
export declare type RequestDeps = {
    baseUrl: string;
};
export declare const request: (path: string, deps: RequestDeps) => Promise<any>;
export declare type FetchDataWithRegexDeps = WithRequest;
export declare const fetchDataWithRegex: (regex: string, address: string, deps: FetchDataWithRegexDeps) => Promise<Entry[]>;
export declare type FetchDevicesDeps = {
    fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>;
};
export declare const fetchDevices: (address: string, deps: FetchDevicesDeps) => Promise<{
    address: string;
    status: string;
}[]>;
export declare type FetchKeyWhitelistDeps = {
    fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>;
};
export declare const fetchKeyWhitellist: (address: string, deps: FetchKeyWhitelistDeps) => Promise<{
    assetId: string;
    status: string;
}[]>;
export declare type FetchKeyDeps = WithRequest;
export declare const fetchKey: (assetId: string, deps: FetchKeyDeps) => Promise<any>;
export declare type FetchAliasesDeps = WithRequest;
export declare const fetchAliases: (address: string, deps: FetchAliasesDeps) => Promise<string[]>;
export interface DappScript {
    url: string;
    raw?: string;
    version: string;
    required: boolean;
}
export interface DappScripts {
    [scriptName: string]: DappScript;
}
export declare const fetchScripts: () => Promise<DappScripts>;
export declare type findAddressByAliasDeps = WithRequest;
export declare const findAddressByAlias: (alias: string, deps: findAddressByAliasDeps) => Promise<any>;
export {};
