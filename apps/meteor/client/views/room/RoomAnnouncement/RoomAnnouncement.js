"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AnnouncementComponent_1 = __importDefault(require("./AnnouncementComponent"));
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const MarkdownText_1 = __importDefault(require("../../../components/MarkdownText"));
const RoomAnnouncement = ({ announcement, announcementDetails }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal(null));
    const handleClick = (e) => {
        var _a;
        if (e.target.href) {
            return;
        }
        if (((_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) !== '') {
            return;
        }
        announcementDetails
            ? announcementDetails()
            : setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { icon: null, title: t('Announcement'), confirmText: t('Close'), onConfirm: closeModal, onClose: closeModal, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: announcement, parseEmoji: true }) }) }));
    };
    return announcement ? ((0, jsx_runtime_1.jsx)(AnnouncementComponent_1.default, { onClickOpen: handleClick, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inlineWithoutBreaks', content: announcement, withTruncatedText: true, parseEmoji: true }) })) : null;
};
exports.default = RoomAnnouncement;
