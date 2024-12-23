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
exports.OAuthEEManager = void 0;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const addUserToRoom_1 = require("../../../../app/lib/server/functions/addUserToRoom");
const createRoom_1 = require("../../../../app/lib/server/functions/createRoom");
const getValidRoomName_1 = require("../../../../app/utils/server/lib/getValidRoomName");
const syncUserRoles_1 = require("../syncUserRoles");
const logger = new logger_1.Logger('OAuth');
class OAuthEEManager {
    static mapSSOGroupsToChannels(user, identity, groupClaimName, channelsMap, channelsAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            if (channelsMap && user && identity && groupClaimName) {
                const groupsFromSSO = identity[groupClaimName] || [];
                const userChannelAdmin = yield models_1.Users.findOneByUsernameIgnoringCase(channelsAdmin);
                if (!userChannelAdmin) {
                    logger.error(`could not create channel, user not found: ${channelsAdmin}`);
                    return;
                }
                try {
                    for (var _g = true, _h = __asyncValues(Object.keys(channelsMap)), _j; _j = yield _h.next(), _a = _j.done, !_a; _g = true) {
                        _c = _j.value;
                        _g = false;
                        const ssoGroup = _c;
                        if (typeof ssoGroup === 'string') {
                            let channels = channelsMap[ssoGroup];
                            if (!Array.isArray(channels)) {
                                channels = [channels];
                            }
                            try {
                                for (var _k = true, channels_1 = (e_2 = void 0, __asyncValues(channels)), channels_1_1; channels_1_1 = yield channels_1.next(), _d = channels_1_1.done, !_d; _k = true) {
                                    _f = channels_1_1.value;
                                    _k = false;
                                    const channel = _f;
                                    const name = yield (0, getValidRoomName_1.getValidRoomName)(channel.trim(), undefined, { allowDuplicates: true });
                                    let room = yield models_1.Rooms.findOneByNonValidatedName(name);
                                    if (!room) {
                                        const createdRoom = yield (0, createRoom_1.createRoom)('c', channel, userChannelAdmin, [], false, false);
                                        if (!(createdRoom === null || createdRoom === void 0 ? void 0 : createdRoom.rid)) {
                                            logger.error(`could not create channel ${channel}`);
                                            return;
                                        }
                                        room = createdRoom;
                                    }
                                    if (room && Array.isArray(groupsFromSSO) && groupsFromSSO.includes(ssoGroup)) {
                                        yield (0, addUserToRoom_1.addUserToRoom)(room._id, user);
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (!_k && !_d && (_e = channels_1.return)) yield _e.call(channels_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    }
    static updateRolesFromSSO(user, identity, roleClaimName, rolesToSync) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user && identity && roleClaimName) {
                const rolesFromSSO = yield this.mapRolesFromSSO(identity, roleClaimName);
                if (!Array.isArray(user.roles)) {
                    user.roles = [];
                }
                const rolesIdsFromSSO = (yield models_1.Roles.findInIdsOrNames(rolesFromSSO).toArray()).map((role) => role._id);
                const allowedRoles = (yield models_1.Roles.findInIdsOrNames(rolesToSync).toArray()).map((role) => role._id);
                yield (0, syncUserRoles_1.syncUserRoles)(user._id, rolesIdsFromSSO, {
                    allowedRoles,
                });
            }
        });
    }
    // Returns list of roles from SSO identity
    static mapRolesFromSSO(identity, roleClaimName) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            if (!identity || !roleClaimName || !identity[roleClaimName] || !Array.isArray(identity[roleClaimName])) {
                return [];
            }
            const baseRoles = identity[roleClaimName];
            const filteredRoles = baseRoles.filter((val) => val !== 'offline_access' && val !== 'uma_authorization');
            const validRoleList = [];
            try {
                for (var _d = true, filteredRoles_1 = __asyncValues(filteredRoles), filteredRoles_1_1; filteredRoles_1_1 = yield filteredRoles_1.next(), _a = filteredRoles_1_1.done, !_a; _d = true) {
                    _c = filteredRoles_1_1.value;
                    _d = false;
                    const role = _c;
                    if (yield models_1.Roles.findOneByIdOrName(role)) {
                        validRoleList.push(role);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = filteredRoles_1.return)) yield _b.call(filteredRoles_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return validRoleList;
        });
    }
}
exports.OAuthEEManager = OAuthEEManager;
