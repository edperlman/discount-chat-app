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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../app/settings/server");
meteor_1.Meteor.methods({
    getSetupWizardParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            const setupWizardSettings = yield models_1.Settings.findSetupWizardSettings().toArray();
            const serverAlreadyRegistered = !!server_1.settings.get('Cloud_Workspace_Client_Id') || process.env.DEPLOY_PLATFORM === 'rocket-cloud';
            return {
                settings: setupWizardSettings,
                serverAlreadyRegistered,
            };
        });
    },
});
