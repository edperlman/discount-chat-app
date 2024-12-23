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
const createChannel_1 = require("../../lib/server/methods/createChannel");
const createPrivateGroup_1 = require("../../lib/server/methods/createPrivateGroup");
const server_1 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'create',
    callback: function Create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message, userId }) {
            function getParams(str) {
                const regex = /(--(\w+))+/g;
                const result = [];
                let m;
                while ((m = regex.exec(str)) !== null) {
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    result.push(m[2]);
                }
                return result;
            }
            const regexp = new RegExp(server_1.settings.get('UTF8_Channel_Names_Validation'));
            const channel = regexp.exec(params.trim());
            if (!channel) {
                return;
            }
            const channelStr = channel ? channel[0] : '';
            if (channelStr === '') {
                return;
            }
            const room = yield models_1.Rooms.findOneByName(channelStr);
            if (room != null) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Channel_already_exist', {
                        postProcess: 'sprintf',
                        sprintf: [channelStr],
                        lng: server_1.settings.get('Language') || 'en',
                    }),
                });
                return;
            }
            if (getParams(params).indexOf('private') > -1) {
                const user = yield models_1.Users.findOneById(userId);
                if (!user) {
                    return;
                }
                yield (0, createPrivateGroup_1.createPrivateGroupMethod)(user, channelStr, []);
                return;
            }
            yield (0, createChannel_1.createChannelMethod)(userId, channelStr, []);
        });
    },
    options: {
        description: 'Create_A_New_Channel',
        params: '#channel',
        permission: ['create-c', 'create-p'],
    },
});
