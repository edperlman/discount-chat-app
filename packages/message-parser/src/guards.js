"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNodeOfType = void 0;
const isNodeOfType = (value, type) => typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === type;
exports.isNodeOfType = isNodeOfType;
