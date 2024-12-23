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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const UserStatus_1 = require("../../../components/UserStatus");
const anon = {
    _id: '',
    username: 'Anonymous',
    status: 'online',
    avatarETag: undefined,
};
const UserMenuButton = (0, react_1.forwardRef)(function UserMenuButton(props, ref) {
    const user = (0, ui_contexts_1.useUser)();
    const { status = !user ? 'online' : 'offline', username, avatarETag } = user || anon;
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, Object.assign({}, props, { ref: ref, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'visible', icon: username ? (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x28', username: username, etag: avatarETag }) : 'user', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { position: 'absolute', role: 'status', className: (0, css_in_js_1.css) `
					bottom: 0;
					right: 0;
					transform: translate(30%, 30%);
				`, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', size: 'x12', borderWidth: 'default', bg: 'surface-tint', borderColor: 'extra-light', borderRadius: 'full', children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { small: true, status: presenceDisabled ? 'disabled' : status }) }) })));
});
exports.default = UserMenuButton;
