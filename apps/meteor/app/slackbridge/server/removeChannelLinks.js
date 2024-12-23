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
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const server_1 = require("../../settings/server");
meteor_1.Meteor.methods({
    removeSlackBridgeChannelLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeSlackBridgeChannelLinks',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'remove-slackbridge-links'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'removeSlackBridgeChannelLinks',
                });
            }
            if (server_1.settings.get('SlackBridge_Enabled') !== true) {
                throw new meteor_1.Meteor.Error('SlackBridge_disabled');
            }
            yield models_1.Rooms.unsetAllImportIds();
            return {
                message: 'Slackbridge_channel_links_removed_successfully',
                params: [],
            };
        });
    },
});
