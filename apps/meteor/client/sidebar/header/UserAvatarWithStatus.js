"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const UserStatus_1 = require("../../components/UserStatus");
const anon = {
    _id: '',
    username: 'Anonymous',
    status: 'online',
    avatarETag: undefined,
};
/**
 * @deprecated Feature preview
 * @description Should be moved to the core when the feature is ready
 * @memberof navigationBar
 */
const UserAvatarWithStatus = () => {
    const user = (0, ui_contexts_1.useUser)();
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    const { status = !user ? 'online' : 'offline', username, avatarETag } = user || anon;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'relative', className: (0, css_in_js_1.css) `
				cursor: pointer;
			`, children: [username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x24', username: username, etag: avatarETag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
					bottom: 0;
					right: 0;
				`, justifyContent: 'center', alignItems: 'center', display: 'flex', overflow: 'hidden', size: 'x12', borderWidth: 'default', position: 'absolute', bg: 'surface-tint', borderColor: 'extra-light', borderRadius: 'full', mie: 'neg-x2', mbe: 'neg-x2', children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { small: true, status: presenceDisabled ? 'disabled' : status }) })] }));
};
exports.default = UserAvatarWithStatus;
