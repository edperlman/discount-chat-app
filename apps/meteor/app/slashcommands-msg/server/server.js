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
const random_1 = require("@rocket.chat/random");
const i18n_1 = require("../../../server/lib/i18n");
const createDirectMessage_1 = require("../../../server/methods/createDirectMessage");
const sendMessage_1 = require("../../lib/server/methods/sendMessage");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Msg is a named function that will replace /msg commands
 */
slashCommand_1.slashCommands.add({
    command: 'msg',
    callback: function Msg(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message: item, userId }) {
            const trimmedParams = params.trim();
            const separator = trimmedParams.indexOf(' ');
            if (separator === -1) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, item.rid, {
                    msg: i18n_1.i18n.t('Username_and_message_must_not_be_empty', { lng: server_1.settings.get('Language') || 'en' }),
                });
                return;
            }
            const message = trimmedParams.slice(separator + 1);
            const targetUsernameOrig = trimmedParams.slice(0, separator);
            const targetUsername = targetUsernameOrig.replace('@', '');
            const targetUser = yield models_1.Users.findOneByUsernameIgnoringCase(targetUsername);
            if (targetUser == null) {
                const user = yield models_1.Users.findOneById(userId, { projection: { language: 1 } });
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, item.rid, {
                    msg: i18n_1.i18n.t('Username_doesnt_exist', {
                        postProcess: 'sprintf',
                        sprintf: [targetUsernameOrig],
                        lng: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en',
                    }),
                });
                return;
            }
            const { rid } = yield (0, createDirectMessage_1.createDirectMessage)([targetUsername], userId);
            const msgObject = {
                _id: random_1.Random.id(),
                rid,
                msg: message,
            };
            yield (0, sendMessage_1.executeSendMessage)(userId, msgObject);
        });
    },
    options: {
        description: 'Direct_message_someone',
        params: '@username <message>',
        permission: 'create-d',
    },
});
