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
exports.createIRCSettings = void 0;
const server_1 = require("../../app/settings/server");
const createIRCSettings = () => server_1.settingsRegistry.addGroup('IRC_Federation', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('IRC_Enabled', false, {
            type: 'boolean',
            i18nLabel: 'Enabled',
            i18nDescription: 'IRC_Enabled',
            alert: 'IRC_Enabled_Alert',
        });
        yield this.add('IRC_Protocol', 'RFC2813', {
            type: 'select',
            i18nLabel: 'Protocol',
            i18nDescription: 'IRC_Protocol',
            values: [
                {
                    key: 'RFC2813',
                    i18nLabel: 'RFC2813',
                },
            ],
        });
        yield this.add('IRC_Host', 'localhost', {
            type: 'string',
            i18nLabel: 'Host',
            i18nDescription: 'IRC_Host',
        });
        yield this.add('IRC_Port', 6667, {
            type: 'int',
            i18nLabel: 'Port',
            i18nDescription: 'IRC_Port',
        });
        yield this.add('IRC_Name', 'irc.rocket.chat', {
            type: 'string',
            i18nLabel: 'Name',
            i18nDescription: 'IRC_Name',
        });
        yield this.add('IRC_Description', 'Rocket.Chat IRC Bridge', {
            type: 'string',
            i18nLabel: 'Description',
            i18nDescription: 'IRC_Description',
        });
        yield this.add('IRC_Local_Password', 'password', {
            type: 'string',
            i18nLabel: 'Local_Password',
            i18nDescription: 'IRC_Local_Password',
        });
        yield this.add('IRC_Peer_Password', 'password', {
            type: 'string',
            i18nLabel: 'Peer_Password',
            i18nDescription: 'IRC_Peer_Password',
        });
        yield this.add('IRC_Reset_Connection', 'resetIrcConnection', {
            type: 'action',
            actionText: 'Reset_Connection',
            i18nLabel: 'Reset_Connection',
        });
    });
});
exports.createIRCSettings = createIRCSettings;
