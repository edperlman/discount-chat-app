"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEmailAddress = void 0;
const getUserEmailAddress = (user) => { var _a; return Array.isArray(user.emails) ? (_a = user.emails.find(({ address }) => !!address)) === null || _a === void 0 ? void 0 : _a.address : undefined; };
exports.getUserEmailAddress = getUserEmailAddress;
