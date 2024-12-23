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
exports.online = online;
exports.findGuest = findGuest;
exports.findGuestWithoutActivity = findGuestWithoutActivity;
exports.findRoom = findRoom;
exports.findOpenRoom = findOpenRoom;
exports.findAgent = findAgent;
exports.normalizeHttpHeaderData = normalizeHttpHeaderData;
exports.settings = settings;
exports.getExtraConfigInfo = getExtraConfigInfo;
exports.onCheckRoomParams = onCheckRoomParams;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
const Helper_1 = require("../../lib/Helper");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
function online(department, skipSettingCheck = false, skipFallbackCheck = false) {
    return LivechatTyped_1.Livechat.online(department, skipSettingCheck, skipFallbackCheck);
}
function findTriggers() {
    return __awaiter(this, void 0, void 0, function* () {
        const triggers = yield models_1.LivechatTrigger.findEnabled().toArray();
        const hasLicense = license_1.License.hasModule('livechat-enterprise');
        const premiumActions = ['use-external-service'];
        return triggers
            .filter(({ actions }) => hasLicense || actions.some((c) => !premiumActions.includes(c.name)))
            .map(({ _id, actions, conditions, runOnce }) => ({
            _id,
            actions,
            conditions,
            runOnce,
        }));
    });
}
function findDepartments(businessUnit) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: check this function usage
        return (yield (yield models_1.LivechatDepartment.findEnabledWithAgentsAndBusinessUnit(businessUnit, {
            _id: 1,
            name: 1,
            showOnRegistration: 1,
            showOnOfflineForm: 1,
        })).toArray()).map(({ _id, name, showOnRegistration, showOnOfflineForm }) => ({
            _id,
            name,
            showOnRegistration,
            showOnOfflineForm,
        }));
    });
}
function findGuest(token) {
    return models_1.LivechatVisitors.getVisitorByToken(token);
}
function findGuestWithoutActivity(token) {
    return models_1.LivechatVisitors.getVisitorByToken(token, { projection: { name: 1, username: 1, token: 1, visitorEmails: 1, department: 1 } });
}
function findRoom(token, rid) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = {
            t: 1,
            departmentId: 1,
            servedBy: 1,
            open: 1,
            v: 1,
            ts: 1,
        };
        if (!rid) {
            return models_1.LivechatRooms.findOneByVisitorToken(token, fields);
        }
        return models_1.LivechatRooms.findOneByIdAndVisitorToken(rid, token, fields);
    });
}
function findOpenRoom(token, departmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            projection: {
                departmentId: 1,
                servedBy: 1,
                open: 1,
                callStatus: 1,
            },
        };
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const rooms = departmentId
            ? yield models_1.LivechatRooms.findOpenByVisitorTokenAndDepartmentId(token, departmentId, options, extraQuery).toArray()
            : yield models_1.LivechatRooms.findOpenByVisitorToken(token, options, extraQuery).toArray();
        if (rooms && rooms.length > 0) {
            return rooms[0];
        }
    });
}
function findAgent(agentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, Helper_1.normalizeAgent)(agentId);
    });
}
function normalizeHttpHeaderData(headers = {}) {
    const httpHeaders = Object.assign({}, headers);
    return { httpHeaders };
}
function settings() {
    return __awaiter(this, arguments, void 0, function* ({ businessUnit = '' } = {}) {
        // Putting this ugly conversion while we type the livechat service
        const initSettings = yield LivechatTyped_1.Livechat.getInitSettings();
        const triggers = yield findTriggers();
        const departments = yield findDepartments(businessUnit);
        const sound = `${meteor_1.Meteor.absoluteUrl()}sounds/chime.mp3`;
        const emojis = yield models_1.EmojiCustom.find().toArray();
        return {
            enabled: initSettings.Livechat_enabled,
            settings: {
                registrationForm: initSettings.Livechat_registration_form,
                allowSwitchingDepartments: initSettings.Livechat_allow_switching_departments,
                nameFieldRegistrationForm: initSettings.Livechat_name_field_registration_form,
                emailFieldRegistrationForm: initSettings.Livechat_email_field_registration_form,
                displayOfflineForm: initSettings.Livechat_display_offline_form,
                videoCall: initSettings.Omnichannel_call_provider === 'default-provider',
                fileUpload: initSettings.Livechat_fileupload_enabled && initSettings.FileUpload_Enabled,
                language: initSettings.Language,
                transcript: initSettings.Livechat_enable_transcript,
                historyMonitorType: initSettings.Livechat_history_monitor_type,
                forceAcceptDataProcessingConsent: initSettings.Livechat_force_accept_data_processing_consent,
                showConnecting: initSettings.Livechat_Show_Connecting,
                agentHiddenInfo: initSettings.Livechat_show_agent_info === false,
                clearLocalStorageWhenChatEnded: initSettings.Livechat_clear_local_storage_when_chat_ended,
                limitTextLength: initSettings.Livechat_enable_message_character_limit &&
                    (initSettings.Livechat_message_character_limit || initSettings.Message_MaxAllowedSize),
                hiddenSystemMessages: initSettings.Livechat_hide_system_messages,
                livechatLogo: initSettings.Assets_livechat_widget_logo,
                hideWatermark: initSettings.Livechat_hide_watermark || false,
                visitorsCanCloseChat: initSettings.Omnichannel_allow_visitors_to_close_conversation,
            },
            theme: {
                title: initSettings.Livechat_title,
                color: initSettings.Livechat_title_color,
                offlineTitle: initSettings.Livechat_offline_title,
                offlineColor: initSettings.Livechat_offline_title_color,
                position: initSettings.Livechat_widget_position || 'right',
                background: initSettings.Livechat_background,
                actionLinks: {
                    webrtc: [
                        {
                            actionLinksAlignment: 'flex-start',
                            i18nLabel: 'Join_call',
                            label: i18n_1.i18n.t('Join_call'),
                            method_id: 'joinLivechatWebRTCCall',
                        },
                        {
                            i18nLabel: 'End_call',
                            label: i18n_1.i18n.t('End_call'),
                            method_id: 'endLivechatWebRTCCall',
                            danger: true,
                        },
                    ],
                    jitsi: [
                        { icon: 'icon-videocam', i18nLabel: 'Accept' },
                        { icon: 'icon-cancel', i18nLabel: 'Decline' },
                    ],
                },
            },
            messages: {
                offlineMessage: initSettings.Livechat_offline_message,
                offlineSuccessMessage: initSettings.Livechat_offline_success_message,
                offlineUnavailableMessage: initSettings.Livechat_offline_form_unavailable,
                conversationFinishedMessage: initSettings.Livechat_conversation_finished_message,
                conversationFinishedText: initSettings.Livechat_conversation_finished_text,
                transcriptMessage: initSettings.Livechat_transcript_message,
                registrationFormMessage: initSettings.Livechat_registration_form_message,
                dataProcessingConsentText: initSettings.Livechat_data_processing_consent_text,
            },
            survey: {
                items: ['satisfaction', 'agentKnowledge', 'agentResposiveness', 'agentFriendliness'],
                values: ['1', '2', '3', '4', '5'],
            },
            triggers,
            departments,
            resources: {
                sound,
                emojis,
            },
        };
    });
}
function getExtraConfigInfo(room) {
    return __awaiter(this, void 0, void 0, function* () {
        return callbacks_1.callbacks.run('livechat.onLoadConfigApi', { room });
    });
}
// TODO: please forgive me for this. Still finding the good types for these callbacks
function onCheckRoomParams(params) {
    return callbacks_1.callbacks.run('livechat.onCheckRoomApiParams', params);
}
