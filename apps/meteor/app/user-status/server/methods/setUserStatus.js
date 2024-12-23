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
exports.setUserStatusMethod = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../lib/server");
const setStatusText_1 = require("../../../lib/server/functions/setStatusText");
const server_2 = require("../../../settings/server");
const setUserStatusMethod = (userId, statusType, statusText) => __awaiter(void 0, void 0, void 0, function* () {
    if (statusType) {
        if (statusType === 'offline' && !server_2.settings.get('Accounts_AllowInvisibleStatusOption')) {
            throw new meteor_1.Meteor.Error('error-status-not-allowed', 'Invisible status is disabled', {
                method: 'setUserStatus',
            });
        }
        yield core_services_1.Presence.setStatus(userId, statusType);
    }
    if (statusText || statusText === '') {
        (0, check_1.check)(statusText, String);
        if (!server_2.settings.get('Accounts_AllowUserStatusMessageChange')) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                method: 'setUserStatus',
            });
        }
        yield (0, setStatusText_1.setStatusText)(userId, statusText);
    }
});
exports.setUserStatusMethod = setUserStatusMethod;
meteor_1.Meteor.methods({
    setUserStatus: (statusType, statusText) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = meteor_1.Meteor.userId();
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setUserStatus' });
        }
        yield (0, exports.setUserStatusMethod)(userId, statusType, statusText);
    }),
});
server_1.RateLimiter.limitMethod('setUserStatus', 1, 1000, {
    userId: () => true,
});
