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
exports.checkUsernameAvailability = exports.checkUsernameAvailabilityWithValidation = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const validateName_1 = require("./validateName");
const server_1 = require("../../../settings/server");
let usernameBlackList = [];
const toRegExp = (username) => new RegExp(`^${(0, string_helpers_1.escapeRegExp)(username).trim()}$`, 'i');
server_1.settings.watch('Accounts_BlockedUsernameList', (value) => {
    usernameBlackList = ['all', 'here'].concat(value.split(',')).map(toRegExp);
});
const usernameIsBlocked = (username, usernameBlackList) => usernameBlackList.length && usernameBlackList.some((restrictedUsername) => restrictedUsername.test((0, string_helpers_1.escapeRegExp)(username).trim()));
const checkUsernameAvailabilityWithValidation = function (userId, username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!username) {
            throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', { method: 'setUsername' });
        }
        const user = yield models_1.Users.findOneById(userId, { projection: { username: 1 } });
        if (!user) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setUsername' });
        }
        if (user.username && !server_1.settings.get('Accounts_AllowUsernameChange')) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setUsername' });
        }
        if (user.username === username) {
            return true;
        }
        return (0, exports.checkUsernameAvailability)(username);
    });
};
exports.checkUsernameAvailabilityWithValidation = checkUsernameAvailabilityWithValidation;
const checkUsernameAvailability = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (usernameIsBlocked(username, usernameBlackList) || !(0, validateName_1.validateName)(username)) {
            throw new meteor_1.Meteor.Error('error-blocked-username', `${underscore_1.default.escape(username)} is blocked and can't be used!`, {
                method: 'checkUsernameAvailability',
                field: username,
            });
        }
        // Make sure no users are using this username
        const existingUser = yield models_1.Users.findOneByUsernameIgnoringCase(username, {
            projection: { _id: 1 },
        });
        if (existingUser) {
            return false;
        }
        // Make sure no teams are using this username
        const existingTeam = yield core_services_1.Team.getOneByName(toRegExp(username), { projection: { _id: 1 } });
        if (existingTeam) {
            return false;
        }
        return true;
    });
};
exports.checkUsernameAvailability = checkUsernameAvailability;
