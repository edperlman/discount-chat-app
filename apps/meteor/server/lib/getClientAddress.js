"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientAddress = getClientAddress;
function getClientAddress(connection) {
    if (!connection) {
        return '';
    }
    const { clientAddress, httpHeaders } = connection;
    return clientAddress || (httpHeaders === null || httpHeaders === void 0 ? void 0 : httpHeaders['x-real-ip']);
}
