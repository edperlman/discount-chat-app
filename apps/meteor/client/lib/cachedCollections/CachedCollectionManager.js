"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedCollectionManager = void 0;
class CachedCollectionManager {
    constructor() {
        this.items = new Set();
    }
    register(cachedCollection) {
        this.items.add(cachedCollection);
    }
    clearAllCachesOnLogout() {
        for (const item of this.items) {
            item.clearCacheOnLogout();
        }
    }
}
const instance = new CachedCollectionManager();
exports.CachedCollectionManager = instance;
