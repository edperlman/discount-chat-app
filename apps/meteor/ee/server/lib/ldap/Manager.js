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
exports.LDAPEEManager = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const addUserToRoom_1 = require("../../../../app/lib/server/functions/addUserToRoom");
const createRoom_1 = require("../../../../app/lib/server/functions/createRoom");
const removeUserFromRoom_1 = require("../../../../app/lib/server/functions/removeUserFromRoom");
const setUserActiveStatus_1 = require("../../../../app/lib/server/functions/setUserActiveStatus");
const server_1 = require("../../../../app/settings/server");
const getValidRoomName_1 = require("../../../../app/utils/server/lib/getValidRoomName");
const arrayUtils_1 = require("../../../../lib/utils/arrayUtils");
const Connection_1 = require("../../../../server/lib/ldap/Connection");
const Logger_1 = require("../../../../server/lib/ldap/Logger");
const Manager_1 = require("../../../../server/lib/ldap/Manager");
const UserConverter_1 = require("../../../../server/lib/ldap/UserConverter");
const syncUserRoles_1 = require("../syncUserRoles");
const copyCustomFieldsLDAP_1 = require("./copyCustomFieldsLDAP");
class LDAPEEManager extends Manager_1.LDAPManager {
    static sync() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (server_1.settings.get('LDAP_Enable') !== true || server_1.settings.get('LDAP_Background_Sync') !== true) {
                return;
            }
            const createNewUsers = (_a = server_1.settings.get('LDAP_Background_Sync_Import_New_Users')) !== null && _a !== void 0 ? _a : true;
            const updateExistingUsers = (_b = server_1.settings.get('LDAP_Background_Sync_Keep_Existant_Users_Updated')) !== null && _b !== void 0 ? _b : true;
            let disableMissingUsers = updateExistingUsers && ((_c = server_1.settings.get('LDAP_Background_Sync_Disable_Missing_Users')) !== null && _c !== void 0 ? _c : false);
            const mergeExistingUsers = (_d = server_1.settings.get('LDAP_Background_Sync_Merge_Existent_Users')) !== null && _d !== void 0 ? _d : false;
            const options = this.getConverterOptions();
            options.skipExistingUsers = !updateExistingUsers;
            options.skipNewUsers = !createNewUsers;
            const ldap = new Connection_1.LDAPConnection();
            const converter = new UserConverter_1.LDAPUserConverter(options);
            const touchedUsers = new Set();
            try {
                yield ldap.connect();
                if (createNewUsers || mergeExistingUsers) {
                    yield this.importNewUsers(ldap, converter);
                }
                else if (updateExistingUsers) {
                    yield this.updateExistingUsers(ldap, converter, disableMissingUsers);
                    // Missing users will have been disabled automatically by the update operation, so no need to do a separate query for them
                    disableMissingUsers = false;
                }
                const membersOfGroupFilter = yield ldap.searchMembersOfGroupFilter();
                yield converter.convertData({
                    beforeImportFn: ((_a) => __awaiter(this, [_a], void 0, function* ({ options }) {
                        var _b;
                        if (!ldap.options.groupFilterEnabled || !ldap.options.groupFilterGroupMemberFormat) {
                            return true;
                        }
                        const memberFormat = (_b = ldap.options.groupFilterGroupMemberFormat) === null || _b === void 0 ? void 0 : _b.replace(/#{username}/g, (options === null || options === void 0 ? void 0 : options.username) || '#{username}').replace(/#{userdn}/g, (options === null || options === void 0 ? void 0 : options.dn) || '#{userdn}');
                        return membersOfGroupFilter.includes(memberFormat);
                    })),
                    afterImportFn: ((_a, isNewRecord_1) => __awaiter(this, [_a, isNewRecord_1], void 0, function* ({ data }, isNewRecord) {
                        if (data._id) {
                            touchedUsers.add(data._id);
                        }
                        yield this.advancedSync(ldap, data, converter, isNewRecord);
                    })),
                });
                if (disableMissingUsers) {
                    yield this.disableMissingUsers([...touchedUsers]);
                }
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
            ldap.disconnect();
        });
    }
    static syncAvatars() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('LDAP_Enable') !== true || server_1.settings.get('LDAP_Background_Sync_Avatars') !== true) {
                return;
            }
            try {
                const ldap = new Connection_1.LDAPConnection();
                yield ldap.connect();
                try {
                    yield this.updateUserAvatars(ldap);
                }
                finally {
                    ldap.disconnect();
                }
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
        });
    }
    static validateLDAPTeamsMappingChanges(json) {
        if (!json) {
            return;
        }
        const mustBeAnArrayOfStrings = (array) => Boolean(Array.isArray(array) && array.length && array.every((item) => typeof item === 'string'));
        const mappedTeams = this.parseJson(json);
        if (!mappedTeams) {
            return;
        }
        const mappedRocketChatTeams = Object.values(mappedTeams);
        const validStructureMapping = mappedRocketChatTeams.every(mustBeAnArrayOfStrings);
        if (!validStructureMapping) {
            throw new Error('Please verify your mapping for LDAP X RocketChat Teams. The structure is invalid, the structure should be an object like: {key: LdapTeam, value: [An array of rocket.chat teams]}');
        }
    }
    static syncLogout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('LDAP_Enable') !== true || server_1.settings.get('LDAP_Sync_AutoLogout_Enabled') !== true) {
                return;
            }
            try {
                const ldap = new Connection_1.LDAPConnection();
                yield ldap.connect();
                try {
                    yield this.logoutDeactivatedUsers(ldap);
                }
                finally {
                    ldap.disconnect();
                }
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
        });
    }
    static advancedSyncForUser(ldap, user, isNewRecord, dn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.syncUserRoles(ldap, user, dn);
                yield this.syncUserChannels(ldap, user, dn);
                yield this.syncUserTeams(ldap, user, dn, isNewRecord);
            }
            catch (e) {
                Logger_1.logger.debug(`Advanced Sync failed for user: ${dn}`);
                Logger_1.logger.error(e);
            }
        });
    }
    static advancedSync(ldap, importUser, converter, isNewRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield converter.findExistingUser(importUser);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                return;
            }
            const dn = importUser.importIds[0];
            return this.advancedSyncForUser(ldap, user, isNewRecord, dn);
        });
    }
    static isUserInGroup(ldap_1, baseDN_1, filter_1, _a, groupName_1) {
        return __awaiter(this, arguments, void 0, function* (ldap, baseDN, filter, { dn, username }, groupName) {
            if (!filter || !baseDN) {
                Logger_1.logger.error('Please setup LDAP Group Filter and LDAP Group BaseDN in LDAP Settings.');
                return false;
            }
            const searchOptions = {
                filter: filter
                    .replace(/#{username}/g, username)
                    .replace(/#{groupName}/g, groupName)
                    .replace(/#{userdn}/g, dn.replace(/\\/g, '\\5c')),
                scope: 'sub',
            };
            const result = yield ldap.searchRaw(baseDN, searchOptions);
            if (!Array.isArray(result) || result.length === 0) {
                Logger_1.logger.debug(`${username} is not in ${groupName} group!!!`);
            }
            else {
                Logger_1.logger.debug(`${username} is in ${groupName} group.`);
                return true;
            }
            return false;
        });
    }
    static parseJson(json) {
        try {
            return JSON.parse(json);
        }
        catch (err) {
            Logger_1.logger.error({ msg: 'Unexpected error', err });
        }
    }
    static syncUserRoles(ldap, user, dn) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            var _g, _h, _j, _k, _l, _m;
            const { username } = user;
            if (!username) {
                Logger_1.logger.debug('User has no username');
                return;
            }
            const shouldSyncUserRoles = (_g = server_1.settings.get('LDAP_Sync_User_Data_Roles')) !== null && _g !== void 0 ? _g : false;
            const syncUserRolesAutoRemove = (_h = server_1.settings.get('LDAP_Sync_User_Data_Roles_AutoRemove')) !== null && _h !== void 0 ? _h : false;
            const syncUserRolesFieldMap = ((_j = server_1.settings.get('LDAP_Sync_User_Data_RolesMap')) !== null && _j !== void 0 ? _j : '').trim();
            const syncUserRolesFilter = ((_k = server_1.settings.get('LDAP_Sync_User_Data_Roles_Filter')) !== null && _k !== void 0 ? _k : '').trim();
            const syncUserRolesBaseDN = ((_l = server_1.settings.get('LDAP_Sync_User_Data_Roles_BaseDN')) !== null && _l !== void 0 ? _l : '').trim();
            const searchStrategy = server_1.settings.get('LDAP_Sync_User_Data_Roles_GroupMembershipValidationStrategy');
            if (!shouldSyncUserRoles || !syncUserRolesFieldMap) {
                Logger_1.logger.debug('not syncing user roles');
                return;
            }
            const roles = (yield models_1.Roles.find({}, {
                projection: {
                    _id: 1,
                    name: 1,
                },
            }).toArray());
            if (!roles) {
                return;
            }
            const groupsToRolesMap = this.parseJson(syncUserRolesFieldMap);
            if (!groupsToRolesMap) {
                Logger_1.logger.debug('missing group role mapping');
                return;
            }
            const ldapGroups = Object.keys(groupsToRolesMap);
            const roleList = [];
            const roleIdsList = [];
            const allowedRoles = this.getDataMappedByLdapGroups(groupsToRolesMap, ldapGroups)
                .map((role) => role.split(/\.(.+)/)[0])
                .reduce((allowedRolesIds, roleIdOrName) => {
                var _a;
                const role = (_a = roles.find((role) => role._id === roleIdOrName)) !== null && _a !== void 0 ? _a : roles.find((role) => role.name === roleIdOrName);
                if (role) {
                    allowedRolesIds.push(role._id);
                }
                return allowedRolesIds;
            }, []);
            if (searchStrategy === 'once') {
                const ldapUserGroups = yield this.getLdapGroupsByUsername(ldap, username, dn, syncUserRolesBaseDN, syncUserRolesFilter);
                roleList.push(...this.getDataMappedByLdapGroups(groupsToRolesMap, ldapUserGroups));
            }
            else if (searchStrategy === 'each_group') {
                try {
                    for (var _o = true, ldapGroups_1 = __asyncValues(ldapGroups), ldapGroups_1_1; ldapGroups_1_1 = yield ldapGroups_1.next(), _a = ldapGroups_1_1.done, !_a; _o = true) {
                        _c = ldapGroups_1_1.value;
                        _o = false;
                        const ldapGroup = _c;
                        if (yield this.isUserInGroup(ldap, syncUserRolesBaseDN, syncUserRolesFilter, { dn, username }, ldapGroup)) {
                            roleList.push(...(0, arrayUtils_1.ensureArray)(groupsToRolesMap[ldapGroup]));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_o && !_a && (_b = ldapGroups_1.return)) yield _b.call(ldapGroups_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            try {
                for (var _p = true, roleList_1 = __asyncValues(roleList), roleList_1_1; roleList_1_1 = yield roleList_1.next(), _d = roleList_1_1.done, !_d; _p = true) {
                    _f = roleList_1_1.value;
                    _p = false;
                    const nonValidatedRole = _f;
                    const [roleIdOrName] = nonValidatedRole.split(/\.(.+)/);
                    const role = (_m = roles.find((role) => role._id === roleIdOrName)) !== null && _m !== void 0 ? _m : roles.find((role) => role.name === roleIdOrName);
                    if (role) {
                        roleIdsList.push(role._id);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_p && !_d && (_e = roleList_1.return)) yield _e.call(roleList_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            yield (0, syncUserRoles_1.syncUserRoles)(user._id, roleIdsList, {
                allowedRoles,
                skipRemovingRoles: !syncUserRolesAutoRemove,
            });
        });
    }
    static createRoomForSync(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.logger.debug(`Channel '${channel}' doesn't exist, creating it.`);
            const roomOwner = server_1.settings.get('LDAP_Sync_User_Data_Channels_Admin') || '';
            const user = yield models_1.Users.findOneByUsernameIgnoringCase(roomOwner);
            const room = yield (0, createRoom_1.createRoom)('c', channel, user, [], false, false, {
                customFields: { ldap: true },
            });
            if (!(room === null || room === void 0 ? void 0 : room.rid)) {
                Logger_1.logger.error(`Unable to auto-create channel '${channel}' during ldap sync.`);
                return;
            }
            room._id = room.rid;
            return room;
        });
    }
    static syncUserChannels(ldap, user, dn) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_3, _b, _c, _d, e_4, _e, _f, _g, e_5, _h, _j;
            var _k, _l, _m, _o, _p;
            const syncUserChannels = (_k = server_1.settings.get('LDAP_Sync_User_Data_Channels')) !== null && _k !== void 0 ? _k : false;
            const syncUserChannelsRemove = (_l = server_1.settings.get('LDAP_Sync_User_Data_Channels_Enforce_AutoChannels')) !== null && _l !== void 0 ? _l : false;
            const syncUserChannelsFieldMap = ((_m = server_1.settings.get('LDAP_Sync_User_Data_ChannelsMap')) !== null && _m !== void 0 ? _m : '').trim();
            const syncUserChannelsFilter = ((_o = server_1.settings.get('LDAP_Sync_User_Data_Channels_Filter')) !== null && _o !== void 0 ? _o : '').trim();
            const syncUserChannelsBaseDN = ((_p = server_1.settings.get('LDAP_Sync_User_Data_Channels_BaseDN')) !== null && _p !== void 0 ? _p : '').trim();
            const searchStrategy = server_1.settings.get('LDAP_Sync_User_Data_Channels_GroupMembershipValidationStrategy');
            if (!syncUserChannels || !syncUserChannelsFieldMap) {
                Logger_1.logger.debug('not syncing groups to channels');
                return;
            }
            const groupsToRoomsMap = this.parseJson(syncUserChannelsFieldMap);
            if (!groupsToRoomsMap) {
                Logger_1.logger.debug('missing group channel mapping');
                return;
            }
            const { username } = user;
            if (!username) {
                return;
            }
            Logger_1.logger.debug('syncing user channels');
            const ldapGroups = Object.keys(groupsToRoomsMap);
            const ldapUserGroups = [];
            const channelsToAdd = new Set();
            const userChannelsNames = [];
            if (searchStrategy === 'once') {
                ldapUserGroups.push(...(yield this.getLdapGroupsByUsername(ldap, username, dn, syncUserChannelsBaseDN, syncUserChannelsFilter)));
                userChannelsNames.push(...this.getDataMappedByLdapGroups(groupsToRoomsMap, ldapUserGroups));
            }
            else if (searchStrategy === 'each_group') {
                try {
                    for (var _q = true, ldapGroups_2 = __asyncValues(ldapGroups), ldapGroups_2_1; ldapGroups_2_1 = yield ldapGroups_2.next(), _a = ldapGroups_2_1.done, !_a; _q = true) {
                        _c = ldapGroups_2_1.value;
                        _q = false;
                        const ldapGroup = _c;
                        if (yield this.isUserInGroup(ldap, syncUserChannelsBaseDN, syncUserChannelsFilter, { dn, username }, ldapGroup)) {
                            userChannelsNames.push(...(0, arrayUtils_1.ensureArray)(groupsToRoomsMap[ldapGroup]));
                            ldapUserGroups.push(ldapGroup);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_q && !_a && (_b = ldapGroups_2.return)) yield _b.call(ldapGroups_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            try {
                for (var _r = true, userChannelsNames_1 = __asyncValues(userChannelsNames), userChannelsNames_1_1; userChannelsNames_1_1 = yield userChannelsNames_1.next(), _d = userChannelsNames_1_1.done, !_d; _r = true) {
                    _f = userChannelsNames_1_1.value;
                    _r = false;
                    const userChannelName = _f;
                    try {
                        const name = yield (0, getValidRoomName_1.getValidRoomName)(userChannelName.trim(), undefined, { allowDuplicates: true });
                        const room = (yield models_1.Rooms.findOneByNonValidatedName(name)) || (yield this.createRoomForSync(userChannelName));
                        if (!room) {
                            return;
                        }
                        if (room.teamMain) {
                            Logger_1.logger.error(`Can't add user to channel ${userChannelName} because it is a team.`);
                        }
                        else {
                            channelsToAdd.add(room._id);
                            yield (0, addUserToRoom_1.addUserToRoom)(room._id, user);
                            Logger_1.logger.debug(`Synced user channel ${room._id} from LDAP for ${username}`);
                        }
                    }
                    catch (e) {
                        Logger_1.logger.debug(`Failed to sync user room, user = ${username}, channel = ${userChannelName}`);
                        Logger_1.logger.error(e);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_r && !_d && (_e = userChannelsNames_1.return)) yield _e.call(userChannelsNames_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (syncUserChannelsRemove) {
                const notInUserGroups = ldapGroups.filter((ldapGroup) => !ldapUserGroups.includes(ldapGroup));
                const notMappedRooms = this.getDataMappedByLdapGroups(groupsToRoomsMap, notInUserGroups);
                const roomsToRemove = new Set(notMappedRooms);
                try {
                    for (var _s = true, roomsToRemove_1 = __asyncValues(roomsToRemove), roomsToRemove_1_1; roomsToRemove_1_1 = yield roomsToRemove_1.next(), _g = roomsToRemove_1_1.done, !_g; _s = true) {
                        _j = roomsToRemove_1_1.value;
                        _s = false;
                        const roomName = _j;
                        const name = yield (0, getValidRoomName_1.getValidRoomName)(roomName.trim(), undefined, { allowDuplicates: true });
                        const room = yield models_1.Rooms.findOneByNonValidatedName(name);
                        if (!room || room.teamMain || channelsToAdd.has(room._id)) {
                            return;
                        }
                        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, user._id);
                        if (subscription) {
                            yield (0, removeUserFromRoom_1.removeUserFromRoom)(room._id, user);
                            Logger_1.logger.debug(`Removed user ${username} from channel ${room._id}`);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (!_s && !_g && (_h = roomsToRemove_1.return)) yield _h.call(roomsToRemove_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        });
    }
    static syncUserTeams(ldap, user, dn, isNewRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!user.username) {
                return;
            }
            const mapTeams = server_1.settings.get('LDAP_Enable_LDAP_Groups_To_RC_Teams') &&
                (isNewRecord || server_1.settings.get('LDAP_Validate_Teams_For_Each_Login'));
            if (!mapTeams) {
                return;
            }
            const baseDN = ((_a = server_1.settings.get('LDAP_Teams_BaseDN')) !== null && _a !== void 0 ? _a : '').trim() || ldap.options.baseDN;
            const filter = server_1.settings.get('LDAP_Query_To_Get_User_Teams');
            const groupAttributeName = server_1.settings.get('LDAP_Teams_Name_Field');
            const ldapUserTeams = yield this.getLdapGroupsByUsername(ldap, user.username, dn, baseDN, filter, groupAttributeName);
            const mapJson = server_1.settings.get('LDAP_Groups_To_Rocket_Chat_Teams');
            if (!mapJson) {
                return;
            }
            const map = this.parseJson(mapJson);
            if (!map) {
                return;
            }
            const teamNames = this.getDataMappedByLdapGroups(map, ldapUserTeams);
            const allTeamNames = [...new Set(Object.values(map).flat())];
            const allTeams = yield core_services_1.Team.listByNames(allTeamNames, { projection: { _id: 1, name: 1 } });
            const inTeamIds = allTeams.filter(({ name }) => teamNames.includes(name)).map(({ _id }) => _id);
            const notInTeamIds = allTeams.filter(({ name }) => !teamNames.includes(name)).map(({ _id }) => _id);
            const currentTeams = yield core_services_1.Team.listTeamsBySubscriberUserId(user._id, {
                projection: { teamId: 1 },
            });
            const currentTeamIds = currentTeams === null || currentTeams === void 0 ? void 0 : currentTeams.map(({ teamId }) => teamId);
            const teamsToRemove = currentTeamIds === null || currentTeamIds === void 0 ? void 0 : currentTeamIds.filter((teamId) => notInTeamIds.includes(teamId));
            const teamsToAdd = inTeamIds.filter((teamId) => !(currentTeamIds === null || currentTeamIds === void 0 ? void 0 : currentTeamIds.includes(teamId)));
            yield core_services_1.Team.insertMemberOnTeams(user._id, teamsToAdd);
            if (teamsToRemove) {
                yield core_services_1.Team.removeMemberFromTeams(user._id, teamsToRemove);
            }
        });
    }
    static getDataMappedByLdapGroups(map, ldapGroups) {
        const mappedLdapGroups = Object.keys(map);
        const filteredMappedLdapGroups = ldapGroups.filter((ldapGroup) => mappedLdapGroups.includes(ldapGroup));
        if (filteredMappedLdapGroups.length < ldapGroups.length) {
            const unmappedLdapGroups = ldapGroups.filter((ldapGroup) => !mappedLdapGroups.includes(ldapGroup));
            Logger_1.logger.error(`The following LDAP groups are not mapped in Rocket.Chat: "${unmappedLdapGroups.join(', ')}".`);
        }
        if (!filteredMappedLdapGroups.length) {
            return [];
        }
        return [...new Set(filteredMappedLdapGroups.map((ldapGroup) => map[ldapGroup]).flat())];
    }
    static getLdapGroupsByUsername(ldap, username, userDN, baseDN, filter, groupAttributeName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filter) {
                return [];
            }
            const searchOptions = {
                filter: filter.replace(/#{username}/g, username).replace(/#{userdn}/g, userDN.replace(/\\/g, '\\5c')),
                scope: ldap.options.userSearchScope || 'sub',
                sizeLimit: ldap.options.searchSizeLimit,
            };
            const attributeNames = groupAttributeName ? groupAttributeName.split(',').map((attributeName) => attributeName.trim()) : ['ou', 'cn'];
            const ldapUserGroups = yield ldap.searchRaw(baseDN, searchOptions);
            if (!Array.isArray(ldapUserGroups)) {
                return [];
            }
            return ldapUserGroups
                .map((entry) => {
                if (!(entry === null || entry === void 0 ? void 0 : entry.raw)) {
                    return undefined;
                }
                for (const attributeName of attributeNames) {
                    if (entry.raw[attributeName]) {
                        return ldap.extractLdapAttribute(entry.raw[attributeName]);
                    }
                }
                return undefined;
            })
                .filter((entry) => Boolean(entry))
                .flat();
        });
    }
    static isUserDeactivated(ldapUser) {
        // Account locked by "Draft-behera-ldap-password-policy"
        if (ldapUser.pwdAccountLockedTime) {
            Logger_1.mapLogger.debug('User account is locked by password policy (attribute pwdAccountLockedTime)');
            return true;
        }
        // EDirectory: Account manually disabled by an admin
        if (ldapUser.loginDisabled) {
            Logger_1.mapLogger.debug('User account was manually disabled by an admin (attribute loginDisabled)');
            return true;
        }
        // Oracle: Account must not be allowed to authenticate
        if (ldapUser.orclIsEnabled && ldapUser.orclIsEnabled !== 'ENABLED') {
            Logger_1.mapLogger.debug('User must not be allowed to authenticate (attribute orclIsEnabled)');
            return true;
        }
        // Active Directory - Account locked automatically by security policies
        if (ldapUser.lockoutTime && ldapUser.lockoutTime !== '0') {
            const lockoutTimeValue = Number(ldapUser.lockoutTime);
            if (lockoutTimeValue && !isNaN(lockoutTimeValue)) {
                // Automatic unlock is disabled
                if (!ldapUser.lockoutDuration) {
                    Logger_1.mapLogger.debug('User account locked indefinitely by security policy (attribute lockoutTime)');
                    return true;
                }
                const lockoutTime = new Date(lockoutTimeValue);
                lockoutTime.setMinutes(lockoutTime.getMinutes() + Number(ldapUser.lockoutDuration));
                // Account has not unlocked itself yet
                if (lockoutTime.valueOf() > Date.now()) {
                    Logger_1.mapLogger.debug('User account locked temporarily by security policy (attribute lockoutTime)');
                    return true;
                }
            }
        }
        // Active Directory - Account disabled by an Admin
        if (ldapUser.userAccountControl && (ldapUser.userAccountControl & 2) === 2) {
            Logger_1.mapLogger.debug('User account disabled by an admin (attribute userAccountControl)');
            return true;
        }
        return false;
    }
    static copyActiveState(ldapUser, userData) {
        if (!ldapUser) {
            return;
        }
        const syncUserState = server_1.settings.get('LDAP_Sync_User_Active_State');
        if (syncUserState === 'none') {
            return;
        }
        const deleted = this.isUserDeactivated(ldapUser);
        if (deleted === userData.deleted) {
            return;
        }
        if (syncUserState === 'disable' && !deleted) {
            return;
        }
        if (syncUserState === 'enable' && deleted) {
            return;
        }
        userData.deleted = deleted;
        Logger_1.logger.info(`${deleted ? 'Deactivating' : 'Activating'} user ${userData.name} (${userData.username})`);
    }
    static copyCustomFields(ldapUser, userData) {
        return (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            customFieldsSettings: server_1.settings.get('Accounts_CustomFields'),
            customFieldsMap: server_1.settings.get('LDAP_CustomFieldMap'),
            syncCustomFields: server_1.settings.get('LDAP_Sync_Custom_Fields'),
        }, Logger_1.logger);
    }
    static importNewUsers(ldap, converter) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let count = 0;
                void ldap.searchAllUsers({
                    entryCallback: (entry) => {
                        const data = ldap.extractLdapEntryData(entry);
                        count++;
                        const userData = this.mapUserData(data);
                        converter.addObjectToMemory(userData, { dn: data.dn, username: this.getLdapUsername(data) });
                        return userData;
                    },
                    endCallback: (error) => {
                        if (error) {
                            Logger_1.logger.error(error);
                            reject(error);
                            return;
                        }
                        Logger_1.logger.info('LDAP finished loading users. Users added to importer: ', count);
                        resolve();
                    },
                });
            });
        });
    }
    static updateExistingUsers(ldap_1, converter_1) {
        return __awaiter(this, arguments, void 0, function* (ldap, converter, disableMissingUsers = false) {
            var _a, e_6, _b, _c;
            const users = yield models_1.Users.findLDAPUsers().toArray();
            try {
                for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                    _c = users_1_1.value;
                    _d = false;
                    const user = _c;
                    const ldapUser = yield this.findLDAPUser(ldap, user);
                    if (ldapUser) {
                        const userData = this.mapUserData(ldapUser, user.username);
                        converter.addObjectToMemory(userData, { dn: ldapUser.dn, username: this.getLdapUsername(ldapUser) });
                    }
                    else if (disableMissingUsers) {
                        yield (0, setUserActiveStatus_1.setUserActiveStatus)(user._id, false, true);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = users_1.return)) yield _b.call(users_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        });
    }
    static disableMissingUsers(foundUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIds = (yield models_1.Users.findLDAPUsersExceptIds(foundUsers, { projection: { _id: 1 } }).toArray()).map(({ _id }) => _id);
            yield Promise.allSettled(userIds.map((id) => (0, setUserActiveStatus_1.setUserActiveStatus)(id, false, true)));
        });
    }
    static updateUserAvatars(ldap) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_7, _b, _c;
            const users = yield models_1.Users.findLDAPUsers().toArray();
            try {
                for (var _d = true, users_2 = __asyncValues(users), users_2_1; users_2_1 = yield users_2.next(), _a = users_2_1.done, !_a; _d = true) {
                    _c = users_2_1.value;
                    _d = false;
                    const user = _c;
                    const ldapUser = yield this.findLDAPUser(ldap, user);
                    if (!ldapUser) {
                        continue;
                    }
                    yield Manager_1.LDAPManager.syncUserAvatar(user, ldapUser);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = users_2.return)) yield _b.call(users_2);
                }
                finally { if (e_7) throw e_7.error; }
            }
        });
    }
    static findLDAPUser(ldap, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if ((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.ldap) === null || _b === void 0 ? void 0 : _b.id) {
                return ldap.findOneById(user.services.ldap.id, user.services.ldap.idAttribute);
            }
            if (user.username) {
                return ldap.findOneByUsername(user.username);
            }
            Logger_1.searchLogger.debug({
                msg: 'existing LDAP user not found during Sync',
                ldapId: (_d = (_c = user.services) === null || _c === void 0 ? void 0 : _c.ldap) === null || _d === void 0 ? void 0 : _d.id,
                ldapAttribute: (_f = (_e = user.services) === null || _e === void 0 ? void 0 : _e.ldap) === null || _f === void 0 ? void 0 : _f.idAttribute,
                username: user.username,
            });
        });
    }
    static logoutDeactivatedUsers(ldap) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_8, _b, _c;
            const users = yield models_1.Users.findConnectedLDAPUsers().toArray();
            try {
                for (var _d = true, users_3 = __asyncValues(users), users_3_1; users_3_1 = yield users_3.next(), _a = users_3_1.done, !_a; _d = true) {
                    _c = users_3_1.value;
                    _d = false;
                    const user = _c;
                    const ldapUser = yield this.findLDAPUser(ldap, user);
                    if (!ldapUser) {
                        continue;
                    }
                    if (this.isUserDeactivated(ldapUser)) {
                        yield models_1.Users.unsetLoginTokens(user._id);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = users_3.return)) yield _b.call(users_3);
                }
                finally { if (e_8) throw e_8.error; }
            }
        });
    }
}
exports.LDAPEEManager = LDAPEEManager;
