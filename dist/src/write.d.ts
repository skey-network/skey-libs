import * as Transactions from '@waves/waves-transactions';
export declare const FEE_MULTIPLIER: number;
export declare const WVS: number;
declare type TxDeps = {
    chainId: string;
    broadcast: (tx: Transactions.TTx) => Promise<string>;
};
export declare type BroadcastDeps = {
    nodeUrl: string;
};
export declare const broadcast: (tx: Transactions.TTx, deps: BroadcastDeps) => Promise<string>;
export declare type TransferKeyDeps = TxDeps;
export declare const transferKey: (receiver: string, assetId: string, seed: string, deps: TransferKeyDeps) => Promise<string>;
export declare type InteractWithDeviceDeps = TxDeps;
export declare const interactWithDevice: (key: string, dapp: string, action: string, seed: string, deps: InteractWithDeviceDeps) => Promise<string>;
export declare type GenerateKeyDeps = TxDeps;
export declare const generateKey: (device: string, validTo: number, seed: string, name: string | undefined, deps: GenerateKeyDeps) => Promise<string>;
export declare type InsertDataDeps = TxDeps;
export declare const insertData: (entries: Entry[], seed: string, deps: InsertDataDeps) => Promise<string>;
export declare type SetScriptDeps = TxDeps;
export declare const setScript: (script: string, seed: string, deps: SetScriptDeps) => Promise<string>;
export declare type InteractWithDeviceAsDeps = TxDeps;
export declare const interactWithDeviceAs: (key: string, dapp: string, action: string, seed: string, fromAddress: string, deps: InteractWithDeviceDeps) => Promise<string>;
export declare type TransferDeps = TxDeps;
export declare const transfer: (receiver: string, amount: number, seed: string, deps: TransferKeyDeps) => Promise<string>;
export {};
