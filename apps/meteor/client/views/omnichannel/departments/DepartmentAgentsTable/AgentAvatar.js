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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const AgentAvatar = ({ name, username, eTag }) => {
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: mediaQuery ? 'x28' : 'x40', title: username, username: username, etag: eTag }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', withTruncatedText: true, mi: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignSelf: 'center', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', withTruncatedText: true, color: 'default', children: name || username }), !mediaQuery && name && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: [' ', `@${username}`, ' '] }))] }) })] }));
};
exports.default = (0, react_1.memo)(AgentAvatar);
