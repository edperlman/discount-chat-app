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
exports.VoipFreeSwitchService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const freeswitch_1 = require("@rocket.chat/freeswitch");
class VoipFreeSwitchService extends core_services_1.ServiceClassInternal {
    constructor(getSetting) {
        super();
        this.getSetting = getSetting;
        this.name = 'voip-freeswitch';
    }
    getConnectionSettings() {
        if (!this.getSetting('VoIP_TeamCollab_Enabled') && !process.env.FREESWITCHIP) {
            throw new Error('VoIP is disabled.');
        }
        const host = process.env.FREESWITCHIP || this.getSetting('VoIP_TeamCollab_FreeSwitch_Host');
        if (!host) {
            throw new Error('VoIP is not properly configured.');
        }
        const port = this.getSetting('VoIP_TeamCollab_FreeSwitch_Port') || 8021;
        const timeout = this.getSetting('VoIP_TeamCollab_FreeSwitch_Timeout') || 3000;
        const password = this.getSetting('VoIP_TeamCollab_FreeSwitch_Password');
        return {
            host,
            port,
            password,
            timeout,
        };
    }
    getDomain() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getConnectionSettings();
            return (0, freeswitch_1.getDomain)(options);
        });
    }
    getUserPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getConnectionSettings();
            return (0, freeswitch_1.getUserPassword)(options, user);
        });
    }
    getExtensionList() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getConnectionSettings();
            return (0, freeswitch_1.getExtensionList)(options);
        });
    }
    getExtensionDetails(requestParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getConnectionSettings();
            return (0, freeswitch_1.getExtensionDetails)(options, requestParams);
        });
    }
}
exports.VoipFreeSwitchService = VoipFreeSwitchService;
