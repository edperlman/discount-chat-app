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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const InfoPanel_1 = require("../../../../components/InfoPanel");
const RetentionPolicyCallout_1 = __importDefault(require("../../../../components/InfoPanel/RetentionPolicyCallout"));
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const useActionSpread_1 = require("../../../hooks/useActionSpread");
const useRetentionPolicy_1 = require("../../../room/hooks/useRetentionPolicy");
const TeamsInfo = ({ room, onClickHide, onClickClose, onClickLeave, onClickEdit, onClickDelete, onClickViewChannels, onClickConvertToChannel, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const retentionPolicy = (0, useRetentionPolicy_1.useRetentionPolicy)(room);
    const memoizedActions = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (onClickEdit && {
        edit: {
            label: t('Edit'),
            action: onClickEdit,
            icon: 'edit',
        },
    })), (onClickDelete && {
        delete: {
            label: t('Delete'),
            action: onClickDelete,
            icon: 'trash',
        },
    })), (onClickConvertToChannel && {
        convertToChannel: {
            label: t('Convert_to_channel'),
            action: onClickConvertToChannel,
            icon: 'hash',
        },
    })), (onClickHide && {
        hide: {
            label: t('Hide'),
            action: onClickHide,
            icon: 'eye-off',
        },
    })), (onClickLeave && {
        leave: {
            label: t('Leave'),
            action: onClickLeave,
            icon: 'sign-out',
        },
    }))), [t, onClickHide, onClickLeave, onClickEdit, onClickDelete, onClickConvertToChannel]);
    const { actions: actionsDefinition, menu: menuOptions } = (0, useActionSpread_1.useActionSpread)(memoizedActions);
    const menu = (0, react_1.useMemo)(() => {
        if (!menuOptions) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Menu, { small: false, flexShrink: 0, flexGrow: 0, maxHeight: 'initial', title: t('More'), secondary: true, renderItem: (_a) => {
                var { label: { label, icon } } = _a, props = __rest(_a, ["label"]);
                return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: label, icon: icon }));
            }, options: menuOptions }, 'menu'));
    }, [t, menuOptions]);
    const actions = (0, react_1.useMemo)(() => {
        const mapAction = ([key, { label, icon, action }]) => ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelAction, { label: label, onClick: action, icon: icon }, key));
        return [...actionsDefinition.map(mapAction), menu].filter(Boolean);
    }, [actionsDefinition, menu]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'info-circled' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Teams_Info') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { p: 24, children: (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanel, { children: [(0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelSection, { maxWidth: 'x332', mi: 'auto', children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.RoomAvatar, { size: 'x332', room: room }) }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelActionGroup, { children: actions })] }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelSection, { children: room.archived && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', children: t('Room_archived') }) })) }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelSection, { children: (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelTitle, { title: room.fname || room.name || '', icon: 'team' }) }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelSection, { children: [room.broadcast && ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelField, { children: (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelLabel, { children: [(0, jsx_runtime_1.jsx)("b", { children: t('Broadcast_channel') }), " ", t('Broadcast_channel_Description')] }) })), room.description && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Description') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: room.description }) })] })), room.announcement && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Announcement') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: room.announcement }) })] })), room.topic && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Topic') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: room.topic }) })] })), onClickViewChannels && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Teams_channels') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickViewChannels, small: true, children: t('View_channels') }) })] })), (retentionPolicy === null || retentionPolicy === void 0 ? void 0 : retentionPolicy.isActive) && (0, jsx_runtime_1.jsx)(RetentionPolicyCallout_1.default, { room: room })] })] }) })] }));
};
exports.default = TeamsInfo;
