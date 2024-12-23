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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const setEmail_1 = require("../functions/setEmail");
const lib_1 = require("../lib");
meteor_1.Meteor.methods({
    setEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(email, String);
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setEmail' });
            }
            if (!server_1.settings.get('Accounts_AllowEmailChange')) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Changing email is not allowed', {
                    method: 'setEmail',
                    action: 'Changing_email',
                });
            }
            if (((_a = user.emails) === null || _a === void 0 ? void 0 : _a[0]) && user.emails[0].address === email) {
                return email;
            }
            if (!(yield (0, setEmail_1.setEmail)(user._id, email))) {
                throw new meteor_1.Meteor.Error('error-could-not-change-email', 'Could not change email', {
                    method: 'setEmail',
                });
            }
            return email;
        });
    },
});
lib_1.RateLimiter.limitMethod('setEmail', 1, 1000, {
    userId( /* userId*/) {
        return true;
    },
});
