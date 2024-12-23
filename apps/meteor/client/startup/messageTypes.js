"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/ui-utils/client");
const i18n_1 = require("../../app/utils/lib/i18n");
meteor_1.Meteor.startup(() => {
    client_1.MessageTypes.registerType({
        id: 'room_changed_privacy',
        system: true,
        message: 'room_changed_type',
        data(message) {
            return {
                room_type: (0, i18n_1.t)(message.msg),
            };
        },
    });
    client_1.MessageTypes.registerType({
        id: 'room_changed_topic',
        system: true,
        message: 'room_changed_topic_to',
        data(message) {
            return {
                room_topic: (0, string_helpers_1.escapeHTML)(message.msg || `(${(0, i18n_1.t)('None').toLowerCase()})`),
            };
        },
    });
    client_1.MessageTypes.registerType({
        id: 'room_changed_avatar',
        system: true,
        message: 'room_avatar_changed',
    });
    client_1.MessageTypes.registerType({
        id: 'room_changed_announcement',
        system: true,
        message: 'changed_room_announcement_to__room_announcement_',
        data(message) {
            return {
                room_announcement: (0, string_helpers_1.escapeHTML)(message.msg || `(${(0, i18n_1.t)('None').toLowerCase()})`),
            };
        },
    });
    client_1.MessageTypes.registerType({
        id: 'room_changed_description',
        system: true,
        message: 'changed_room_description_to__room_description_',
        data(message) {
            return {
                room_description: (0, string_helpers_1.escapeHTML)(message.msg || `(${(0, i18n_1.t)('None').toLowerCase()})`),
            };
        },
    });
    client_1.MessageTypes.registerType({
        id: 'message_pinned',
        system: true,
        message: 'Pinned_a_message',
    });
    client_1.MessageTypes.registerType({
        id: 'message_pinned_e2e',
        system: true,
        message: 'Pinned_a_message',
    });
});
