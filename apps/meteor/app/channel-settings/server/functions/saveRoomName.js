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
exports.saveRoomName = saveRoomName;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const checkUsernameAvailability_1 = require("../../../lib/server/functions/checkUsernameAvailability");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const getValidRoomName_1 = require("../../../utils/server/lib/getValidRoomName");
const updateFName = (rid, displayName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const responses = yield Promise.all([models_1.Rooms.setFnameById(rid, displayName), models_1.Subscriptions.updateFnameByRoomId(rid, displayName)]);
    if ((_a = responses[1]) === null || _a === void 0 ? void 0 : _a.modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
    }
    return responses;
});
const updateRoomName = (rid, displayName, slugifiedRoomName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Check if the username is available
    if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(slugifiedRoomName))) {
        throw new meteor_1.Meteor.Error('error-duplicate-handle', `A room, team or user with name '${slugifiedRoomName}' already exists`, {
            function: 'RocketChat.updateRoomName',
            handle: slugifiedRoomName,
        });
    }
    const responses = yield Promise.all([
        models_1.Rooms.setNameById(rid, slugifiedRoomName, displayName),
        models_1.Subscriptions.updateNameAndAlertByRoomId(rid, slugifiedRoomName, displayName),
    ]);
    if ((_a = responses[1]) === null || _a === void 0 ? void 0 : _a.modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
    }
    return responses;
});
function saveRoomName(rid_1, displayName_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (rid, displayName, user, sendMessage = true) {
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                function: 'RocketChat.saveRoomdisplayName',
            });
        }
        if (roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).preventRenaming()) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                function: 'RocketChat.saveRoomdisplayName',
            });
        }
        yield core_services_1.Room.beforeNameChange(room);
        if (displayName === room.name) {
            return;
        }
        if (!(displayName === null || displayName === void 0 ? void 0 : displayName.trim())) {
            return;
        }
        const isDiscussion = Boolean(room === null || room === void 0 ? void 0 : room.prid);
        const slugifiedRoomName = isDiscussion ? displayName : yield (0, getValidRoomName_1.getValidRoomName)(displayName, rid);
        let update;
        if (isDiscussion || (0, core_typings_1.isRoomFederated)(room)) {
            update = yield updateFName(rid, displayName);
        }
        else {
            update = yield updateRoomName(rid, displayName, slugifiedRoomName);
        }
        if (!update) {
            return;
        }
        if (room.name && !isDiscussion) {
            yield models_1.Integrations.updateRoomName(room.name, slugifiedRoomName);
            void (0, notifyListener_1.notifyOnIntegrationChangedByChannels)([slugifiedRoomName]);
        }
        if (sendMessage) {
            yield core_services_1.Message.saveSystemMessage('r', rid, displayName, user);
        }
        yield callbacks_1.callbacks.run('afterRoomNameChange', { rid, name: displayName, oldName: room.name });
        return displayName;
    });
}
