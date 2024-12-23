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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../app/authorization/server/functions/canAccessRoom");
const server_1 = require("../../app/settings/server");
const readSecondaryPreferred_1 = require("../database/readSecondaryPreferred");
const parseMessageSearchQuery_1 = require("../lib/parseMessageSearchQuery");
meteor_1.Meteor.methods({
    messageSearch(text, rid, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(text, String);
            (0, check_1.check)(rid, check_1.Match.Maybe(String));
            (0, check_1.check)(limit, check_1.Match.Optional(Number));
            (0, check_1.check)(offset, check_1.Match.Optional(Number));
            const currentUserId = meteor_1.Meteor.userId();
            if (!currentUserId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'messageSearch',
                });
            }
            // Don't process anything else if the user can't access the room
            if (rid) {
                if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, currentUserId))) {
                    return false;
                }
            }
            else if (server_1.settings.get('Search.defaultProvider.GlobalSearchEnabled') !== true) {
                return {
                    message: {
                        docs: [],
                    },
                };
            }
            const user = (yield meteor_1.Meteor.userAsync());
            const { query, options } = (0, parseMessageSearchQuery_1.parseMessageSearchQuery)(text, {
                user,
                offset,
                limit,
                forceRegex: server_1.settings.get('Message_AlwaysSearchRegExp'),
            });
            if (Object.keys(query).length === 0) {
                return {
                    message: {
                        docs: [],
                    },
                };
            }
            query.t = {
                $ne: 'rm', // hide removed messages (useful when searching for user messages)
            };
            query._hidden = {
                $ne: true, // don't return _hidden messages
            };
            if (rid) {
                query.rid = rid;
            }
            else {
                query.rid = {
                    $in: (user === null || user === void 0 ? void 0 : user._id) ? (yield models_1.Subscriptions.findByUserId(user._id).toArray()).map((subscription) => subscription.rid) : [],
                };
            }
            return {
                message: {
                    docs: yield models_1.Messages.find(query, Object.assign({ 
                        // @ts-expect-error col.s.db is not typed
                        readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)(models_1.Messages.col.s.db) }, options)).toArray(),
                },
            };
        });
    },
});
