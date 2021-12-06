import './types';
import * as Read from './read';
import * as Write from './write';
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
    broadcast: (tx: Transactions.TTx, options?: Write.TxOptions | undefined) => Promise<string>;
    transferKey: (receiver: string, assetId: string, seed: string, options?: Write.TxOptions) => Promise<string>;
    fetchDevice: (address: string) => Promise<Device>;
    interactWithDevice: (key: string, dapp: string, action: string, seed: string, options?: Write.TxOptions) => Promise<string>;
    onBlockchainUpdate: (callback: (height: number) => any, interval?: number) => Promise<void> & {
        cancel: () => Promise<void>;
    };
    generateKey: (device: string, validTo: number, seed: string, name?: string, options?: Write.TxOptions) => Promise<string>;
    insertData: (entries: Entry[], seed: string, options?: Write.TxOptions) => Promise<string>;
    setScript: (script: string, seed: string, options?: Write.TxOptions) => Promise<string>;
    interactWithDeviceAs: (key: string, dapp: string, action: string, seed: string, fromAddress: string, options?: Write.TxOptions) => Promise<string>;
    fetchKey: (assetId: string) => Promise<any>;
    transfer: (receiver: string, amount: number, seed: string, options?: Write.TxOptions) => Promise<string>;
    setAlias: (alias: string, seed: string, options?: Write.TxOptions) => Promise<string>;
    fetchAliases: (account: string) => Promise<string[]>;
    findAddressByAlias: (alias: string) => Promise<any>;
    fetchScripts: () => Promise<Read.DappScripts>;
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
        broadcast: (tx: Transactions.TTx<string | number>, options?: Write.TxOptions | undefined) => Promise<string>;
        transferKey: (receiver: string, assetId: string, seed: string, options?: Write.TxOptions) => Promise<string>;
        fetchDevice: (address: string) => Promise<Device>;
        interactWithDevice: (key: string, dapp: string, action: string, seed: string, options?: Write.TxOptions) => Promise<string>;
        onBlockchainUpdate: (callback: (height: number) => any, interval?: number) => Promise<void> & {
            cancel: () => Promise<void>;
        };
        generateKey: (device: string, validTo: number, seed: string, name?: string, options?: Write.TxOptions) => Promise<string>;
        insertData: (entries: Entry[], seed: string, options?: Write.TxOptions) => Promise<string>;
        setScript: (script: string, seed: string, options?: Write.TxOptions) => Promise<string>;
        interactWithDeviceAs: (key: string, dapp: string, action: string, seed: string, fromAddress: string, options?: Write.TxOptions) => Promise<string>;
        fetchKey: (assetId: string) => Promise<any>;
        transfer: (receiver: string, amount: number, seed: string, options?: Write.TxOptions) => Promise<string>;
        setAlias: (alias: string, seed: string, options?: Write.TxOptions) => Promise<string>;
        fetchAliases: (account: string) => Promise<string[]>;
        findAddressByAlias: (alias: string) => Promise<any>;
        fetchScripts: () => Promise<Read.DappScripts>;
    };
};
export default _default;
