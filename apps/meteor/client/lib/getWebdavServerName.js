"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebdavServerName = void 0;
const getWebdavServerName = ({ name, serverURL, username }) => name || `${username}@${serverURL === null || serverURL === void 0 ? void 0 : serverURL.replace(/^https?\:\/\//i, '')}`;
exports.getWebdavServerName = getWebdavServerName;
