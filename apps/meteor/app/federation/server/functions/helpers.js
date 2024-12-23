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
exports.getFederatedRoomData = exports.isLocalUser = exports.hasExternalDomain = exports.checkRoomDomainsLength = exports.checkRoomType = exports.isFullyQualified = exports.getNameAndDomain = void 0;
exports.isRegisteringOrEnabled = isRegisteringOrEnabled;
exports.updateStatus = updateStatus;
exports.updateEnabled = updateEnabled;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const constants_1 = require("../constants");
const getNameAndDomain = (fullyQualifiedName) => fullyQualifiedName.split('@');
exports.getNameAndDomain = getNameAndDomain;
const isFullyQualified = (name) => name.indexOf('@') !== -1;
exports.isFullyQualified = isFullyQualified;
function isRegisteringOrEnabled() {
    return __awaiter(this, void 0, void 0, function* () {
        const value = yield models_1.Settings.getValueById('FEDERATION_Status');
        return typeof value === 'string' && [constants_1.STATUS_ENABLED, constants_1.STATUS_REGISTERING].includes(value);
    });
}
function updateStatus(status) {
    return __awaiter(this, void 0, void 0, function* () {
        // No need to call ws listener because current function is called on startup
        yield models_1.Settings.updateValueById('FEDERATION_Status', status);
    });
}
function updateEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        (yield models_1.Settings.updateValueById('FEDERATION_Enabled', enabled)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)('FEDERATION_Enabled');
    });
}
const checkRoomType = (room) => room.t === 'p' || room.t === 'd';
exports.checkRoomType = checkRoomType;
const checkRoomDomainsLength = (domains) => { var _a; return domains.length <= Number((_a = process.env.FEDERATED_DOMAINS_LENGTH) !== null && _a !== void 0 ? _a : 10); };
exports.checkRoomDomainsLength = checkRoomDomainsLength;
const hasExternalDomain = ({ federation }) => {
    // same test as isFederated(room)
    if (!federation) {
        return false;
    }
    return federation.domains.some((domain) => domain !== federation.origin);
};
exports.hasExternalDomain = hasExternalDomain;
const isLocalUser = ({ federation }, localDomain) => !federation || federation.origin === localDomain;
exports.isLocalUser = isLocalUser;
const getFederatedRoomData = (room) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, core_typings_1.isDirectMessageRoom)(room)) {
        // Check if there is a federated user on this room
        return {
            users: [],
            hasFederatedUser: room.usernames.some(exports.isFullyQualified),
            subscriptions: undefined,
        };
    }
    // Find all subscriptions of this room
    const s = yield models_1.Subscriptions.findByRoomIdWhenUsernameExists(room._id).toArray();
    const subscriptions = s.reduce((acc, s) => {
        acc[s.u._id] = s;
        return acc;
    }, {});
    // Get all user ids
    const userIds = Object.keys(subscriptions);
    // Load all the users
    const users = yield models_1.Users.findUsersWithUsernameByIds(userIds).toArray();
    // Check if there is a federated user on this room
    const hasFederatedUser = users.some((u) => u.username && (0, exports.isFullyQualified)(u.username));
    return {
        hasFederatedUser,
        users,
        subscriptions,
    };
});
exports.getFederatedRoomData = getFederatedRoomData;
