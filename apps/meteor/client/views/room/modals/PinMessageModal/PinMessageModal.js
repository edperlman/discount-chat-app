"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const QuoteAttachment_1 = require("../../../../components/message/content/attachments/QuoteAttachment");
const useUserDisplayName_1 = require("../../../../hooks/useUserDisplayName");
const AttachmentProvider_1 = __importDefault(require("../../../../providers/AttachmentProvider"));
const PinMessageModal = (_a) => {
    var { message } = _a, props = __rest(_a, ["message"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const getUserAvatarPath = (0, ui_contexts_1.useUserAvatarPath)();
    const displayName = (0, useUserDisplayName_1.useUserDisplayName)(message.u);
    const avatarUrl = getUserAvatarPath(message.u.username);
    const attachment = {
        author_name: String(displayName),
        author_link: '',
        author_icon: avatarUrl,
        message_link: '',
        text: message.msg,
        attachments: message.attachments,
        md: message.md,
    };
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, Object.assign({ icon: 'pin', title: t('Pin_Message'), variant: 'warning', confirmText: t('Yes_pin_message') }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, is: 'p', children: t('Are_you_sure_you_want_to_pin_this_message') }), (0, jsx_runtime_1.jsx)(AttachmentProvider_1.default, { children: (0, jsx_runtime_1.jsx)(QuoteAttachment_1.QuoteAttachment, { attachment: attachment }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'c1', mbs: 16, children: t('Pinned_messages_are_visible_to_everyone') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'c1', children: t('Starred_messages_are_only_visible_to_you') })] })));
};
exports.default = PinMessageModal;
