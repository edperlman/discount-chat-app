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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
const i18n_1 = require("../../../server/lib/i18n");
const roomCoordinator_1 = require("../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const archiveRoom_1 = require("../../lib/server/functions/archiveRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'archive',
    callback: function Archive(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message, userId }) {
            let channel = params.trim();
            let room;
            if (channel === '') {
                room = yield models_1.Rooms.findOneById(message.rid);
                if (room === null || room === void 0 ? void 0 : room.name) {
                    channel = room.name;
                }
            }
            else {
                channel = channel.replace('#', '');
                room = yield models_1.Rooms.findOneByName(channel);
            }
            if (!userId) {
                return;
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { username: 1, name: 1 } });
            if (!user || !(0, core_typings_1.isRegisterUser)(user)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'archiveRoom' });
            }
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
            if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.ARCHIVE, userId))) {
                throw new meteor_1.Meteor.Error('error-room-type-not-archivable', `Room type: ${room.t} can not be archived`);
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'archive-room', room._id))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized');
            }
            if (room.archived) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Duplicate_archived_channel_name', {
                        postProcess: 'sprintf',
                        sprintf: [channel],
                        lng: server_1.settings.get('Language') || 'en',
                    }),
                });
                return;
            }
            yield (0, archiveRoom_1.archiveRoom)(room._id, user);
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg: i18n_1.i18n.t('Channel_Archived', {
                    postProcess: 'sprintf',
                    sprintf: [channel],
                    lng: server_1.settings.get('Language') || 'en',
                }),
            });
        });
    },
    options: {
        description: 'Archive',
        params: '#channel',
        permission: 'archive-room',
    },
});
