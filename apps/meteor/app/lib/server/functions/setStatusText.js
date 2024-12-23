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
exports.setStatusText = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const lib_1 = require("../lib");
function _setStatusTextPromise(userId, statusText) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId) {
            return false;
        }
        statusText = statusText.trim().substr(0, 120);
        const user = yield models_1.Users.findOneById(userId, {
            projection: { username: 1, name: 1, status: 1, roles: 1, statusText: 1 },
        });
        if (!user) {
            return false;
        }
        if (user.statusText === statusText) {
            return true;
        }
        yield models_1.Users.updateStatusText(user._id, statusText);
        const { _id, username, status, name, roles } = user;
        void core_services_1.api.broadcast('presence.status', {
            user: { _id, username, status, statusText, name, roles },
            previousStatus: status,
        });
        return true;
    });
}
exports.setStatusText = lib_1.RateLimiter.limitFunction(function _setStatusText(userId, statusText) {
    return __awaiter(this, void 0, void 0, function* () {
        return _setStatusTextPromise(userId, statusText);
    });
}, 5, 60000, {
    0() {
        return __awaiter(this, void 0, void 0, function* () {
            // Administrators have permission to change others status, so don't limit those
            const userId = meteor_1.Meteor.userId();
            return !userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info'));
        });
    },
});
