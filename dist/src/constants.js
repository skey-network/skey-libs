"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyRegex = exports.deviceRegex = exports.deviceFields = void 0;
exports.deviceFields = [
    'name',
    'lat',
    'lng',
    'alt',
    'type',
    'dapp',
    'owner',
    'description',
    'active',
    'connected'
];
exports.deviceRegex = 'device_.{35}';
exports.keyRegex = 'key_.{32,44}';
//# sourceMappingURL=constants.js.map