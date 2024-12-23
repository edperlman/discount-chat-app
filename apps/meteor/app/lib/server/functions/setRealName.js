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
exports.setRealName = exports._setRealName = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const lib_1 = require("../lib");
const _setRealName = function (userId, name, fullUser) {
    return __awaiter(this, void 0, void 0, function* () {
        name = name.trim();
        if (!userId || (server_1.settings.get('Accounts_RequireNameForSignUp') && !name)) {
            return;
        }
        const user = fullUser || (yield models_1.Users.findOneById(userId));
        if (!user) {
            return;
        }
        // User already has desired name, return
        if (user.name && user.name.trim() === name) {
            return user;
        }
        // Set new name
        if (name) {
            yield models_1.Users.setName(user._id, name);
        }
        else {
            yield models_1.Users.unsetName(user._id);
        }
        user.name = name;
        if (server_1.settings.get('UI_Use_Real_Name') === true) {
            void core_services_1.api.broadcast('user.nameChanged', {
                _id: user._id,
                name: user.name,
                username: user.username,
            });
        }
        void core_services_1.api.broadcast('user.realNameChanged', {
            _id: user._id,
            name,
            username: user.username,
        });
        return user;
    });
};
exports._setRealName = _setRealName;
exports.setRealName = lib_1.RateLimiter.limitFunction(exports._setRealName, 1, 60000, {
    0() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            return !userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info'));
        });
    }, // Administrators have permission to change others names, so don't limit those
});
