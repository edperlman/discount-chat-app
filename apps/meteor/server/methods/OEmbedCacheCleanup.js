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
exports.executeClearOEmbedCache = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../app/settings/server");
const executeClearOEmbedCache = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const expirationDays = server_1.settings.get('API_EmbedCacheExpirationDays');
    date.setDate(date.getDate() - expirationDays);
    return models_1.OEmbedCache.removeBeforeDate(date);
});
exports.executeClearOEmbedCache = executeClearOEmbedCache;
meteor_1.Meteor.methods({
    OEmbedCacheCleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'clear-oembed-cache'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'OEmbedCacheCleanup',
                });
            }
            yield (0, exports.executeClearOEmbedCache)();
            return {
                message: 'cache_cleared',
            };
        });
    },
});
