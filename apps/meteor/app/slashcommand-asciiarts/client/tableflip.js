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
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const slashCommand_1 = require("../../utils/client/slashCommand");
/*
 * Tableflip is a named function that will replace /Tableflip commands
 * @param {Object} message - The message object
 */
slashCommand_1.slashCommands.add({
    command: 'tableflip',
    callback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, params }) {
        const msg = message;
        yield SDKClient_1.sdk.call('sendMessage', Object.assign(Object.assign({}, msg), { msg: `${params} (╯°□°）╯︵ ┻━┻` }));
    }),
    options: {
        description: 'Slash_Tableflip_Description',
        params: 'your_message_optional',
        clientOnly: true,
    },
});
