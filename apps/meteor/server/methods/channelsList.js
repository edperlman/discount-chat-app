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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../app/settings/server");
const getUserPreference_1 = require("../../app/utils/server/lib/getUserPreference");
const stringUtils_1 = require("../../lib/utils/stringUtils");
meteor_1.Meteor.methods({
    channelsList(filter, channelType, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(filter, String);
            (0, check_1.check)(channelType, String);
            (0, check_1.check)(limit, check_1.Match.Optional(Number));
            (0, check_1.check)(sort, check_1.Match.Optional(String));
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'channelsList',
                });
            }
            const options = {
                projection: {
                    name: 1,
                    t: 1,
                },
                sort: {
                    msgs: -1,
                },
            };
            if (underscore_1.default.isNumber(limit)) {
                options.limit = limit;
            }
            if ((0, stringUtils_1.trim)(sort)) {
                switch (sort) {
                    case 'name':
                        options.sort = {
                            name: 1,
                        };
                        break;
                    case 'msgs':
                        options.sort = {
                            msgs: -1,
                        };
                }
            }
            let channels = [];
            if (channelType !== 'private') {
                if (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-c-room')) {
                    if (filter) {
                        channels = channels.concat(yield models_1.Rooms.findByTypeAndNameContaining('c', filter, options).toArray());
                    }
                    else {
                        channels = channels.concat(yield models_1.Rooms.findByType('c', options).toArray());
                    }
                }
                else if (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-joined-room')) {
                    const roomIds = (yield models_1.Subscriptions.findByTypeAndUserId('c', userId, { projection: { rid: 1 } }).toArray()).map((s) => s.rid);
                    if (filter) {
                        channels = channels.concat(yield models_1.Rooms.findByTypeInIdsAndNameContaining('c', roomIds, filter, options).toArray());
                    }
                    else {
                        channels = channels.concat(yield models_1.Rooms.findByTypeInIds('c', roomIds, options).toArray());
                    }
                }
            }
            if (channelType !== 'public' && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-p-room'))) {
                const user = yield models_1.Users.findOne(userId, {
                    projection: {
                        'username': 1,
                        'settings.preferences.sidebarGroupByType': 1,
                    },
                });
                if (!user) {
                    throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                        method: 'channelsList',
                    });
                }
                const userPref = yield (0, getUserPreference_1.getUserPreference)(user, 'sidebarGroupByType');
                // needs to negate globalPref because userPref represents its opposite
                const groupByType = userPref !== undefined ? userPref : server_1.settings.get('UI_Group_Channels_By_Type');
                if (!groupByType) {
                    const roomIds = (yield models_1.Subscriptions.findByTypeAndUserId('p', userId, { projection: { rid: 1 } }).toArray()).map((s) => s.rid);
                    if (filter) {
                        channels = channels.concat(yield models_1.Rooms.findByTypeInIdsAndNameContaining('p', roomIds, filter, options).toArray());
                    }
                    else {
                        channels = channels.concat(yield models_1.Rooms.findByTypeInIds('p', roomIds, options).toArray());
                    }
                }
            }
            return {
                channels,
            };
        });
    },
});
