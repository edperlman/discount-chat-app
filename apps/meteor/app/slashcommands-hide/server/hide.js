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
const i18n_1 = require("../../../server/lib/i18n");
const hideRoom_1 = require("../../../server/methods/hideRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Hide is a named function that will replace /hide commands
 * @param {Object} message - The message object
 */
slashCommand_1.slashCommands.add({
    command: 'hide',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, message, userId }) {
        const room = params.trim();
        if (!userId) {
            return;
        }
        const user = yield models_1.Users.findOneById(userId);
        if (!user) {
            return;
        }
        const lng = user.language || server_1.settings.get('Language') || 'en';
        // if there is not a param, hide the current room
        let { rid } = message;
        if (room !== '') {
            const [strippedRoom] = room.replace(/#|@/, '').split(' ');
            const [type] = room;
            const roomObject = type === '#'
                ? yield models_1.Rooms.findOneByName(strippedRoom)
                : yield models_1.Rooms.findOne({
                    t: 'd',
                    usernames: { $all: [user.username, strippedRoom] },
                });
            if (!roomObject) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', user._id, message.rid, {
                    msg: i18n_1.i18n.t('Channel_doesnt_exist', {
                        postProcess: 'sprintf',
                        sprintf: [room],
                        lng,
                    }),
                });
            }
            if (!(yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomObject ? roomObject._id : '', user._id, { projection: { _id: 1 } }))) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', user._id, message.rid, {
                    msg: i18n_1.i18n.t('error-logged-user-not-in-room', {
                        postProcess: 'sprintf',
                        sprintf: [room],
                        lng,
                    }),
                });
                return;
            }
            rid = (roomObject === null || roomObject === void 0 ? void 0 : roomObject._id) || message.rid;
        }
        try {
            yield (0, hideRoom_1.hideRoomMethod)(userId, rid);
        }
        catch (error) {
            yield core_services_1.api.broadcast('notify.ephemeralMessage', user._id, message.rid, {
                msg: i18n_1.i18n.t(error, { lng }),
            });
        }
    }),
    options: { description: 'Hide_room', params: '#room' },
});
