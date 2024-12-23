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
const setUsername_1 = require("../functions/setUsername");
const lib_1 = require("../lib");
meteor_1.Meteor.methods({
    setUsername(username_1) {
        return __awaiter(this, arguments, void 0, function* (username, param = {}) {
            (0, check_1.check)(username, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setUsername' });
            }
            yield (0, setUsername_1.setUsernameWithValidation)(userId, username, param.joinDefaultChannelsSilenced);
            return username;
        });
    },
});
lib_1.RateLimiter.limitMethod('setUsername', 1, 1000, {
    userId() {
        return true;
    },
});
