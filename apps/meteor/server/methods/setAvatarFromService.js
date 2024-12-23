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
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const setUserAvatar_1 = require("../../app/lib/server/functions/setUserAvatar");
meteor_1.Meteor.methods({
    setAvatarFromService(dataURI, contentType, service, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(dataURI, String);
            (0, check_1.check)(contentType, check_1.Match.Optional(String));
            (0, check_1.check)(service, check_1.Match.Optional(String));
            (0, check_1.check)(targetUserId, check_1.Match.Optional(String));
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'setAvatarFromService',
                });
            }
            return (0, setUserAvatar_1.setAvatarFromServiceWithValidation)(uid, dataURI, contentType, service, targetUserId);
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'setAvatarFromService',
    userId() {
        return true;
    },
}, 1, 5000);
