"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatIntoFullMatrixUsername = exports.formatUsernameAndDomainIntoMatrixFormat = void 0;
const formatUsernameAndDomainIntoMatrixFormat = (username, domain) => `${username}:${domain}`;
exports.formatUsernameAndDomainIntoMatrixFormat = formatUsernameAndDomainIntoMatrixFormat;
const formatIntoFullMatrixUsername = (username, domain) => `@${(0, exports.formatUsernameAndDomainIntoMatrixFormat)(username, domain)}`;
exports.formatIntoFullMatrixUsername = formatIntoFullMatrixUsername;
