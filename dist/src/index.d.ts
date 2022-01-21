import { SkeyInstance } from './types';
export interface Config {
    nodeUrl: string;
    chainId: string;
}
export declare const getInstance: (config: Config) => SkeyInstance;
declare const _default: {
    getInstance: (config: Config) => SkeyInstance;
};
export default _default;
