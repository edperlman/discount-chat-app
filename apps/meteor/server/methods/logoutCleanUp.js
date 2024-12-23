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
const apps_1 = require("@rocket.chat/apps");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const afterLogoutCleanUpCallback_1 = require("../../lib/callbacks/afterLogoutCleanUpCallback");
meteor_1.Meteor.methods({
    logoutCleanUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(user, Object);
            setImmediate(() => {
                void afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.run(user);
            });
            // App IPostUserLogout event hook
            yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostUserLoggedOut, user));
        });
    },
});
