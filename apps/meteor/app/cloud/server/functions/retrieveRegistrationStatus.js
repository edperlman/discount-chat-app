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
exports.retrieveRegistrationStatus = retrieveRegistrationStatus;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../settings/server");
function retrieveRegistrationStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const info = {
            workspaceRegistered: !!server_1.settings.get('Cloud_Workspace_Client_Id') && !!server_1.settings.get('Cloud_Workspace_Client_Secret'),
            workspaceId: server_1.settings.get('Cloud_Workspace_Id'),
            uniqueId: server_1.settings.get('uniqueID'),
            token: '',
            email: server_1.settings.get('Organization_Email') || '',
        };
        if (!info.email) {
            const firstUser = yield models_1.Users.getOldest({ projection: { emails: 1 } });
            info.email = ((_b = (_a = firstUser === null || firstUser === void 0 ? void 0 : firstUser.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address) || info.email;
        }
        return info;
    });
}
