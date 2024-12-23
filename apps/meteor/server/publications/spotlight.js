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
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const spotlight_1 = require("../lib/spotlight");
meteor_1.Meteor.methods({
    spotlight(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, usernames = [], type = { users: true, rooms: true, mentions: false, includeFederatedRooms: false }, rid) {
            const spotlight = new spotlight_1.Spotlight();
            const { mentions, includeFederatedRooms } = type;
            if (text.startsWith('#')) {
                type.users = false;
                text = text.slice(1);
            }
            if (text.startsWith('@')) {
                type.rooms = false;
                text = text.slice(1);
            }
            const { userId } = this;
            return {
                users: type.users ? yield spotlight.searchUsers({ userId, rid, text, usernames, mentions }) : [],
                rooms: type.rooms ? yield spotlight.searchRooms({ userId, text, includeFederatedRooms }) : [],
            };
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'spotlight',
    userId( /* userId*/) {
        return true;
    },
}, 100, 100000);
