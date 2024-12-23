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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const irc_bridge_1 = __importDefault(require("../irc-bridge"));
meteor_1.Meteor.methods({
    resetIrcConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const ircEnabled = Boolean(server_1.settings.get('IRC_Enabled'));
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'resetIrcConnection' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-privileged-setting'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'resetIrcConnection' });
            }
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: uid,
                username: (yield meteor_1.Meteor.userAsync()).username,
                ip: ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.clientAddress) || '',
                useragent: ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.httpHeaders['user-agent']) || '',
            });
            const updatedLastPingValue = yield auditSettingOperation(models_1.Settings.updateValueById, 'IRC_Bridge_Last_Ping', new Date(0), {
                upsert: true,
            });
            if (updatedLastPingValue.modifiedCount || updatedLastPingValue.upsertedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)('IRC_Bridge_Last_Ping');
            }
            const updatedResetTimeValue = yield auditSettingOperation(models_1.Settings.updateValueById, 'IRC_Bridge_Reset_Time', new Date(), {
                upsert: true,
            });
            if (updatedResetTimeValue.modifiedCount || updatedResetTimeValue.upsertedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)('IRC_Bridge_Last_Ping');
            }
            if (!ircEnabled) {
                return {
                    message: 'Connection_Closed',
                    params: [],
                };
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // Normalize the config values
                const config = {
                    server: {
                        protocol: server_1.settings.get('IRC_Protocol'),
                        host: server_1.settings.get('IRC_Host'),
                        port: server_1.settings.get('IRC_Port'),
                        name: server_1.settings.get('IRC_Name'),
                        description: server_1.settings.get('IRC_Description'),
                    },
                    passwords: {
                        local: server_1.settings.get('IRC_Local_Password'),
                        peer: server_1.settings.get('IRC_Peer_Password'),
                    },
                };
                // TODO: is this the best way to do this? is this really necessary?
                meteor_1.Meteor.ircBridge = new irc_bridge_1.default(config);
                yield meteor_1.Meteor.ircBridge.init();
            }), 300);
            return {
                message: 'Connection_Reset',
                params: [],
            };
        });
    },
});
