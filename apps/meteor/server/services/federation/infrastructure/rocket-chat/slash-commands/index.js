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
const action_1 = require("./action");
const slashCommand_1 = require("../../../../../../app/utils/server/slashCommand");
const FEDERATION_COMMANDS = {
    dm: (currentUserId, roomId, invitee) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.Federation.createDirectMessageRoomAndInviteUser(currentUserId, roomId, invitee); }),
};
function federation(_a) {
    return __awaiter(this, arguments, void 0, function* ({ command, params, message, userId }) {
        yield (0, action_1.executeSlashCommand)(command, params, message, FEDERATION_COMMANDS, userId);
    });
}
slashCommand_1.slashCommands.add({
    command: 'federation',
    callback: federation,
    options: {
        description: 'Federation_slash_commands',
        params: '#command (dm) #user',
    },
});
