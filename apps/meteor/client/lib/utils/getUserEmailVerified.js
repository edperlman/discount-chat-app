"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEmailVerified = void 0;
const getUserEmailVerified = (user) => { var _a; return Array.isArray(user.emails) ? (_a = user.emails.find(({ verified }) => !!verified)) === null || _a === void 0 ? void 0 : _a.verified : undefined; };
exports.getUserEmailVerified = getUserEmailVerified;
