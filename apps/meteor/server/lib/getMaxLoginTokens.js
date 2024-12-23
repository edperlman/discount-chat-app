"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxLoginTokens = getMaxLoginTokens;
const maxLoginTokens = parseInt(String(process.env.MAX_RESUME_LOGIN_TOKENS)) || 50;
function getMaxLoginTokens() {
    return maxLoginTokens;
}
