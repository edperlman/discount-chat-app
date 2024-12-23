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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const removeUserFromRoom_1 = require("../../../server/methods/removeUserFromRoom");
const hasRole_1 = require("../../authorization/server/functions/hasRole");
const addUsersToRoom_1 = require("../../lib/server/methods/addUsersToRoom");
const server_1 = require("../../settings/server");
/**
 * BotHelpers helps bots
 * "private" properties use meteor collection cursors, so they stay reactive
 * "public" properties use getters to fetch and filter collections as array
 */
class BotHelpers {
    constructor() {
        this.queries = {
            online: { status: { $ne: core_typings_1.UserStatus.OFFLINE } },
            users: { roles: { $not: { $all: ['bot'] } } },
        };
    }
    // setup collection cursors with array of fields from setting
    setupCursors(fieldsSetting) {
        this.userFields = {};
        if (typeof fieldsSetting === 'string') {
            fieldsSetting = fieldsSetting.split(',');
        }
        fieldsSetting.forEach((n) => {
            this.userFields[n.trim()] = 1;
        });
        this._allUsers = models_1.Users.find(this.queries.users, { projection: this.userFields });
        this._onlineUsers = models_1.Users.find({ $and: [this.queries.users, this.queries.online] }, { projection: this.userFields });
    }
    // request methods or props as arguments to Meteor.call
    request(prop, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = this[prop];
            if (typeof p === 'undefined') {
                return null;
            }
            if (typeof p === 'function') {
                return p(...params);
            }
            return p;
        });
    }
    addUserToRole(userName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield meteor_1.Meteor.callAsync('authorization:addUserToRole', roleId, userName);
        });
    }
    removeUserFromRole(userName, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield meteor_1.Meteor.callAsync('authorization:removeUserFromRole', roleId, userName);
        });
    }
    addUserToRoom(userName, room) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundRoom = yield models_1.Rooms.findOneByIdOrName(room);
            if (!foundRoom) {
                throw new meteor_1.Meteor.Error('invalid-channel');
            }
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'addUserToRoom' });
            }
            yield (0, addUsersToRoom_1.addUsersToRoomMethod)(userId, {
                rid: foundRoom._id,
                users: [userName],
            });
        });
    }
    removeUserFromRoom(userName, room) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundRoom = yield models_1.Rooms.findOneByIdOrName(room);
            if (!foundRoom) {
                throw new meteor_1.Meteor.Error('invalid-channel');
            }
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
            }
            yield (0, removeUserFromRoom_1.removeUserFromRoomMethod)(userId, { rid: foundRoom._id, username: userName });
        });
    }
    // generic error whenever property access insufficient to fill request
    requestError() {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Bot request not allowed', {
            method: 'botRequest',
            action: 'bot_request',
        });
    }
    // "public" properties accessed by getters
    // allUsers / onlineUsers return whichever properties are enabled by settings
    get allUsers() {
        if (!Object.keys(this.userFields).length) {
            this.requestError();
            return false;
        }
        return this._allUsers.toArray();
    }
    get onlineUsers() {
        if (!Object.keys(this.userFields).length) {
            this.requestError();
            return false;
        }
        return this._onlineUsers.toArray();
    }
    get allUsernames() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('username')) {
                this.requestError();
                return false;
            }
            return (yield this._allUsers.toArray()).map((user) => user.username);
        }))();
    }
    get onlineUsernames() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('username')) {
                this.requestError();
                return false;
            }
            return (yield this._onlineUsers.toArray()).map((user) => user.username);
        }))();
    }
    get allNames() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('name')) {
                this.requestError();
                return false;
            }
            return (yield this._allUsers.toArray()).map((user) => user.name);
        }))();
    }
    get onlineNames() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('name')) {
                this.requestError();
                return false;
            }
            return (yield this._onlineUsers.toArray()).map((user) => user.name);
        }))();
    }
    get allIDs() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {
                this.requestError();
                return false;
            }
            return (yield this._allUsers.toArray()).map((user) => ({ id: user._id, name: user.username }));
        }))();
    }
    get onlineIDs() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {
                this.requestError();
                return false;
            }
            return (yield this._onlineUsers.toArray()).map((user) => ({ id: user._id, name: user.username }));
        }))();
    }
}
// add class to meteor methods
const botHelpers = new BotHelpers();
// init cursors with fields setting and update on setting change
server_1.settings.watch('BotHelpers_userFields', (value) => {
    botHelpers.setupCursors(value);
});
meteor_1.Meteor.methods({
    botRequest(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = meteor_1.Meteor.userId();
            if (userID && (yield (0, hasRole_1.hasRoleAsync)(userID, 'bot'))) {
                return botHelpers.request(...args);
            }
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'botRequest' });
        });
    },
});
