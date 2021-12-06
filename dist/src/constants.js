"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyRegex = exports.deviceRegex = exports.deviceFields = exports.booleanDeviceFields = exports.floatDeviceFields = exports.stringDeviceFields = void 0;
exports.stringDeviceFields = [
    'name',
    'type',
    'supplier',
    'owner',
    'version',
    'description',
    'details',
    'custom' // string(json), optional
];
exports.floatDeviceFields = [
    'lat',
    'lng',
    'alt' // string(float), optional
];
exports.booleanDeviceFields = [
    'active',
    'connected',
    'visible' // boolean
];
exports.deviceFields = [
    ...exports.stringDeviceFields,
    ...exports.floatDeviceFields,
    ...exports.booleanDeviceFields
];
exports.deviceRegex = 'device_.{35}';
exports.keyRegex = 'key_.{32,44}';
//# sourceMappingURL=constants.js.map