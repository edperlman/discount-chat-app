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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const isTruthy_1 = require("../../../../lib/isTruthy");
const UserStatus_1 = require("../../../components/UserStatus");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
/**
 * @deprecated on newNavigation feature. Remove after full migration.
 */
const LeaderBar = ({ _id, name, username, visible, onAvatarClick, triggerProps }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const chatNowLink = (0, react_1.useMemo)(() => roomCoordinator_1.roomCoordinator.getRouteLink('d', { name: username }) || undefined, [username]);
    const handleAvatarClick = (0, react_1.useCallback)((event) => {
        onAvatarClick === null || onAvatarClick === void 0 ? void 0 : onAvatarClick(event, username);
    }, [onAvatarClick, username]);
    if (!username) {
        throw new Error('username is required');
    }
    const roomLeaderStyle = (0, css_in_js_1.css) `
		position: relative;
		z-index: 9;
		right: 0;
		left: 0;
		display: flex;

		&.animated-hidden {
			display: none !important;
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { backgroundColor: 'light', color: 'default', pi: 24, pb: 8, justifyContent: 'space-between', borderBlockEndWidth: 2, borderBlockEndColor: 'extra-light', className: [roomLeaderStyle, 'room-leader', !visible && 'animated-hidden'].filter(isTruthy_1.isTruthy), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ mie: 4, onClick: handleAvatarClick }, triggerProps, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', mi: 4, display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: _id }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontWeight: 700, mis: 8, children: name })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { role: 'link', is: 'a', href: chatNowLink, children: t('Chat_Now') })] }));
};
exports.default = (0, react_1.memo)(LeaderBar);
