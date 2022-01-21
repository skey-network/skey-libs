import { SkeyInstance } from './types';
export interface Config {
    nodeUrl: string;
    chainId: string;
}
export declare const getInstance: (config: Config) => SkeyInstance;
/**
 * Export interfaces
 */
export { Device, Key, Entry, BinaryEntry, BooleanEntry, DataEntry, DeleteEntry, IntegerEntry, StringEntry, Account, SkeyInstance } from './types';
declare const _default: {
    getInstance: (config: Config) => SkeyInstance;
};
export default _default;
