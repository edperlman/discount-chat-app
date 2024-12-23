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
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const LivechatTyped_1 = require("../lib/LivechatTyped");
const wasAgent = (user) => { var _a; return (_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('livechat-agent'); };
const isAgent = (user) => { var _a; return (_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.includes('livechat-agent'); };
const handleAgentUpdated = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: newUser, oldUser } = userData;
    if (wasAgent(oldUser) && !isAgent(newUser)) {
        yield LivechatTyped_1.Livechat.afterRemoveAgent(newUser);
    }
    if (!wasAgent(oldUser) && isAgent(newUser)) {
        yield LivechatTyped_1.Livechat.afterAgentAdded(newUser);
    }
});
const handleAgentCreated = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // created === no prev roles :)
    if (isAgent(user)) {
        yield LivechatTyped_1.Livechat.afterAgentAdded(user);
    }
});
const handleDeactivateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (wasAgent(user)) {
        yield models_1.Users.makeAgentUnavailableAndUnsetExtension(user._id);
    }
});
const handleActivateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (isAgent(user) && user.username) {
        yield LivechatTyped_1.Livechat.afterAgentUserActivated(user);
    }
});
callbacks_1.callbacks.add('afterCreateUser', handleAgentCreated, callbacks_1.callbacks.priority.LOW, 'livechat-after-create-user-update-agent');
callbacks_1.callbacks.add('afterSaveUser', handleAgentUpdated, callbacks_1.callbacks.priority.LOW, 'livechat-after-save-user-update-agent');
callbacks_1.callbacks.add('afterDeactivateUser', handleDeactivateUser, callbacks_1.callbacks.priority.LOW, 'livechat-after-deactivate-user-remove-agent');
callbacks_1.callbacks.add('afterActivateUser', handleActivateUser, callbacks_1.callbacks.priority.LOW, 'livechat-after-activate-user-add-agent');
