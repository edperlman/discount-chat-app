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
const core_typings_1 = require("@rocket.chat/core-typings");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:setUpConnection'(data) {
        (0, check_1.check)(data, {
            token: String,
        });
        const { token } = data;
        if (this.connection && !this.connection.livechatToken) {
            this.connection.livechatToken = token;
            this.connection.onClose(() => __awaiter(this, void 0, void 0, function* () {
                yield LivechatTyped_1.Livechat.notifyGuestStatusChanged(token, core_typings_1.UserStatus.OFFLINE);
            }));
        }
    },
});
