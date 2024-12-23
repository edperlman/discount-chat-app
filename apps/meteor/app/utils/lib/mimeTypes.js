"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMimeType = exports.getExtension = exports.mime = void 0;
const with_db_1 = __importDefault(require("mime-type/with-db"));
exports.mime = with_db_1.default;
with_db_1.default.types.wav = 'audio/wav';
with_db_1.default.types.lst = 'text/plain';
with_db_1.default.define('image/vnd.microsoft.icon', { source: '', extensions: ['ico'] }, with_db_1.default.dupAppend);
with_db_1.default.define('image/x-icon', { source: '', extensions: ['ico'] }, with_db_1.default.dupOverwrite);
with_db_1.default.define('audio/aac', { source: '', extensions: ['aac'] }, with_db_1.default.dupOverwrite);
const getExtension = (param) => {
    const extension = with_db_1.default.extension(param);
    return !extension || typeof extension === 'boolean' ? '' : extension;
};
exports.getExtension = getExtension;
const getMimeType = (mimetype, fileName) => {
    // If the extension from the mimetype is different from the file extension, the file
    // extension may be wrong so use the informed mimetype
    const extension = with_db_1.default.extension(mimetype);
    if (mimetype !== 'application/octet-stream' && extension && extension !== fileName.split('.').pop()) {
        return mimetype;
    }
    const fileMimeType = with_db_1.default.lookup(fileName);
    return typeof fileMimeType === 'string' ? fileMimeType : 'application/octet-stream';
};
exports.getMimeType = getMimeType;
