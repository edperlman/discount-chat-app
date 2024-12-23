"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useMessageActionAppsActionButtons_1 = require("./useMessageActionAppsActionButtons");
const MessageToolbarStarsActionMenu = ({ message, context, onChangeMenuVisibility }) => {
    var _a;
    const starsAction = (0, useMessageActionAppsActionButtons_1.useMessageActionAppsActionButtons)(message, context, 'ai');
    const { t } = (0, react_i18next_1.useTranslation)();
    const id = (0, fuselage_hooks_1.useUniqueId)();
    if (!((_a = starsAction.data) === null || _a === void 0 ? void 0 : _a.length)) {
        return null;
    }
    const isMessageEncrypted = (0, core_typings_1.isE2EEMessage)(message);
    const groupOptions = starsAction.data.reduce((acc, option) => {
        const transformedOption = Object.assign(Object.assign({ variant: option.color === 'alert' ? 'danger' : '', id: option.id, icon: option.icon, content: t(option.label), onClick: option.action, type: option.type }, (typeof option.disabled === 'boolean' && { disabled: option.disabled })), (typeof option.disabled === 'boolean' &&
            option.disabled && { tooltip: t('Action_not_available_encrypted_content', { action: t(option.label) }) }));
        const group = option.type || '';
        let section = acc.find((section) => section.id === group);
        if (!section) {
            section = { id: group, title: '', items: [] };
            acc.push(section);
        }
        // Add option to the appropriate section
        section.items.push(transformedOption);
        // Handle the "apps" section if message is encrypted
        if (group === 'apps' && isMessageEncrypted) {
            section.items = [
                {
                    content: t('Unavailable'),
                    id,
                    disabled: true,
                    gap: false,
                    tooltip: t('Action_not_available_encrypted_content', { action: t('Apps') }),
                },
            ];
        }
        return acc;
    }, []);
    return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { detached: true, icon: 'stars', title: t('AI_Actions'), sections: groupOptions, placement: 'bottom-end', "data-qa-id": 'menu', "data-qa-type": 'message-action-stars-menu-options', onOpenChange: onChangeMenuVisibility }));
};
exports.default = MessageToolbarStarsActionMenu;
