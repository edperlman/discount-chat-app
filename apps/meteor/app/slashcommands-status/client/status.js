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
const toast_1 = require("../../../client/lib/toast");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const slashCommand_1 = require("../../utils/client/slashCommand");
slashCommand_1.slashCommands.add({
    command: 'status',
    callback: function Status(_a) {
        return __awaiter(this, arguments, void 0, function* ({ params, userId }) {
            if (!userId) {
                return;
            }
            try {
                yield SDKClient_1.sdk.call('setUserStatus', undefined, params);
            }
            catch (error) {
                (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
            }
        });
    },
    options: {
        description: 'Slash_Status_Description',
        params: 'Slash_Status_Params',
    },
});
