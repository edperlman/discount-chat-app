"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParsedMessage = void 0;
const isParsedMessage = (text) => Array.isArray(text) && text.length > 0;
exports.isParsedMessage = isParsedMessage;
