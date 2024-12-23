"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDisplayName = void 0;
const getUserDisplayName = (name, username, useRealName) => useRealName ? name || username : username;
exports.getUserDisplayName = getUserDisplayName;
