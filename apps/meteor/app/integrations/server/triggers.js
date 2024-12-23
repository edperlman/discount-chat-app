"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const triggerHandler_1 = require("./lib/triggerHandler");
const callbacks_1 = require("../../../lib/callbacks");
const afterLeaveRoomCallback_1 = require("../../../lib/callbacks/afterLeaveRoomCallback");
const callbackHandler = function _callbackHandler(eventType) {
    return function _wrapperFunction(...args) {
        return triggerHandler_1.triggerHandler.executeTriggers(eventType, ...args);
    };
};
callbacks_1.callbacks.add('afterSaveMessage', (message, { room }) => callbackHandler('sendMessage')(message, room), callbacks_1.callbacks.priority.LOW, 'integrations-sendMessage');
callbacks_1.callbacks.add('afterCreateChannel', callbackHandler('roomCreated'), callbacks_1.callbacks.priority.LOW, 'integrations-roomCreated');
callbacks_1.callbacks.add('afterCreatePrivateGroup', callbackHandler('roomCreated'), callbacks_1.callbacks.priority.LOW, 'integrations-roomCreated');
callbacks_1.callbacks.add('afterCreateUser', callbackHandler('userCreated'), callbacks_1.callbacks.priority.LOW, 'integrations-userCreated');
callbacks_1.callbacks.add('afterJoinRoom', callbackHandler('roomJoined'), callbacks_1.callbacks.priority.LOW, 'integrations-roomJoined');
afterLeaveRoomCallback_1.afterLeaveRoomCallback.add(callbackHandler('roomLeft'), callbacks_1.callbacks.priority.LOW, 'integrations-roomLeft');
callbacks_1.callbacks.add('afterRoomArchived', callbackHandler('roomArchived'), callbacks_1.callbacks.priority.LOW, 'integrations-roomArchived');
callbacks_1.callbacks.add('afterFileUpload', callbackHandler('fileUploaded'), callbacks_1.callbacks.priority.LOW, 'integrations-fileUploaded');
