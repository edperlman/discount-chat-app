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
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const saveRoomSettings_1 = require("../../channel-settings/server/methods/saveRoomSettings");
const slashCommand_1 = require("../../utils/server/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'topic',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ params, message, userId }) {
        if (userId && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-room', message.rid))) {
            yield (0, saveRoomSettings_1.saveRoomSettings)(userId, message.rid, 'roomTopic', params);
        }
    }),
    options: {
        description: 'Slash_Topic_Description',
        params: 'Slash_Topic_Params',
        permission: 'edit-room',
    },
});
