import './types';
import * as Transactions from '@waves/waves-transactions';
export interface Config {
    nodeUrl: string;
    chainId: string;
}
export declare const getInstance: (config: Config) => {
    fetchHeight: () => Promise<number>;
    fetchKeyOwner: (assetId: string, height: number) => Promise<string | undefined>;
    extractValuesFromKey: (description: string) => {
        device?: string | undefined;
        validTo?: number | undefined;
    };
    request: (path: string) => Promise<any>;
    fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>;
    createAccount: () => {
        seed: string;
        privateKey: string;
        publicKey: string;
        address: string;
    };
    fetchDevices: (address: string) => Promise<{
        address: string;
        status: string;
    }[]>;
    fetchKeyWhitelist: (address: string) => Promise<{
        assetId: string;
        status: string;
    }[]>;
    waitForNBlocks: (amount: number, interval?: number) => Promise<void>;
    delay: (timeout: number) => Promise<void>;
    FEE_MULTIPLIER: number;
    WVS: number;
    broadcast: (tx: Transactions.TTx) => Promise<string>;
    transferKey: (receiver: string, assetId: string, seed: string) => Promise<string>;
    fetchDevice: (address: string) => Promise<Device>;
    interactWithDevice: (key: string, dapp: string, action: string, seed: string) => Promise<string>;
    onBlockchainUpdate: (callback: (height: number) => any, interval?: number) => Promise<void> & {
        cancel: () => Promise<void>;
    };
    generateKey: (device: string, validTo: number, seed: string, name?: string) => Promise<string>;
    insertData: (entries: Entry[], seed: string) => Promise<string>;
    setScript: (script: string, seed: string) => Promise<string>;
    interactWithDeviceAs: (key: string, dapp: string, action: string, seed: string, fromAddress: string) => Promise<string>;
    fetchKey: (assetId: string) => Promise<any>;
};
declare const _default: {
    getInstance: (config: Config) => {
        fetchHeight: () => Promise<number>;
        fetchKeyOwner: (assetId: string, height: number) => Promise<string | undefined>;
        extractValuesFromKey: (description: string) => {
            device?: string | undefined;
            validTo?: number | undefined;
        };
        request: (path: string) => Promise<any>;
        fetchDataWithRegex: (regex: string, address: string) => Promise<Entry[]>;
        createAccount: () => {
            seed: string;
            privateKey: string;
            publicKey: string;
            address: string;
        };
        fetchDevices: (address: string) => Promise<{
            address: string;
            status: string;
        }[]>;
        fetchKeyWhitelist: (address: string) => Promise<{
            assetId: string;
            status: string;
        }[]>;
        waitForNBlocks: (amount: number, interval?: number) => Promise<void>;
        delay: (timeout: number) => Promise<void>;
        FEE_MULTIPLIER: number;
        WVS: number;
        broadcast: (tx: Transactions.TTx<string | number>) => Promise<string>;
        transferKey: (receiver: string, assetId: string, seed: string) => Promise<string>;
        fetchDevice: (address: string) => Promise<Device>;
        interactWithDevice: (key: string, dapp: string, action: string, seed: string) => Promise<string>;
        onBlockchainUpdate: (callback: (height: number) => any, interval?: number) => Promise<void> & {
            cancel: () => Promise<void>;
        };
        generateKey: (device: string, validTo: number, seed: string, name?: string) => Promise<string>;
        insertData: (entries: Entry[], seed: string) => Promise<string>;
        setScript: (script: string, seed: string) => Promise<string>;
        interactWithDeviceAs: (key: string, dapp: string, action: string, seed: string, fromAddress: string) => Promise<string>;
        fetchKey: (assetId: string) => Promise<any>;
    };
};
export default _default;
