"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppsByPaid = void 0;
const filterAppsByPaid = ({ purchaseType, price }) => purchaseType === 'subscription' || Boolean(price);
exports.filterAppsByPaid = filterAppsByPaid;
