"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isILivechatVisitor = void 0;
const isILivechatVisitor = (a) => typeof (a === null || a === void 0 ? void 0 : a.token) === 'string';
exports.isILivechatVisitor = isILivechatVisitor;
