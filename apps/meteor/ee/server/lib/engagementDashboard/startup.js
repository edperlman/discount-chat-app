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
exports.prepareAnalytics = exports.detachCallbacks = exports.attachCallbacks = void 0;
const messages_1 = require("./messages");
const users_1 = require("./users");
const callbacks_1 = require("../../../../lib/callbacks");
const attachCallbacks = () => {
    callbacks_1.callbacks.add('afterSaveMessage', (message, { room }) => (0, messages_1.handleMessagesSent)(message, { room }), callbacks_1.callbacks.priority.MEDIUM, 'engagementDashboard.afterSaveMessage');
    callbacks_1.callbacks.add('afterDeleteMessage', messages_1.handleMessagesDeleted, callbacks_1.callbacks.priority.MEDIUM, 'engagementDashboard.afterDeleteMessage');
    callbacks_1.callbacks.add('afterCreateUser', users_1.handleUserCreated, callbacks_1.callbacks.priority.MEDIUM, 'engagementDashboard.afterCreateUser');
};
exports.attachCallbacks = attachCallbacks;
const detachCallbacks = () => {
    callbacks_1.callbacks.remove('afterSaveMessage', 'engagementDashboard.afterSaveMessage');
    callbacks_1.callbacks.remove('afterDeleteMessage', 'engagementDashboard.afterDeleteMessage');
    callbacks_1.callbacks.remove('afterCreateUser', 'engagementDashboard.afterCreateUser');
};
exports.detachCallbacks = detachCallbacks;
const prepareAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    yield Promise.all([(0, users_1.fillFirstDaysOfUsersIfNeeded)(now), (0, messages_1.fillFirstDaysOfMessagesIfNeeded)(now)]);
});
exports.prepareAnalytics = prepareAnalytics;
