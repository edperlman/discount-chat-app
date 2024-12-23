"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSettingsCachedCollection = void 0;
const cachedCollections_1 = require("../cachedCollections");
class PublicSettingsCachedCollection extends cachedCollections_1.CachedCollection {
    constructor() {
        super({
            name: 'public-settings',
            eventType: 'notify-all',
            userRelated: false,
        });
    }
}
const instance = new PublicSettingsCachedCollection();
exports.PublicSettingsCachedCollection = instance;
