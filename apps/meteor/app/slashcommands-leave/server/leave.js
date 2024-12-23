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
const leaveRoom_1 = require("../../lib/server/methods/leaveRoom");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Leave is a named function that will replace /leave commands
 * @param {Object} message - The message object
 */
const Leave = function Leave(_a) {
    return __awaiter(this, arguments, void 0, function* ({ message, userId }) {
        try {
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                return;
            }
            yield (0, leaveRoom_1.leaveRoomMethod)(user, message.rid);
        }
        catch ({ error }) {
            if (typeof error !== 'string') {
                return;
            }
            const user = yield models_1.Users.findOneById(userId);
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                msg: i18n_1.i18n.t(error, { lng: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en' }),
            });
        }
    });
};
slashCommand_1.slashCommands.add({
    command: 'leave',
    callback: Leave,
    options: {
        description: 'Leave_the_current_channel',
        permission: ['leave-c', 'leave-p'],
    },
});
slashCommand_1.slashCommands.add({
    command: 'part',
    callback: Leave,
    options: {
        description: 'Leave_the_current_channel',
        permission: ['leave-c', 'leave-p'],
    },
});
