"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const messageBoxFormatting_1 = require("../../../../../../app/ui-message/client/messageBox/messageBoxFormatting");
const FormattingToolbarDropdown = ({ composer, items, disabled }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formattingItems = items.map((formatter) => {
        const handleFormattingAction = () => {
            if ('link' in formatter) {
                window.open(formatter.link, '_blank', 'rel=noreferrer noopener');
                return;
            }
            if ((0, messageBoxFormatting_1.isPromptButton)(formatter)) {
                return formatter.prompt(composer);
            }
            composer.wrapSelection(formatter.pattern);
        };
        return {
            id: `formatter-${formatter.label}`,
            content: t(formatter.label),
            icon: 'icon' in formatter ? formatter.icon : 'link',
            onClick: () => handleFormattingAction(),
        };
    });
    const sections = [{ title: t('Message_Formatting_Toolbox'), items: formattingItems }];
    return (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { title: t('Message_Formatting_Toolbox'), disabled: disabled, detached: true, icon: 'meatballs', sections: sections });
};
exports.default = FormattingToolbarDropdown;
