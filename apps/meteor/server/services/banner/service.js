"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.BannerService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const uuid_1 = require("uuid");
class BannerService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'banner';
    }
    getById(bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Banners.findOneById(bannerId);
        });
    }
    discardDismissal(bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield models_1.Banners.findOneById(bannerId);
            if (!result) {
                return false;
            }
            const { _id } = result, banner = __rest(result, ["_id"]);
            const snapshot = yield this.create(Object.assign(Object.assign({}, banner), { snapshot: _id, active: false })); // create a snapshot
            yield models_1.BannersDismiss.updateMany({ bannerId }, { $set: { bannerId: snapshot._id } });
            return true;
        });
    }
    create(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bannerId = doc._id || (0, uuid_1.v4)();
            doc.view.appId = (_a = doc.view.appId) !== null && _a !== void 0 ? _a : 'banner-core';
            doc.view.viewId = bannerId;
            yield models_1.Banners.createOrUpdate(Object.assign(Object.assign({}, doc), { _id: bannerId }));
            const banner = yield models_1.Banners.findOneById(bannerId);
            if (!banner) {
                throw new Error('error-creating-banner');
            }
            void this.sendToUsers(banner);
            return banner;
        });
    }
    getBannersForUser(userId, platform, bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(userId, {
                projection: { roles: 1 },
            });
            const { roles } = user || { roles: [] };
            const banners = yield models_1.Banners.findActiveByRoleOrId(roles, platform, bannerId).toArray();
            const bannerIds = banners.map(({ _id }) => _id);
            const result = yield models_1.BannersDismiss.findByUserIdAndBannerId(userId, bannerIds, {
                projection: { bannerId: 1, _id: 0 },
            }).toArray();
            const dismissed = new Set(result.map(({ bannerId }) => bannerId));
            return banners
                .filter((banner) => !dismissed.has(banner._id))
                .map((banner) => (Object.assign(Object.assign({}, banner), { view: Object.assign(Object.assign({}, banner.view), { 
                    // All modern banners should have a viewId, but we have old banners that were created without it
                    // such as the seatsTaken banner. In this case, we use the bannerId as the viewId
                    viewId: banner.view.viewId || banner._id }), 
                // add surface to legacy banners
                surface: !banner.surface ? 'banner' : banner.surface })));
        });
    }
    dismiss(userId, bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !bannerId) {
                throw new Error('Invalid params');
            }
            const banner = yield models_1.Banners.findOneById(bannerId);
            if (!banner) {
                throw new Error('Banner not found');
            }
            const user = yield models_1.Users.findOneById(userId, {
                projection: { username: 1 },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const dismissedBy = {
                _id: user._id,
                username: user.username,
            };
            const today = new Date();
            const doc = {
                userId,
                bannerId,
                dismissedBy,
                dismissedAt: today,
                _updatedAt: today,
            };
            yield models_1.BannersDismiss.insertOne(doc);
            return true;
        });
    }
    disable(bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield models_1.Banners.disable(bannerId);
            if (result) {
                void core_services_1.api.broadcast('banner.disabled', bannerId);
                return true;
            }
            return false;
        });
    }
    enable(bannerId_1) {
        return __awaiter(this, arguments, void 0, function* (bannerId, doc = {}) {
            const result = yield models_1.Banners.findOneById(bannerId);
            if (!result) {
                return false;
            }
            const { _id } = result, banner = __rest(result, ["_id"]);
            const newBanner = Object.assign(Object.assign(Object.assign({}, banner), doc), { active: true });
            yield models_1.Banners.updateOne({ _id }, { $set: newBanner }); // reenable the banner
            void this.sendToUsers(Object.assign({ _id }, newBanner));
            return true;
        });
    }
    sendToUsers(banner) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!banner.active) {
                return false;
            }
            // no roles set, so it should be sent to all users
            if (!((_a = banner.roles) === null || _a === void 0 ? void 0 : _a.length)) {
                void core_services_1.api.broadcast('banner.enabled', banner._id);
                return true;
            }
            const total = yield models_1.Users.countActiveUsersInRoles(banner.roles);
            // if more than 100 users should receive the banner, send it to all users
            if (total > 100) {
                void core_services_1.api.broadcast('banner.enabled', banner._id);
                return true;
            }
            yield models_1.Users.findActiveUsersInRoles(banner.roles, { projection: { _id: 1 } }).forEach((user) => {
                void core_services_1.api.broadcast('banner.user', user._id, banner);
            });
            return true;
        });
    }
}
exports.BannerService = BannerService;
