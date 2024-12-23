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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = void 0;
const models_1 = require("@rocket.chat/models");
const tools_1 = require("@rocket.chat/tools");
const accounts_base_1 = require("meteor/accounts-base");
const logger_1 = require("./logger");
const createRoom_1 = require("../../../app/lib/server/functions/createRoom");
const createNewUser = (username_1, _a) => __awaiter(void 0, [username_1, _a], void 0, function* (username, { attributes, casVersion, flagEmailAsVerified }) {
    var _b, e_1, _c, _d;
    // Define new user
    const newUser = Object.assign({ username: attributes.username || username, active: true, globalRoles: ['user'], emails: [attributes.email]
            .filter((e) => e)
            .map((address) => ({
            address,
            verified: flagEmailAsVerified,
        })), services: {
            cas: {
                external_id: username,
                version: casVersion,
                attrs: attributes,
            },
        } }, (0, tools_1.pick)(attributes, 'name'));
    // Create the user
    logger_1.logger.debug(`User "${username}" does not exist yet, creating it`);
    const userId = yield accounts_base_1.Accounts.insertUserDoc({}, newUser);
    // Fetch and use it
    const user = yield models_1.Users.findOneById(userId);
    if (!user) {
        throw new Error('Unexpected error: Unable to find user after its creation.');
    }
    logger_1.logger.debug(`Created new user for '${username}' with id: ${user._id}`);
    logger_1.logger.debug(`Joining user to attribute channels: ${attributes.rooms}`);
    if (attributes.rooms) {
        const roomNames = attributes.rooms.split(',');
        try {
            for (var _e = true, roomNames_1 = __asyncValues(roomNames), roomNames_1_1; roomNames_1_1 = yield roomNames_1.next(), _b = roomNames_1_1.done, !_b; _e = true) {
                _d = roomNames_1_1.value;
                _e = false;
                const roomName = _d;
                if (roomName) {
                    let room = yield models_1.Rooms.findOneByNameAndType(roomName, 'c');
                    if (!room) {
                        room = yield (0, createRoom_1.createRoom)('c', roomName, user);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = roomNames_1.return)) yield _c.call(roomNames_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return user;
});
exports.createNewUser = createNewUser;
