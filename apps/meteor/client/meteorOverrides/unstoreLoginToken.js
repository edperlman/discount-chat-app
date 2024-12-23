"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const cachedCollections_1 = require("../lib/cachedCollections");
const { _unstoreLoginToken } = accounts_base_1.Accounts;
accounts_base_1.Accounts._unstoreLoginToken = (...args) => {
    _unstoreLoginToken.apply(accounts_base_1.Accounts, args);
    cachedCollections_1.CachedCollectionManager.clearAllCachesOnLogout();
};
