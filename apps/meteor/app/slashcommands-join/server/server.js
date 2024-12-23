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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("../../../server/lib/i18n");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'join',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, message, userId }) {
        let channel = params.trim();
        if (channel === '') {
            return;
        }
        if (!userId) {
            return;
        }
        channel = channel.replace('#', '');
        const room = yield models_1.Rooms.findOneByNameAndType(channel, 'c');
        if (!room) {
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg: i18n_1.i18n.t('Channel_doesnt_exist', {
                    postProcess: 'sprintf',
                    sprintf: [channel],
                    lng: server_1.settings.get('Language') || 'en',
                }),
            });
            return;
        }
        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, userId, {
            projection: { _id: 1 },
        });
        if (subscription) {
            throw new meteor_1.Meteor.Error('error-user-already-in-room', 'You are already in the channel', {
                method: 'slashCommands',
            });
        }
        yield core_services_1.Room.join({ room, user: { _id: userId } });
    }),
    options: {
        description: 'Join_the_given_channel',
        params: '#channel',
        permission: 'view-c-room',
    },
});
