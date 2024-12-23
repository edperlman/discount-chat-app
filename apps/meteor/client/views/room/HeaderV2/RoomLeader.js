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
const Header_1 = require("../../../components/Header");
const UserStatus_1 = require("../../../components/UserStatus");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const UserCardContext_1 = require("../contexts/UserCardContext");
const RoomLeader = ({ _id, name, username }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { openUserCard, triggerProps } = (0, UserCardContext_1.useUserCard)();
    const onAvatarClick = (0, react_1.useCallback)((event, username) => {
        if (!username) {
            return;
        }
        openUserCard(event, username);
    }, [openUserCard]);
    const chatNowLink = (0, react_1.useMemo)(() => roomCoordinator_1.roomCoordinator.getRouteLink('d', { name: username }) || undefined, [username]);
    if (!username) {
        throw new Error('username is required');
    }
    const roomLeaderStyle = (0, css_in_js_1.css) `
		display: flex;
		align-items: center;
		flex-shrink: 0;
		flex-grow: 0;
		gap: 4px;

		[role='button'] {
			cursor: pointer;
		}
	`;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { className: roomLeaderStyle, mis: 'x24', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, Object.assign({ role: 'button', username: username, size: 'x18', onClick: (event) => onAvatarClick(event, username) }, triggerProps)), (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: _id }), (0, jsx_runtime_1.jsx)(Header_1.HeaderSubtitle, { children: name }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { role: 'link', is: 'a', title: t('Chat_with_leader'), icon: 'message', small: true, href: chatNowLink })] }));
};
exports.default = RoomLeader;
