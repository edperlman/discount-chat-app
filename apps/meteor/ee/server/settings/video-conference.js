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
    return server_1.settingsRegistry.addGroup('Video_Conference', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.with({
                enterprise: true,
                modules: ['videoconference-enterprise'],
            }, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('VideoConf_Enable_DMs', true, {
                        type: 'boolean',
                        public: true,
                        invalidValue: true,
                    });
                    yield this.add('VideoConf_Enable_Channels', true, {
                        type: 'boolean',
                        public: true,
                        invalidValue: true,
                    });
                    yield this.add('VideoConf_Enable_Groups', true, {
                        type: 'boolean',
                        public: true,
                        invalidValue: true,
                    });
                    yield this.add('VideoConf_Enable_Teams', true, {
                        type: 'boolean',
                        public: true,
                        invalidValue: true,
                    });
                    const discussionsEnabled = { _id: 'Discussion_enabled', value: true };
                    yield this.add('VideoConf_Enable_Persistent_Chat', false, {
                        type: 'boolean',
                        public: true,
                        invalidValue: false,
                        alert: 'VideoConf_Enable_Persistent_Chat_Alert',
                        enableQuery: [discussionsEnabled],
                    });
                    const persistentChatEnabled = { _id: 'VideoConf_Enable_Persistent_Chat', value: true };
                    yield this.add('VideoConf_Persistent_Chat_Discussion_Name', 'Video Call Chat', {
                        type: 'string',
                        public: true,
                        invalidValue: 'Conference Call Chat History',
                        i18nDescription: 'VideoConf_Persistent_Chat_Discussion_Name_Description',
                        enableQuery: [discussionsEnabled, persistentChatEnabled],
                    });
                });
            });
        });
    });
}
