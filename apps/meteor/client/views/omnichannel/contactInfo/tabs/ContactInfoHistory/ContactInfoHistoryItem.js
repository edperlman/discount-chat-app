"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OmnichannelRoomIcon_1 = require("../../../../../components/RoomIcon/OmnichannelRoomIcon");
const useHasLicenseModule_1 = require("../../../../../hooks/useHasLicenseModule");
const usePreventPropagation_1 = require("../../../../../hooks/usePreventPropagation");
const useTimeFromNow_1 = require("../../../../../hooks/useTimeFromNow");
const useOmnichannelSource_1 = require("../../../hooks/useOmnichannelSource");
const AdvancedContactModal_1 = __importDefault(require("../../AdvancedContactModal"));
const ContactInfoHistoryItem = ({ source, lastMessage, verified, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getTimeFromNow = (0, useTimeFromNow_1.useTimeFromNow)(true);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const preventPropagation = (0, usePreventPropagation_1.usePreventPropagation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const { getSourceName } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const customClass = (0, css_in_js_1.css) `
		&:hover {
			cursor: pointer;
		}

		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { tabIndex: 0, role: 'listitem', "aria-label": getSourceName(source), borderBlockEndWidth: 1, borderBlockEndColor: 'stroke-extra-light', borderBlockEndStyle: 'solid', className: ['rcx-box--animated', customClass], pi: 24, pb: 12, display: 'flex', flexDirection: 'column', onClick: onClick, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [source && (0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { source: source, size: 'x18', placement: 'default' }), source && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, fontScale: 'p2b', children: getSourceName(source) })), lastMessage && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 4, fontScale: 'c1', children: getTimeFromNow(lastMessage.ts) }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 4, is: 'span', onClick: preventPropagation, children: hasLicense && verified ? ((0, jsx_runtime_1.jsx)(fuselage_1.Icon, { title: t('Verified'), mis: 4, size: 'x16', name: 'success-circle', color: 'stroke-highlight' })) : ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Unverified'), onClick: () => setModal((0, jsx_runtime_1.jsx)(AdvancedContactModal_1.default, { onCancel: () => setModal(null) })), icon: 'question-mark', tiny: true })) })] }), (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.msg.trim()) && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: 'full', mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreview, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageGenericPreviewContent, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageGenericPreviewTitle, { children: [t('Closing_chat_message'), ":"] }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageGenericPreviewDescription, { clamp: true, children: lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.msg })] }) }) }))] }));
};
exports.default = ContactInfoHistoryItem;
