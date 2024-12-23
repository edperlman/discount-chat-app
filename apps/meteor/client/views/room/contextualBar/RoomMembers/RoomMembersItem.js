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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const RoomMembersActions_1 = __importDefault(require("./RoomMembersActions"));
const getUserDisplayNames_1 = require("../../../../../lib/getUserDisplayNames");
const UserStatus_1 = require("../../../../components/UserStatus");
const usePreventPropagation_1 = require("../../../../hooks/usePreventPropagation");
const RoomMembersItem = ({ _id, name, username, federated, freeSwitchExtension, onClickView, rid, reload, useRealName, }) => {
    const [showButton, setShowButton] = (0, react_1.useState)();
    const isReduceMotionEnabled = (0, fuselage_hooks_1.usePrefersReducedMotion)();
    const handleMenuEvent = {
        [isReduceMotionEnabled ? 'onMouseEnter' : 'onTransitionEnd']: setShowButton,
    };
    const preventPropagation = (0, usePreventPropagation_1.usePreventPropagation)();
    const [nameOrUsername, displayUsername] = (0, getUserDisplayNames_1.getUserDisplayNames)(name, username, useRealName);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Option, Object.assign({ "data-username": username, "data-userid": _id, onClick: onClickView }, handleMenuEvent, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username || '', size: 'x28' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: federated ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'globe', size: 'x16' }) : (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: _id }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.OptionContent, { "data-qa": `MemberItem-${username}`, children: [nameOrUsername, " ", displayUsername && (0, jsx_runtime_1.jsxs)(fuselage_1.OptionDescription, { children: ["(", displayUsername, ")"] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionMenu, { onClick: preventPropagation, children: showButton ? ((0, jsx_runtime_1.jsx)(RoomMembersActions_1.default, { username: username, name: name, rid: rid, _id: _id, freeSwitchExtension: freeSwitchExtension, reload: reload })) : ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { tiny: true, icon: 'kebab' })) })] })));
};
exports.default = Object.assign(RoomMembersItem, {
    Skeleton: fuselage_1.OptionSkeleton,
});
