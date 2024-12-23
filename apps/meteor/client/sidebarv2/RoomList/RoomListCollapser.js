"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useUnreadDisplay_1 = require("../hooks/useUnreadDisplay");
const RoomListCollapser = (_a) => {
    var { groupTitle, unreadCount: unreadGroupCount, collapsedGroups } = _a, props = __rest(_a, ["groupTitle", "unreadCount", "collapsedGroups"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { unreadTitle, unreadVariant, showUnread, unreadCount } = (0, useUnreadDisplay_1.useUnreadDisplay)(unreadGroupCount);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarV2CollapseGroup, Object.assign({ title: t(groupTitle), expanded: !collapsedGroups.includes(groupTitle), badge: showUnread ? ((0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: unreadVariant, title: unreadTitle, "aria-label": unreadTitle, role: 'status', children: unreadCount.total })) : undefined }, props)));
};
exports.default = RoomListCollapser;
