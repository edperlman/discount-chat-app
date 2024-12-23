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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const RemoveAllClosed = (_a) => {
    var { handleClearFilters, handleRemoveClosed, hasCustomFields } = _a, props = __rest(_a, ["handleClearFilters", "handleRemoveClosed", "hasCustomFields"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const directoryRoute = (0, ui_contexts_1.useRoute)('omnichannel-current-chats');
    const canRemove = (0, ui_contexts_1.usePermission)('remove-closed-livechat-rooms');
    const canViewCustomFields = (0, ui_contexts_1.usePermission)('view-livechat-room-customfields');
    const menuOptions = Object.assign(Object.assign({ clearFilters: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { "data-qa": 'current-chats-options-clearFilters', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'refresh', size: 'x16', marginInlineEnd: 4 }), t('Clear_filters')] })),
            action: handleClearFilters,
        } }, (canRemove && {
        removeClosed: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'status-font-on-danger', "data-qa": 'current-chats-options-removeAllClosed', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'trash', size: 'x16', marginInlineEnd: 4 }), t('Delete_all_closed_chats')] })),
            action: handleRemoveClosed,
        },
    })), (canViewCustomFields &&
        hasCustomFields && {
        customFields: {
            label: ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { "data-qa": 'current-chats-options-customFields', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'magnifier', size: 'x16', marginInlineEnd: 4 }), t('Custom_Fields')] })),
            action: () => directoryRoute.push({ context: 'custom-fields' }),
        },
    }));
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Menu, Object.assign({ alignSelf: 'flex-end', small: false, options: menuOptions, placement: 'bottom-start', "data-qa": 'current-chats-options' }, props)));
};
exports.default = RemoveAllClosed;
