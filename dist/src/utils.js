"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValuesFromKey = void 0;
const extractValuesFromKey = (description) => {
    const values = description.split('_');
    return { device: values[0], validTo: Number(values[1]) };
};
exports.extractValuesFromKey = extractValuesFromKey;
//# sourceMappingURL=utils.js.map