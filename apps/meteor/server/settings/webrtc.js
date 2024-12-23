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
exports.createWebRTCSettings = void 0;
const server_1 = require("../../app/settings/server");
const createWebRTCSettings = () => server_1.settingsRegistry.addGroup('WebRTC', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('WebRTC_Enabled', false, {
            type: 'boolean',
            group: 'WebRTC',
            public: true,
            i18nLabel: 'Enabled',
        });
        yield this.add('WebRTC_Enable_Channel', false, {
            type: 'boolean',
            group: 'WebRTC',
            public: true,
            enableQuery: { _id: 'WebRTC_Enabled', value: true },
        });
        yield this.add('WebRTC_Enable_Private', false, {
            type: 'boolean',
            group: 'WebRTC',
            public: true,
            enableQuery: { _id: 'WebRTC_Enabled', value: true },
        });
        yield this.add('WebRTC_Enable_Direct', false, {
            type: 'boolean',
            group: 'WebRTC',
            public: true,
            enableQuery: { _id: 'WebRTC_Enabled', value: true },
        });
        yield this.add('WebRTC_Calls_Count', 0, {
            type: 'int',
            hidden: true,
        });
        return this.add('WebRTC_Servers', 'stun:stun.l.google.com:19302, stun:23.21.150.121, team%40rocket.chat:demo@turn:numb.viagenie.ca:3478', {
            type: 'string',
            group: 'WebRTC',
            public: true,
            enableQuery: { _id: 'WebRTC_Enabled', value: true },
        });
    });
});
exports.createWebRTCSettings = createWebRTCSettings;
