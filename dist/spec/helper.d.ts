import * as Transactions from '@waves/waves-transactions';
export declare const config: {
    nodeUrl: string;
    chainId: string;
    feeMultiplier: number;
    wvs: number;
    seed: string;
};
export declare const address: () => string;
export declare const randomAssetId: () => string;
export declare const createAccount: () => {
    address: string;
    seed: string;
};
export declare const generateKey: (device: string, validTo: number, seed?: string) => Promise<string>;
export declare const fund: (address: string, amount?: number) => Promise<string>;
export declare const broadcast: (tx: Transactions.TTx) => Promise<string>;
export declare const delay: (timeout: number) => Promise<void>;
