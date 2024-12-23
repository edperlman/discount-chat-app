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
const muteUserInRoom_1 = require("../../../server/methods/muteUserInRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Mute is a named function that will replace /mute commands
 */
slashCommand_1.slashCommands.add({
    command: 'mute',
    callback: function Mute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message, userId }) {
            const username = params.trim().replace('@', '');
            if (username === '') {
                return;
            }
            const mutedUser = yield models_1.Users.findOneByUsernameIgnoringCase(username);
            if (mutedUser == null) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Username_doesnt_exist', {
                        postProcess: 'sprintf',
                        sprintf: [username],
                        lng: server_1.settings.get('Language') || 'en',
                    }),
                });
            }
            yield (0, muteUserInRoom_1.muteUserInRoom)(userId, {
                rid: message.rid,
                username,
            });
        });
    },
    options: {
        description: 'Mute_someone_in_room',
        params: '@username',
        permission: 'mute-user',
    },
});
