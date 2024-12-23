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
exports.getConfirmationPoll = getConfirmationPoll;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
function getConfirmationPoll(deviceCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/v2/register/workspace/poll`, { params: { token: deviceCode } });
            try {
                if (!response.ok) {
                    throw new Error((yield response.json()).error);
                }
                return yield response.json();
            }
            catch (err) {
                throw new Error(`Failed to retrieve registration confirmation poll data: ${response.statusText}`);
            }
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to get confirmation poll from Rocket.Chat Cloud',
                url: '/api/v2/register/workspace/poll',
                err,
            });
            throw err;
        }
    });
}
