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
exports.createVConfSettings = void 0;
const server_1 = require("../../app/settings/server");
const createVConfSettings = () => server_1.settingsRegistry.addGroup('Video_Conference', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('VideoConf_Default_Provider', '', {
            type: 'lookup',
            lookupEndpoint: 'v1/video-conference.providers',
            public: true,
        });
        yield this.add('VideoConf_Mobile_Ringing', false, {
            type: 'boolean',
            public: true,
            enterprise: true,
            modules: ['videoconference-enterprise'],
            invalidValue: false,
            alert: 'VideoConf_Mobile_Ringing_Alert',
        });
        // #ToDo: Those should probably be handled by the apps themselves
        yield this.add('Jitsi_Click_To_Join_Count', 0, {
            type: 'int',
            hidden: true,
        });
        yield this.add('Jitsi_Start_SlashCommands_Count', 0, {
            type: 'int',
            hidden: true,
        });
    });
});
exports.createVConfSettings = createVConfSettings;
