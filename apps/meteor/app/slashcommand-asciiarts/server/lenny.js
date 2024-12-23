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
const sendMessage_1 = require("../../lib/server/methods/sendMessage");
const slashCommand_1 = require("../../utils/server/slashCommand");
/*
 * Lenny is a named function that will replace /lenny commands
 * @param {Object} message - The message object
 */
function LennyFace(_a) {
    return __awaiter(this, arguments, void 0, function* ({ message, params, userId }) {
        const msg = message;
        msg.msg = `${params} ( ͡° ͜ʖ ͡°)`;
        yield (0, sendMessage_1.executeSendMessage)(userId, msg);
    });
}
slashCommand_1.slashCommands.add({
    command: 'lennyface',
    callback: LennyFace,
    options: {
        description: 'Slash_LennyFace_Description',
        params: 'your_message_optional',
        clientOnly: true,
    },
});
