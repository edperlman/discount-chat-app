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
exports.getSeatsRequestLink = void 0;
const models_1 = require("@rocket.chat/models");
const getSeatsRequestLink = (url, params) => __awaiter(void 0, void 0, void 0, function* () {
    const workspaceId = yield models_1.Settings.findOneById('Cloud_Workspace_Id');
    const activeUsers = yield models_1.Users.getActiveLocalUserCount();
    const wizardSettings = yield models_1.Settings.findSetupWizardSettings().toArray();
    const newUrl = new URL(url);
    if (workspaceId === null || workspaceId === void 0 ? void 0 : workspaceId.value) {
        newUrl.searchParams.append('workspaceId', String(workspaceId.value));
    }
    if (activeUsers) {
        newUrl.searchParams.append('activeUsers', String(activeUsers));
    }
    wizardSettings
        .filter(({ _id, value }) => ['Industry', 'Country', 'Size'].includes(_id) && value)
        .forEach((setting) => {
        newUrl.searchParams.append(setting._id.toLowerCase(), String(setting.value));
    });
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            newUrl.searchParams.append(key, String(value));
        });
    }
    return newUrl.toString();
});
exports.getSeatsRequestLink = getSeatsRequestLink;
