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
exports.registerPreIntentWorkspaceWizard = registerPreIntentWorkspaceWizard;
const models_1 = require("@rocket.chat/models");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const buildRegistrationData_1 = require("./buildRegistrationData");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
function registerPreIntentWorkspaceWizard() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const firstUser = (yield models_1.Users.getOldest({ projection: { name: 1, emails: 1 } }));
        const email = (_b = (_a = firstUser === null || firstUser === void 0 ? void 0 : firstUser.emails) === null || _a === void 0 ? void 0 : _a.find((address) => address)) === null || _b === void 0 ? void 0 : _b.address;
        if (!email) {
            return false;
        }
        const regInfo = yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(email);
        try {
            const cloudUrl = server_1.settings.get('Cloud_Url');
            const response = yield (0, server_fetch_1.serverFetch)(`${cloudUrl}/api/v2/register/workspace/pre-intent`, {
                method: 'POST',
                body: regInfo,
                timeout: 3 * 1000,
            });
            if (!response.ok) {
                throw new Error((yield response.json()).error);
            }
            return true;
        }
        catch (err) {
            system_1.SystemLogger.error({
                msg: 'Failed to register workspace pre-intent with Rocket.Chat Cloud',
                url: '/api/v2/register/workspace/pre-intent',
                err,
            });
            return false;
        }
    });
}
