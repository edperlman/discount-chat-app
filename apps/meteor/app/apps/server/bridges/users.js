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
exports.AppUserBridge = void 0;
const UserBridge_1 = require("@rocket.chat/apps-engine/server/bridges/UserBridge");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const checkUsernameAvailability_1 = require("../../../lib/server/functions/checkUsernameAvailability");
const deleteUser_1 = require("../../../lib/server/functions/deleteUser");
const getUserCreatedByApp_1 = require("../../../lib/server/functions/getUserCreatedByApp");
const setUserActiveStatus_1 = require("../../../lib/server/functions/setUserActiveStatus");
const setUserAvatar_1 = require("../../../lib/server/functions/setUserAvatar");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
class AppUserBridge extends UserBridge_1.UserBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    getById(userId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the userId: "${userId}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertById(userId);
            return promise;
        });
    }
    getByUsername(username, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the username: "${username}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertByUsername(username);
            return promise;
        });
    }
    getAppUser(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting its assigned user`);
            if (!appId) {
                return;
            }
            const user = yield models_1.Users.findOneByAppId(appId, {});
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertToApp(user);
        });
    }
    /**
     * Deletes all bot or app users created by the App.
     * @param appId the App's ID.
     * @param type the type of the user to be deleted.
     * @returns true if any user was deleted, false otherwise.
     */
    deleteUsersCreatedByApp(appId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is deleting all bot users`);
            const appUsers = yield (0, getUserCreatedByApp_1.getUserCreatedByApp)(appId, type);
            if (appUsers.length) {
                this.orch.debugLog(`The App ${appId} is deleting ${appUsers.length} users`);
                yield Promise.all(appUsers.map((appUser) => (0, deleteUser_1.deleteUser)(appUser._id)));
                return true;
            }
            return false;
        });
    }
    create(userDescriptor, appId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is requesting to create a new user.`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const user = (_a = this.orch
                .getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertToRocketChat(userDescriptor);
            if (!user._id) {
                user._id = random_1.Random.id();
            }
            if (!user.createdAt) {
                user.createdAt = new Date();
            }
            switch (user.type) {
                case 'bot':
                case 'app':
                    if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(user.username))) {
                        throw new Error(`The username "${user.username}" is already being used. Rename or remove the user using it to install this App`);
                    }
                    yield models_1.Users.insertOne(user);
                    if (options === null || options === void 0 ? void 0 : options.avatarUrl) {
                        yield (0, setUserAvatar_1.setUserAvatar)(user, options.avatarUrl, '', 'local');
                    }
                    break;
                default:
                    throw new Error('Creating normal users is currently not supported');
            }
            void (0, notifyListener_1.notifyOnUserChangeById)({ clientAction: 'inserted', id: user._id });
            return user._id;
        });
    }
    remove(user, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App's user is being removed: ${appId}`);
            // It's actually not a problem if there is no App user to delete - just means we don't need to do anything more.
            if (!user) {
                return true;
            }
            try {
                yield (0, deleteUser_1.deleteUser)(user.id);
            }
            catch (err) {
                throw new Error(`Errors occurred while deleting an app user: ${err}`);
            }
            return true;
        });
    }
    update(user, fields, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is updating a user`);
            if (!user) {
                throw new Error('User not provided');
            }
            if (!Object.keys(fields).length) {
                return true;
            }
            const { status } = fields;
            delete fields.status;
            if (status) {
                yield core_services_1.Presence.setStatus(user.id, status, fields.statusText);
            }
            yield models_1.Users.updateOne({ _id: user.id }, { $set: fields });
            void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: user.id, diff: fields });
            return true;
        });
    }
    deactivate(userId, confirmRelinquish, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is deactivating a user.`);
            if (!userId) {
                throw new Error('Invalid user id');
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const convertedUser = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertById(userId));
            const { id: uid } = convertedUser;
            yield (0, setUserActiveStatus_1.setUserActiveStatus)(uid, false, confirmRelinquish);
            return true;
        });
    }
    getActiveUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.getActiveLocalUserCount();
        });
    }
    getUserUnreadMessageCount(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Subscriptions.getBadgeCount(uid);
        });
    }
}
exports.AppUserBridge = AppUserBridge;
