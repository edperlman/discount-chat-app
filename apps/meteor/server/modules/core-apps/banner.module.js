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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
class BannerModule {
    constructor() {
        this.appId = 'banner-core';
    }
    // when banner view is closed we need to dismiss that banner for that user
    viewClosed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload: { view: { viewId: bannerId } = {} }, user: { _id: userId } = {}, } = payload;
            if (!userId) {
                throw new Error('invalid user');
            }
            if (!bannerId) {
                throw new Error('invalid banner');
            }
            if (!payload.triggerId) {
                throw new Error('invalid triggerId');
            }
            yield core_services_1.Banner.dismiss(userId, bannerId);
            return {
                type: 'banner.close',
                triggerId: payload.triggerId,
                appId: payload.appId,
                viewId: bannerId,
            };
        });
    }
}
exports.BannerModule = BannerModule;
