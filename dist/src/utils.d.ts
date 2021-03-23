export declare const extractValuesFromKey: (description: string) => {
    device?: string | undefined;
    validTo?: number | undefined;
};
export declare type CreateAccountDeps = {
    chainId: string;
};
export declare const createAccount: (deps: CreateAccountDeps) => {
    seed: string;
    privateKey: string;
    publicKey: string;
    address: string;
};
export declare type WaitForNBlocksDeps = {
    fetchHeight: () => Promise<number>;
};
export declare const waitForNBlocks: (amount: number, interval: number | undefined, deps: WaitForNBlocksDeps) => Promise<void>;
export declare const delay: (timeout: number) => Promise<void>;
export declare type OnBlockchainUpdateDeps = {
    fetchHeight: () => Promise<number>;
    delay: (timeout: number) => Promise<void>;
};
export declare const onBlockchainUpdate: (callback: (height: number) => any, interval: number | undefined, deps: OnBlockchainUpdateDeps) => Promise<void> & {
    cancel: () => Promise<void>;
};
