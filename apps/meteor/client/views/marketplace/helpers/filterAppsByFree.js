"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByFree = void 0;
const filterAppsByFree = ({ purchaseType, price, isEnterpriseOnly }) => purchaseType === 'buy' && !price && !isEnterpriseOnly;
exports.filterAppsByFree = filterAppsByFree;
