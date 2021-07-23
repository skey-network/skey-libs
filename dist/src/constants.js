"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyRegex = exports.deviceRegex = exports.deviceFields = void 0;
exports.deviceFields = [
    'name',
    'type',
    'supplier',
    'owner',
    'version',
    'lat',
    'lng',
    'alt',
    'active',
    'connected',
    'visible',
    'description',
    'details',
    'custom' // string(json), optional
];
exports.deviceRegex = 'device_.{35}';
exports.keyRegex = 'key_.{32,44}';
//# sourceMappingURL=constants.js.map