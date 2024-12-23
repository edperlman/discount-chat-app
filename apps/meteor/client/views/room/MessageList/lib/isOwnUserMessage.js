"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnUserMessage = void 0;
const isOwnUserMessage = (message, subscription) => message.u._id === (subscription === null || subscription === void 0 ? void 0 : subscription.u._id);
exports.isOwnUserMessage = isOwnUserMessage;
