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
exports.sendNpsResults = void 0;
const server_fetch_1 = require("@rocket.chat/server-fetch");
const server_1 = require("../../../app/cloud/server");
const server_2 = require("../../../app/settings/server");
const system_1 = require("../../lib/logger/system");
const sendNpsResults = function sendNpsResults(npsId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield (0, server_1.getWorkspaceAccessToken)();
        if (!token) {
            return false;
        }
        const npsUrl = server_2.settings.get('Nps_Url');
        try {
            return (yield (0, server_fetch_1.serverFetch)(`${npsUrl}/v1/surveys/${npsId}/results`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            })).json();
        }
        catch (e) {
            system_1.SystemLogger.error(e);
            return false;
        }
    });
};
exports.sendNpsResults = sendNpsResults;
