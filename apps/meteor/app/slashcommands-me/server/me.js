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
 * Me is a named function that will replace /me commands
 * @param {Object} message - The message object
 */
slashCommand_1.slashCommands.add({
    command: 'me',
    callback: function Me(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, message, userId }) {
            if (params.trim()) {
                const msg = message;
                msg.msg = `_${params}_`;
                yield (0, sendMessage_1.executeSendMessage)(userId, msg);
            }
        });
    },
    options: {
        description: 'Displays_action_text',
        params: 'your_message',
    },
});
