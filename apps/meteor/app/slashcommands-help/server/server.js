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
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'help',
    callback: function Help(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, userId }) {
            const user = yield models_1.Users.findOneById(userId);
            const keys = [
                {
                    key: 'Open_channel_user_search',
                    command: 'Command (or Ctrl) + p OR Command (or Ctrl) + k',
                },
                {
                    key: 'Mark_all_as_read',
                    command: 'Shift (or Ctrl) + ESC',
                },
                {
                    key: 'Edit_previous_message',
                    command: 'Up Arrow',
                },
                {
                    key: 'Move_beginning_message',
                    command: 'Command (or Alt) + Left Arrow',
                },
                {
                    key: 'Move_beginning_message',
                    command: 'Command (or Alt) + Up Arrow',
                },
                {
                    key: 'Move_end_message',
                    command: 'Command (or Alt) + Right Arrow',
                },
                {
                    key: 'Move_end_message',
                    command: 'Command (or Alt) + Down Arrow',
                },
                {
                    key: 'New_line_message_compose_input',
                    command: 'Shift + Enter',
                },
            ];
            let msg = '';
            keys.forEach((key) => {
                msg = `${msg}\n${i18n_1.i18n.t(key.key, {
                    postProcess: 'sprintf',
                    sprintf: [key.command],
                    lng: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('language') || 'en',
                })}`;
            });
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg,
            });
        });
    },
    options: {
        description: 'Show_the_keyboard_shortcut_list',
    },
});
