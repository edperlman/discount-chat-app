"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebdavCredentials = getWebdavCredentials;
function getWebdavCredentials(account) {
    const cred = account.token
        ? { token: account.token }
        : {
            username: account.username,
            password: account.password,
        };
    return cred;
}
