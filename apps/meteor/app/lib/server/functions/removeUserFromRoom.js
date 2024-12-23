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
exports.removeUserFromRoom = void 0;
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const afterLeaveRoomCallback_1 = require("../../../../lib/callbacks/afterLeaveRoomCallback");
const beforeLeaveRoomCallback_1 = require("../../../../lib/callbacks/beforeLeaveRoomCallback");
const server_1 = require("../../../settings/server");
const notifyListener_1 = require("../lib/notifyListener");
const removeUserFromRoom = function (rid, user, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            return;
        }
        try {
            yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPreRoomUserLeave, room, user, options === null || options === void 0 ? void 0 : options.byUser));
        }
        catch (error) {
            if (error.name === exceptions_1.AppsEngineException.name) {
                throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
            }
            throw error;
        }
        yield core_services_1.Room.beforeLeave(room);
        // TODO: move before callbacks to service
        yield beforeLeaveRoomCallback_1.beforeLeaveRoomCallback.run(user, room);
        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id, {
            projection: { _id: 1 },
        });
        if (subscription) {
            const removedUser = user;
            if (options === null || options === void 0 ? void 0 : options.byUser) {
                const extraData = {
                    u: options.byUser,
                };
                if (room.teamMain) {
                    yield core_services_1.Message.saveSystemMessage('removed-user-from-team', rid, user.username || '', user, extraData);
                }
                else {
                    yield core_services_1.Message.saveSystemMessage('ru', rid, user.username || '', user, extraData);
                }
            }
            else if (room.teamMain) {
                yield core_services_1.Message.saveSystemMessage('ult', rid, removedUser.username || '', removedUser);
            }
            else {
                yield core_services_1.Message.saveSystemMessage('ul', rid, removedUser.username || '', removedUser);
            }
        }
        if (room.t === 'l') {
            yield core_services_1.Message.saveSystemMessage('command', rid, 'survey', user);
        }
        const deletedSubscription = yield models_1.Subscriptions.removeByRoomIdAndUserId(rid, user._id);
        if (deletedSubscription) {
            void (0, notifyListener_1.notifyOnSubscriptionChanged)(deletedSubscription, 'removed');
        }
        if (room.teamId && room.teamMain) {
            yield core_services_1.Team.removeMember(room.teamId, user._id);
        }
        if (room.encrypted && server_1.settings.get('E2E_Enable')) {
            yield models_1.Rooms.removeUsersFromE2EEQueueByRoomId(room._id, [user._id]);
        }
        // TODO: CACHE: maybe a queue?
        yield afterLeaveRoomCallback_1.afterLeaveRoomCallback.run(user, room);
        void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
        yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostRoomUserLeave, room, user, options === null || options === void 0 ? void 0 : options.byUser));
    });
};
exports.removeUserFromRoom = removeUserFromRoom;
