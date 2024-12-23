"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAllowedTokens = exports.isToken = exports.addAsToken = void 0;
const random_1 = require("@rocket.chat/random");
const addAsToken = (message, html, type, extra) => {
    if (!message.tokens) {
        message.tokens = [];
    }
    const token = `=!=${random_1.Random.id()}=!=`;
    message.tokens.push(Object.assign({ token,
        type, text: html }, (extra && Object.assign({}, extra))));
    return token;
};
exports.addAsToken = addAsToken;
const isToken = (msg) => /=!=[.a-z0-9]{17}=!=/gim.test(msg.trim());
exports.isToken = isToken;
const validateAllowedTokens = (message, id, desiredTokens) => {
    var _a;
    const tokens = id.match(/=!=[.a-z0-9]{17}=!=/gim) || [];
    const tokensFound = ((_a = message.tokens) === null || _a === void 0 ? void 0 : _a.filter(({ token }) => tokens.includes(token))) || [];
    return tokensFound.length === 0 || tokensFound.every((token) => token.type && desiredTokens.includes(token.type));
};
exports.validateAllowedTokens = validateAllowedTokens;
