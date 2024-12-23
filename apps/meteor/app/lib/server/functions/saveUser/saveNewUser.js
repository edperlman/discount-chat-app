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
exports.saveNewUser = void 0;
const models_1 = require("@rocket.chat/models");
const gravatar_1 = __importDefault(require("gravatar"));
const getNewUserRoles_1 = require("../../../../../server/services/user/lib/getNewUserRoles");
const server_1 = require("../../../../settings/server");
const notifyListener_1 = require("../../lib/notifyListener");
const validateEmailDomain_1 = require("../../lib/validateEmailDomain");
const setUserAvatar_1 = require("../setUserAvatar");
const handleBio_1 = require("./handleBio");
const handleNickname_1 = require("./handleNickname");
const sendUserEmail_1 = require("./sendUserEmail");
const saveNewUser = function (userData, sendPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validateEmailDomain_1.validateEmailDomain)(userData.email);
        const roles = (!!userData.roles && userData.roles.length > 0 && userData.roles) || (0, getNewUserRoles_1.getNewUserRoles)();
        const isGuest = roles && roles.length === 1 && roles.includes('guest');
        // insert user
        const createUser = {
            username: userData.username,
            password: userData.password,
            joinDefaultChannels: userData.joinDefaultChannels,
            isGuest,
            globalRoles: roles,
            skipNewUserRolesSetting: true,
        };
        if (userData.email) {
            createUser.email = userData.email;
        }
        const _id = yield Accounts.createUserAsync(createUser);
        const updateUser = {
            $set: Object.assign(Object.assign({}, (typeof userData.name !== 'undefined' && { name: userData.name })), { settings: userData.settings || {} }),
        };
        if (typeof userData.requirePasswordChange !== 'undefined') {
            updateUser.$set.requirePasswordChange = userData.requirePasswordChange;
        }
        if (typeof userData.verified === 'boolean') {
            updateUser.$set['emails.0.verified'] = userData.verified;
        }
        (0, handleBio_1.handleBio)(updateUser, userData.bio);
        (0, handleNickname_1.handleNickname)(updateUser, userData.nickname);
        yield models_1.Users.updateOne({ _id }, updateUser);
        if (userData.sendWelcomeEmail) {
            yield (0, sendUserEmail_1.sendWelcomeEmail)(userData);
        }
        if (sendPassword) {
            yield (0, sendUserEmail_1.sendPasswordEmail)(userData);
        }
        userData._id = _id;
        if (server_1.settings.get('Accounts_SetDefaultAvatar') === true && userData.email) {
            const gravatarUrl = gravatar_1.default.url(userData.email, {
                default: '404',
                size: '200',
                protocol: 'https',
            });
            try {
                yield (0, setUserAvatar_1.setUserAvatar)(Object.assign(Object.assign({}, userData), { _id }), gravatarUrl, '', 'url');
            }
            catch (e) {
                // Ignore this error for now, as it not being successful isn't bad
            }
        }
        void (0, notifyListener_1.notifyOnUserChangeById)({ clientAction: 'inserted', id: _id });
        return _id;
    });
};
exports.saveNewUser = saveNewUser;
