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
const react_1 = __importStar(require("react"));
const UserStatus_1 = require("../../components/UserStatus");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const UserItem = ({ item, id, style, t, SidebarItemTemplate, AvatarTemplate, useRealName }) => {
    const title = useRealName ? item.fname || item.name : item.name || item.fname;
    const icon = (0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2ItemIcon, { icon: (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: item._id }) });
    const href = roomCoordinator_1.roomCoordinator.getRouteLink(item.t, { name: item.name });
    return ((0, jsx_runtime_1.jsx)(SidebarItemTemplate, { is: 'a', style: Object.assign({ height: '100%' }, style), id: id, href: href, title: title, subtitle: t('No_messages_yet'), avatar: AvatarTemplate && (0, jsx_runtime_1.jsx)(AvatarTemplate, Object.assign({}, item)), icon: icon }));
};
exports.default = (0, react_1.memo)(UserItem);
