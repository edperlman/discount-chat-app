"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useBlockChannel_1 = require("./useBlockChannel");
const OmnichannelRoomIcon_1 = require("../../../../../components/RoomIcon/OmnichannelRoomIcon");
const useTimeFromNow_1 = require("../../../../../hooks/useTimeFromNow");
const useOmnichannelSource_1 = require("../../../hooks/useOmnichannelSource");
const ContactInfoChannelsItem = ({ visitor, details, blocked, lastChat }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getSourceLabel, getSourceName } = (0, useOmnichannelSource_1.useOmnichannelSource)();
    const getTimeFromNow = (0, useTimeFromNow_1.useTimeFromNow)(true);
    const [showButton, setShowButton] = (0, react_1.useState)(false);
    const handleBlockContact = (0, useBlockChannel_1.useBlockChannel)({ association: visitor, blocked });
    const customClass = (0, css_in_js_1.css) `
		&:hover,
		&:focus {
			background: ${fuselage_1.Palette.surface['surface-hover']};
		}
	`;
    const menuItems = [
        {
            id: 'block',
            icon: 'ban',
            content: blocked ? t('Unblock') : t('Block'),
            variant: 'danger',
            onClick: handleBlockContact,
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { tabIndex: 0, borderBlockEndWidth: 1, borderBlockEndColor: 'stroke-extra-light', borderBlockEndStyle: 'solid', className: ['rcx-box--animated', customClass], pi: 24, pb: 12, display: 'flex', flexDirection: 'column', onFocus: () => setShowButton(true), onPointerEnter: () => setShowButton(true), onPointerLeave: () => setShowButton(false), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [details && (0, jsx_runtime_1.jsx)(OmnichannelRoomIcon_1.OmnichannelRoomIcon, { source: details, size: 'x18', placement: 'default' }), details && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mi: 4, fontScale: 'p2b', children: [getSourceName(details), " ", blocked && `(${t('Blocked')})`] })), lastChat && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 4, fontScale: 'c1', children: getTimeFromNow(lastChat.ts) }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { minHeight: 'x24', alignItems: 'center', mbs: 4, display: 'flex', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: getSourceLabel(details) }), showButton && (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { detached: true, title: t('Options'), sections: [{ items: menuItems }], tiny: true })] })] }));
};
exports.default = ContactInfoChannelsItem;
