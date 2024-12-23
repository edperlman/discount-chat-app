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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
exports.handleAnnouncementsOnWorkspaceSync = exports.handleBannerOnWorkspaceSync = exports.handleNpsOnWorkspaceSync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const getAndCreateNpsSurvey_1 = require("../../../../../server/services/nps/getAndCreateNpsSurvey");
const handleNpsOnWorkspaceSync = (nps) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: npsId, expireAt } = nps;
    const startAt = new Date(nps.startAt);
    yield core_services_1.NPS.create({
        npsId,
        startAt,
        expireAt: new Date(expireAt),
        createdBy: {
            _id: 'rocket.cat',
            username: 'rocket.cat',
        },
    });
    const now = new Date();
    if (startAt.getFullYear() === now.getFullYear() && startAt.getMonth() === now.getMonth() && startAt.getDate() === now.getDate()) {
        yield (0, getAndCreateNpsSurvey_1.getAndCreateNpsSurvey)(npsId);
    }
});
exports.handleNpsOnWorkspaceSync = handleNpsOnWorkspaceSync;
const handleBannerOnWorkspaceSync = (banners) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, banners_1, banners_1_1;
    var _b, e_1, _c, _d;
    try {
        for (_a = true, banners_1 = __asyncValues(banners); banners_1_1 = yield banners_1.next(), _b = banners_1_1.done, !_b; _a = true) {
            _d = banners_1_1.value;
            _a = false;
            const banner = _d;
            const { createdAt, expireAt, startAt, inactivedAt, _updatedAt } = banner, rest = __rest(banner, ["createdAt", "expireAt", "startAt", "inactivedAt", "_updatedAt"]);
            yield core_services_1.Banner.create(Object.assign(Object.assign(Object.assign({}, rest), { createdAt: new Date(createdAt), expireAt: new Date(expireAt), startAt: new Date(startAt) }), (inactivedAt && { inactivedAt: new Date(inactivedAt) })));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = banners_1.return)) yield _c.call(banners_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.handleBannerOnWorkspaceSync = handleBannerOnWorkspaceSync;
const deserializeAnnouncement = (announcement) => {
    const { inactivedAt, _updatedAt, expireAt, startAt, createdAt } = announcement;
    return Object.assign(Object.assign({}, announcement), { _updatedAt: new Date(_updatedAt), expireAt: new Date(expireAt), startAt: new Date(startAt), createdAt: new Date(createdAt), inactivedAt: inactivedAt ? new Date(inactivedAt) : undefined });
};
const handleAnnouncementsOnWorkspaceSync = (announcements) => __awaiter(void 0, void 0, void 0, function* () {
    const { create, delete: deleteIds } = announcements;
    if (deleteIds) {
        yield Promise.all(deleteIds.map((bannerId) => core_services_1.Banner.disable(bannerId)));
    }
    yield Promise.all(create.map(deserializeAnnouncement).map((announcement) => {
        const { view, selector } = announcement;
        return core_services_1.Banner.create(Object.assign(Object.assign(Object.assign({}, announcement), ((selector === null || selector === void 0 ? void 0 : selector.roles) ? { roles: selector.roles } : {})), { view: Object.assign(Object.assign({}, view), { appId: 'cloud-announcements-core' }) }));
    }));
});
exports.handleAnnouncementsOnWorkspaceSync = handleAnnouncementsOnWorkspaceSync;
