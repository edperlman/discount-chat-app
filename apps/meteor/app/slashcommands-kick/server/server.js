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
// Kick is a named function that will replace /kick commands
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const i18n_1 = require("../../../server/lib/i18n");
const removeUserFromRoom_1 = require("../../../server/methods/removeUserFromRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'kick',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, message, userId }) {
        const username = params.trim().replace('@', '');
        if (username === '') {
            return;
        }
        const user = yield models_1.Users.findOneById(userId);
        const lng = (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en';
        const kickedUser = yield models_1.Users.findOneByUsernameIgnoringCase(username);
        if (kickedUser == null) {
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg: i18n_1.i18n.t('Username_doesnt_exist', {
                    postProcess: 'sprintf',
                    sprintf: [username],
                    lng,
                }),
            });
            return;
        }
        const { rid } = message;
        yield (0, removeUserFromRoom_1.removeUserFromRoomMethod)(userId, { rid, username });
    }),
    options: {
        description: 'Remove_someone_from_room',
        params: '@username',
        permission: 'remove-user',
    },
});
