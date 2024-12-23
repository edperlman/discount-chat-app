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
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const E2EEState_1 = require("../../app/e2e/client/E2EEState");
const rocketchat_e2e_1 = require("../../app/e2e/client/rocketchat.e2e");
const MentionsParser_1 = require("../../app/mentions/lib/MentionsParser");
const client_1 = require("../../app/models/client");
const client_2 = require("../../app/settings/client");
const onClientBeforeSendMessage_1 = require("../lib/onClientBeforeSendMessage");
const onClientMessageReceived_1 = require("../lib/onClientMessageReceived");
const isLayoutEmbedded_1 = require("../lib/utils/isLayoutEmbedded");
const waitUntilFind_1 = require("../lib/utils/waitUntilFind");
const RouterProvider_1 = require("../providers/RouterProvider");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        if (!meteor_1.Meteor.userId()) {
            rocketchat_e2e_1.e2e.log('Not logged in');
            return;
        }
        if (!window.crypto) {
            rocketchat_e2e_1.e2e.error('No crypto support');
            return;
        }
        const enabled = client_2.settings.get('E2E_Enable');
        // we don't care about the reactivity of this boolean
        const adminEmbedded = (0, isLayoutEmbedded_1.isLayoutEmbedded)() && RouterProvider_1.router.getLocationPathname().startsWith('/admin');
        if (enabled && !adminEmbedded) {
            rocketchat_e2e_1.e2e.log('E2E enabled starting client');
            rocketchat_e2e_1.e2e.startClient();
        }
        else {
            rocketchat_e2e_1.e2e.log('E2E disabled');
            rocketchat_e2e_1.e2e.setState(E2EEState_1.E2EEState.DISABLED);
            rocketchat_e2e_1.e2e.closeAlert();
        }
    });
    let offClientMessageReceived;
    let offClientBeforeSendMessage;
    let listenersAttached = false;
    tracker_1.Tracker.autorun(() => {
        if (!rocketchat_e2e_1.e2e.isReady()) {
            rocketchat_e2e_1.e2e.log('Not ready');
            offClientMessageReceived === null || offClientMessageReceived === void 0 ? void 0 : offClientMessageReceived();
            offClientBeforeSendMessage === null || offClientBeforeSendMessage === void 0 ? void 0 : offClientBeforeSendMessage();
            listenersAttached = false;
            return;
        }
        if (listenersAttached) {
            rocketchat_e2e_1.e2e.log('Listeners already attached');
            return;
        }
        offClientMessageReceived = onClientMessageReceived_1.onClientMessageReceived.use((msg) => __awaiter(void 0, void 0, void 0, function* () {
            const e2eRoom = yield rocketchat_e2e_1.e2e.getInstanceByRoomId(msg.rid);
            if (!(e2eRoom === null || e2eRoom === void 0 ? void 0 : e2eRoom.shouldConvertReceivedMessages())) {
                return msg;
            }
            if ((0, core_typings_1.isE2EEPinnedMessage)(msg)) {
                return rocketchat_e2e_1.e2e.decryptPinnedMessage(msg);
            }
            return rocketchat_e2e_1.e2e.decryptMessage(msg);
        }));
        // Encrypt messages before sending
        offClientBeforeSendMessage = onClientBeforeSendMessage_1.onClientBeforeSendMessage.use((message) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const e2eRoom = yield rocketchat_e2e_1.e2e.getInstanceByRoomId(message.rid);
            if (!e2eRoom) {
                return message;
            }
            const subscription = yield (0, waitUntilFind_1.waitUntilFind)(() => client_1.Rooms.findOne({ _id: message.rid }));
            subscription.encrypted ? e2eRoom.resume() : e2eRoom.pause();
            const shouldConvertSentMessages = yield e2eRoom.shouldConvertSentMessages(message);
            if (!shouldConvertSentMessages) {
                return message;
            }
            const mentionsEnabled = client_2.settings.get('E2E_Enabled_Mentions');
            if (mentionsEnabled) {
                const me = ((_a = meteor_1.Meteor.user()) === null || _a === void 0 ? void 0 : _a.username) || '';
                const pattern = client_2.settings.get('UTF8_User_Names_Validation');
                const useRealName = client_2.settings.get('UI_Use_Real_Name');
                const mentions = new MentionsParser_1.MentionsParser({
                    pattern: () => pattern,
                    useRealName: () => useRealName,
                    me: () => me,
                });
                const e2eMentions = {
                    e2eUserMentions: mentions.getUserMentions(message.msg),
                    e2eChannelMentions: mentions.getChannelMentions(message.msg),
                };
                message.e2eMentions = e2eMentions;
            }
            // Should encrypt this message.
            return e2eRoom.encryptMessage(message);
        }));
        listenersAttached = true;
        rocketchat_e2e_1.e2e.log('Listeners attached', listenersAttached);
    });
});
