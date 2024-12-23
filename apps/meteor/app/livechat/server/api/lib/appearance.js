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
exports.findAppearance = findAppearance;
const models_1 = require("@rocket.chat/models");
function findAppearance() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            _id: {
                $in: [
                    'Livechat_title',
                    'Livechat_title_color',
                    'Livechat_enable_message_character_limit',
                    'Livechat_message_character_limit',
                    'Livechat_show_agent_info',
                    'Livechat_show_agent_email',
                    'Livechat_display_offline_form',
                    'Livechat_offline_form_unavailable',
                    'Livechat_offline_message',
                    'Livechat_offline_success_message',
                    'Livechat_offline_title',
                    'Livechat_offline_title_color',
                    'Livechat_offline_email',
                    'Livechat_conversation_finished_message',
                    'Livechat_registration_form',
                    'Livechat_name_field_registration_form',
                    'Livechat_email_field_registration_form',
                    'Livechat_registration_form_message',
                    'Livechat_conversation_finished_text',
                    'Livechat_hide_watermark',
                    'Livechat_background',
                    'Livechat_widget_position',
                    'Livechat_hide_system_messages',
                    'Omnichannel_allow_visitors_to_close_conversation',
                ],
            },
        };
        return {
            appearance: yield models_1.Settings.find(query).toArray(),
        };
    });
}
