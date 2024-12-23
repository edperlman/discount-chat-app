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
const setUserStatus_1 = require("../../user-status/server/methods/setUserStatus");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'status',
    callback: function Status(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message, userId }) {
            if (!userId) {
                return;
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { language: 1 } });
            const lng = (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en';
            try {
                yield (0, setUserStatus_1.setUserStatusMethod)(userId, undefined, params);
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('StatusMessage_Changed_Successfully', { lng }),
                });
            }
            catch (err) {
                if (err.error === 'error-not-allowed') {
                    void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                        msg: i18n_1.i18n.t('StatusMessage_Change_Disabled', { lng }),
                    });
                }
                throw err;
            }
        });
    },
    options: {
        description: 'Slash_Status_Description',
        params: 'Slash_Status_Params',
    },
});
