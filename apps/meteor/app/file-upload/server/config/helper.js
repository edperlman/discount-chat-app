"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentDisposition = exports.forceDownload = void 0;
const url_1 = __importDefault(require("url"));
const forceDownload = (req) => {
    const { query } = url_1.default.parse(req.url || '', true);
    const forceDownload = typeof query.download !== 'undefined';
    if (forceDownload) {
        return true;
    }
    return query.contentDisposition === 'attachment';
};
exports.forceDownload = forceDownload;
const getContentDisposition = (req) => {
    const { query } = url_1.default.parse(req.url || '', true);
    if (query.contentDisposition === 'inline') {
        return 'inline';
    }
    return 'attachment';
};
exports.getContentDisposition = getContentDisposition;
