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
exports.addSettings = addSettings;
const server_1 = require("../../../app/settings/server");
function addSettings() {
    return server_1.settingsRegistry.addGroup('VoIP_TeamCollab', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.with({
                enterprise: true,
                modules: ['teams-voip'],
            }, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('VoIP_TeamCollab_Enabled', false, {
                        type: 'boolean',
                        public: true,
                        invalidValue: false,
                        alert: 'VoIP_TeamCollab_Beta_Alert',
                    });
                    yield this.add('VoIP_TeamCollab_FreeSwitch_Host', '', {
                        type: 'string',
                        public: true,
                        invalidValue: '',
                    });
                    yield this.add('VoIP_TeamCollab_FreeSwitch_Port', 8021, {
                        type: 'int',
                        public: true,
                        invalidValue: 8021,
                    });
                    yield this.add('VoIP_TeamCollab_FreeSwitch_Password', '', {
                        type: 'password',
                        public: true,
                        invalidValue: '',
                    });
                    yield this.add('VoIP_TeamCollab_FreeSwitch_Timeout', 3000, {
                        type: 'int',
                        public: true,
                        invalidValue: 3000,
                    });
                    yield this.add('VoIP_TeamCollab_FreeSwitch_WebSocket_Path', '', {
                        type: 'string',
                        public: true,
                        invalidValue: '',
                    });
                });
            });
        });
    });
}
