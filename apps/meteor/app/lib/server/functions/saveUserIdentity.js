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
exports.saveUserIdentity = saveUserIdentity;
const models_1 = require("@rocket.chat/models");
const setRealName_1 = require("./setRealName");
const setUsername_1 = require("./setUsername");
const updateGroupDMsName_1 = require("./updateGroupDMsName");
const validateName_1 = require("./validateName");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../file-upload/server");
const notifyListener_1 = require("../lib/notifyListener");
/**
 *
 * @param {object} changes changes to the user
 */
function saveUserIdentity(_a) {
    return __awaiter(this, arguments, void 0, function* ({ _id, name: rawName, username: rawUsername, updateUsernameInBackground = false, }) {
        if (!_id) {
            return false;
        }
        const name = String(rawName).trim();
        const username = String(rawUsername).trim();
        const user = yield models_1.Users.findOneById(_id);
        if (!user) {
            return false;
        }
        const previousUsername = user.username;
        const previousName = user.name;
        const nameChanged = previousName !== name;
        const usernameChanged = previousUsername !== username;
        if (typeof rawUsername !== 'undefined' && usernameChanged) {
            if (!(0, validateName_1.validateName)(username)) {
                return false;
            }
            if (!(yield (0, setUsername_1._setUsername)(_id, username, user))) {
                return false;
            }
            user.username = username;
        }
        if (typeof rawName !== 'undefined' && nameChanged) {
            if (!(yield (0, setRealName_1._setRealName)(_id, name, user))) {
                return false;
            }
        }
        // if coming from old username, update all references
        if (previousUsername) {
            const handleUpdateParams = {
                username,
                previousUsername,
                rawUsername,
                usernameChanged,
                user,
                name,
                previousName,
                rawName,
                nameChanged,
            };
            if (updateUsernameInBackground) {
                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield updateUsernameReferences(handleUpdateParams);
                    }
                    catch (err) {
                        system_1.SystemLogger.error(err);
                    }
                }));
            }
            else {
                yield updateUsernameReferences(handleUpdateParams);
            }
        }
        return true;
    });
}
function updateUsernameReferences(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, previousUsername, rawUsername, usernameChanged, user, name, previousName, rawName, nameChanged, }) {
        var _b, e_1, _c, _d;
        var _e, _f, _g, _h;
        if (usernameChanged && typeof rawUsername !== 'undefined') {
            const fileStore = server_1.FileUpload.getStore('Avatars');
            const previousFile = yield fileStore.model.findOneByName(previousUsername);
            const file = yield fileStore.model.findOneByName(username);
            if (file) {
                yield fileStore.model.deleteFile(file._id);
            }
            if (previousFile) {
                yield fileStore.model.updateFileNameById(previousFile._id, username);
            }
            yield models_1.Messages.updateAllUsernamesByUserId(user._id, username);
            yield models_1.Messages.updateUsernameOfEditByUserId(user._id, username);
            const cursor = models_1.Messages.findByMention(previousUsername);
            try {
                for (var _j = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _b = cursor_1_1.done, !_b; _j = true) {
                    _d = cursor_1_1.value;
                    _j = false;
                    const msg = _d;
                    const updatedMsg = msg.msg.replace(new RegExp(`@${previousUsername}`, 'ig'), `@${username}`);
                    yield models_1.Messages.updateUsernameAndMessageOfMentionByIdAndOldUsername(msg._id, previousUsername, username, updatedMsg);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_j && !_b && (_c = cursor_1.return)) yield _c.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const responses = yield Promise.all([
                models_1.Rooms.replaceUsername(previousUsername, username),
                models_1.Rooms.replaceMutedUsername(previousUsername, username),
                models_1.Rooms.replaceUsernameOfUserByUserId(user._id, username),
                models_1.Subscriptions.setUserUsernameByUserId(user._id, username),
                models_1.LivechatDepartmentAgents.replaceUsernameOfAgentByUserId(user._id, username),
            ]);
            if ((_e = responses[3]) === null || _e === void 0 ? void 0 : _e.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByUserId)(user._id);
            }
            if (((_f = responses[0]) === null || _f === void 0 ? void 0 : _f.modifiedCount) || ((_g = responses[1]) === null || _g === void 0 ? void 0 : _g.modifiedCount) || ((_h = responses[2]) === null || _h === void 0 ? void 0 : _h.modifiedCount)) {
                void (0, notifyListener_1.notifyOnRoomChangedByUsernamesOrUids)([user._id], [previousUsername, username]);
            }
        }
        // update other references if either the name or username has changed
        if (usernameChanged || nameChanged) {
            // update name and fname of 1-on-1 direct messages
            const updateDirectNameResponse = yield models_1.Subscriptions.updateDirectNameAndFnameByName(previousUsername, rawUsername && username, rawName && name);
            if (updateDirectNameResponse === null || updateDirectNameResponse === void 0 ? void 0 : updateDirectNameResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByNameAndRoomType)({
                    t: 'd',
                    name: username,
                });
            }
            // update name and fname of group direct messages
            yield (0, updateGroupDMsName_1.updateGroupDMsName)(user);
            // update name and username of users on video conferences
            yield models_1.VideoConference.updateUserReferences(user._id, username || previousUsername, name || previousName);
        }
    });
}
