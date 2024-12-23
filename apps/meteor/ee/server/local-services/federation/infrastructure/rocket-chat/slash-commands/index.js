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
const slashCommand_1 = require("../../../../../../../app/utils/server/slashCommand");
const EE_FEDERATION_COMMANDS = {
    dm: (currentUserId, _, invitees) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.FederationEE.createDirectMessageRoom(currentUserId, invitees); }),
};
function federation({ command, params, message, userId }) {
    return (0, action_1.executeSlashCommand)(command, params, message, EE_FEDERATION_COMMANDS, userId);
}
slashCommand_1.slashCommands.add({
    command: 'federation',
    callback: federation,
    options: {
        description: 'Federation_slash_commands',
        params: '#command (dm) #users',
    },
});
