"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOfflineMessage = void 0;
const parseOfflineMessage = (fields = {}) => {
    return Object.assign(fields, { host: window.location.origin });
};
exports.parseOfflineMessage = parseOfflineMessage;
