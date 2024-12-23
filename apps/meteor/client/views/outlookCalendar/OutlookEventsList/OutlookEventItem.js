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
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const OutlookCalendarEventModal_1 = __importDefault(require("../OutlookCalendarEventModal"));
const useOutlookOpenCall_1 = require("../hooks/useOutlookOpenCall");
const OutlookEventItem = ({ subject, description, startTime, meetingUrl }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const openCall = (0, useOutlookOpenCall_1.useOutlookOpenCall)(meetingUrl);
    const hovered = (0, css_in_js_1.css) `
		&:hover {
			cursor: pointer;
		}

		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
		}
	`;
    const handleOpenEvent = () => {
        setModal((0, jsx_runtime_1.jsx)(OutlookCalendarEventModal_1.default, { onClose: () => setModal(null), onCancel: () => setModal(null), subject: subject, meetingUrl: meetingUrl, description: description }));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: hovered, borderBlockEndWidth: 1, borderBlockEndColor: 'stroke-extra-light', borderBlockEndStyle: 'solid', pi: 24, pb: 16, display: 'flex', justifyContent: 'space-between', onClick: handleOpenEvent, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: subject }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', children: formatDateAndTime(startTime) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: meetingUrl && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: openCall, small: true, children: t('Join') })) })] }));
};
exports.default = OutlookEventItem;
