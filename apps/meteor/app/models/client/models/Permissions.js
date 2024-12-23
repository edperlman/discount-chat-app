"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.AuthzCachedCollection = void 0;
const cachedCollections_1 = require("../../../../client/lib/cachedCollections");
exports.AuthzCachedCollection = new cachedCollections_1.CachedCollection({
    name: 'permissions',
    eventType: 'notify-logged',
});
exports.Permissions = exports.AuthzCachedCollection.collection;
