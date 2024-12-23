"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
class BannersRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'banner', trash);
    }
    modelIndexes() {
        return [{ key: { platform: 1, startAt: 1, expireAt: 1 } }, { key: { platform: 1, startAt: 1, expireAt: 1, active: 1 } }];
    }
    create(doc) {
        var _a;
        const invalidPlatform = (_a = doc.platform) === null || _a === void 0 ? void 0 : _a.some((platform) => !Object.values(core_typings_1.BannerPlatform).includes(platform));
        if (invalidPlatform) {
            throw new Error('Invalid platform');
        }
        if (doc.startAt > doc.expireAt) {
            throw new Error('Start date cannot be later than expire date');
        }
        if (doc.expireAt < new Date()) {
            throw new Error('Cannot create banner already expired');
        }
        return this.insertOne(Object.assign({ active: true }, doc));
    }
    findActiveByRoleOrId(roles, platform, bannerId, options) {
        const today = new Date();
        const query = Object.assign(Object.assign({}, (bannerId && { _id: bannerId })), { platform, startAt: { $lte: today }, expireAt: { $gte: today }, active: { $ne: false }, $or: [{ roles: { $in: roles } }, { roles: { $exists: false } }] });
        return this.find(query, options);
    }
    disable(bannerId) {
        return this.updateOne({ _id: bannerId, active: { $ne: false } }, { $set: { active: false, inactivedAt: new Date() } });
    }
    createOrUpdate(banner) {
        var _a;
        const invalidPlatform = (_a = banner.platform) === null || _a === void 0 ? void 0 : _a.some((platform) => !Object.values(core_typings_1.BannerPlatform).includes(platform));
        if (invalidPlatform) {
            throw new Error('Invalid platform');
        }
        if (banner.startAt > banner.expireAt) {
            throw new Error('Start date cannot be later than expire date');
        }
        if (banner.expireAt < new Date()) {
            throw new Error('Cannot create banner already expired');
        }
        const { _id: bannerId } = banner, doc = __rest(banner, ["_id"]);
        return this.updateOne({ _id: bannerId }, { $set: Object.assign({ active: true }, doc) }, { upsert: true });
    }
}
exports.BannersRaw = BannersRaw;
