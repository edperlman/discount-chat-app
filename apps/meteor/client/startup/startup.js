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
const meteor_1 = require("meteor/meteor");
const rocketchat_user_presence_1 = require("meteor/rocketchat:user-presence");
const session_1 = require("meteor/session");
const tracker_1 = require("meteor/tracker");
const moment_1 = __importDefault(require("moment"));
const hljs_1 = require("../../app/markdown/lib/hljs");
const client_1 = require("../../app/settings/client");
const client_2 = require("../../app/utils/client");
require("hljs9/styles/github.css");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const userData_1 = require("../lib/userData");
const fireGlobalEvent_1 = require("../lib/utils/fireGlobalEvent");
meteor_1.Meteor.startup(() => {
    (0, fireGlobalEvent_1.fireGlobalEvent)('startup', true);
    session_1.Session.setDefault('AvatarRandom', 0);
    window.lastMessageWindow = {};
    window.lastMessageWindowHistory = {};
    let status = undefined;
    tracker_1.Tracker.autorun(() => __awaiter(void 0, void 0, void 0, function* () {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            (0, userData_1.removeLocalUserData)();
            return;
        }
        if (!meteor_1.Meteor.status().connected) {
            return;
        }
        if (meteor_1.Meteor.loggingIn()) {
            return;
        }
        const user = yield (0, userData_1.synchronizeUserData)(uid);
        if (!user) {
            return;
        }
        const utcOffset = (0, moment_1.default)().utcOffset() / 60;
        if (user.utcOffset !== utcOffset) {
            SDKClient_1.sdk.call('userSetUtcOffset', utcOffset);
        }
        if ((0, client_2.getUserPreference)(user, 'enableAutoAway')) {
            const idleTimeLimit = (0, client_2.getUserPreference)(user, 'idleTimeLimit') || 300;
            rocketchat_user_presence_1.UserPresence.awayTime = idleTimeLimit * 1000;
        }
        else {
            delete rocketchat_user_presence_1.UserPresence.awayTime;
            rocketchat_user_presence_1.UserPresence.stopTimer();
        }
        rocketchat_user_presence_1.UserPresence.start();
        if (user.status !== status) {
            status = user.status;
            (0, fireGlobalEvent_1.fireGlobalEvent)('status-changed', status);
        }
    }));
});
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const code = client_1.settings.get('Message_Code_highlight');
        code === null || code === void 0 ? void 0 : code.split(',').forEach((language) => {
            language.trim() && (0, hljs_1.register)(language.trim());
        });
    });
});
