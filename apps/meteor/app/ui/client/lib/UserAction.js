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
exports.UserAction = exports.USER_ACTIVITIES = void 0;
const lodash_1 = require("lodash");
const meteor_1 = require("meteor/meteor");
const reactive_dict_1 = require("meteor/reactive-dict");
const client_1 = require("../../../settings/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const TIMEOUT = 15000;
const RENEW = TIMEOUT / 3;
const USER_ACTIVITY = 'user-activity';
exports.USER_ACTIVITIES = {
    USER_RECORDING: 'user-recording',
    USER_TYPING: 'user-typing',
    USER_UPLOADING: 'user-uploading',
    USER_PLAYING: 'user-playing',
};
const activityTimeouts = new Map();
const activityRenews = new Map();
const continuingIntervals = new Map();
const roomActivities = new Map();
const rooms = new Map();
const performingUsers = new reactive_dict_1.ReactiveDict();
const shownName = function (user) {
    if (!user) {
        return;
    }
    if (client_1.settings.get('UI_Use_Real_Name')) {
        return user.name;
    }
    return user.username;
};
const emitActivities = (0, lodash_1.debounce)((rid, extras) => __awaiter(void 0, void 0, void 0, function* () {
    const activities = roomActivities.get((extras === null || extras === void 0 ? void 0 : extras.tmid) || rid) || new Set();
    SDKClient_1.sdk.publish('notify-room', [`${rid}/${USER_ACTIVITY}`, shownName(meteor_1.Meteor.user()), [...activities], extras]);
}), 500);
function handleStreamAction(rid, username, activityTypes, extras) {
    rid = (extras === null || extras === void 0 ? void 0 : extras.tmid) || rid;
    const roomActivities = performingUsers.get(rid) || {};
    for (const [, activity] of Object.entries(exports.USER_ACTIVITIES)) {
        roomActivities[activity] = roomActivities[activity] || new Map();
        const users = roomActivities[activity];
        const timeout = users[username];
        if (timeout) {
            clearTimeout(timeout);
        }
        if (activityTypes.includes(activity)) {
            activityTypes.splice(activityTypes.indexOf(activity), 1);
            users[username] = setTimeout(() => handleStreamAction(rid, username, activityTypes, extras), TIMEOUT);
        }
        else {
            delete users[username];
        }
    }
    performingUsers.set(rid, roomActivities);
}
exports.UserAction = new (class {
    addStream(rid) {
        if (rooms.get(rid)) {
            throw new Error('UserAction - addStream should only be called once per room');
        }
        const handler = function (username, activityType, extras) {
            const user = meteor_1.Meteor.users.findOne(meteor_1.Meteor.userId() || undefined, {
                fields: { name: 1, username: 1 },
            });
            if (username === shownName(user)) {
                return;
            }
            handleStreamAction(rid, username, activityType, extras);
        };
        rooms.set(rid, handler);
        const { stop } = SDKClient_1.sdk.stream('notify-room', [`${rid}/${USER_ACTIVITY}`], handler);
        return () => {
            if (!rooms.get(rid)) {
                return;
            }
            stop();
            rooms.delete(rid);
        };
    }
    performContinuously(rid, activityType, extras = {}) {
        const trid = (extras === null || extras === void 0 ? void 0 : extras.tmid) || rid;
        const key = `${activityType}-${trid}`;
        if (continuingIntervals.get(key)) {
            return;
        }
        this.start(rid, activityType, extras);
        continuingIntervals.set(key, setInterval(() => {
            this.start(rid, activityType, extras);
        }, RENEW));
    }
    start(rid, activityType, extras = {}) {
        const trid = (extras === null || extras === void 0 ? void 0 : extras.tmid) || rid;
        const key = `${activityType}-${trid}`;
        if (activityRenews.get(key)) {
            return;
        }
        activityRenews.set(key, setTimeout(() => {
            clearTimeout(activityRenews.get(key));
            activityRenews.delete(key);
        }, RENEW));
        const activities = roomActivities.get(trid) || new Set();
        activities.add(activityType);
        roomActivities.set(trid, activities);
        void emitActivities(rid, extras);
        if (activityTimeouts.get(key)) {
            clearTimeout(activityTimeouts.get(key));
            activityTimeouts.delete(key);
        }
        activityTimeouts.set(key, setTimeout(() => this.stop(trid, activityType, extras), TIMEOUT));
        activityTimeouts.get(key);
    }
    stop(rid, activityType, extras) {
        const trid = (extras === null || extras === void 0 ? void 0 : extras.tmid) || rid;
        const key = `${activityType}-${trid}`;
        if (activityTimeouts.get(key)) {
            clearTimeout(activityTimeouts.get(key));
            activityTimeouts.delete(key);
        }
        if (activityRenews.get(key)) {
            clearTimeout(activityRenews.get(key));
            activityRenews.delete(key);
        }
        if (continuingIntervals.get(key)) {
            clearInterval(continuingIntervals.get(key));
            continuingIntervals.delete(key);
        }
        const activities = roomActivities.get(trid) || new Set();
        activities.delete(activityType);
        roomActivities.set(trid, activities);
        void emitActivities(rid, extras);
    }
    get(roomId) {
        return performingUsers.get(roomId);
    }
})();
