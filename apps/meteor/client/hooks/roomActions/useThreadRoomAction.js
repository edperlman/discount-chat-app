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
exports.useThreadRoomAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Header_1 = require("../../components/Header");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const getVariant = (tunreadUser, tunreadGroup) => {
    if (tunreadUser > 0) {
        return 'danger';
    }
    if (tunreadGroup > 0) {
        return 'warning';
    }
    return 'primary';
};
const Threads = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../views/room/contextualBar/Threads'))));
const useThreadRoomAction = () => {
    var _a, _b, _c, _d, _e, _f;
    const enabled = (0, ui_contexts_1.useSetting)('Threads_enabled', false);
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const tunread = (_b = (_a = subscription === null || subscription === void 0 ? void 0 : subscription.tunread) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    const tunreadUser = (_d = (_c = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadUser) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
    const tunreadGroup = (_f = (_e = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadGroup) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0;
    const unread = tunread > 99 ? '99+' : tunread;
    const variant = getVariant(tunreadUser, tunreadGroup);
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, react_1.useMemo)(() => {
        if (!enabled) {
            return undefined;
        }
        return {
            id: 'thread',
            groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
            full: true,
            title: 'Threads',
            icon: 'thread',
            tabComponent: Threads,
            order: 2,
            renderToolboxItem: ({ id, className, index, icon, title, toolbox: { tab }, action, disabled, tooltip }) => ((0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarAction, { className: className, index: index, id: id, icon: icon, title: t(title), pressed: id === (tab === null || tab === void 0 ? void 0 : tab.id), action: action, disabled: disabled, tooltip: tooltip, children: !!unread && (0, jsx_runtime_1.jsx)(Header_1.HeaderToolbarActionBadge, { variant: variant, children: unread }) }, id)),
        };
    }, [enabled, t, unread, variant]);
};
exports.useThreadRoomAction = useThreadRoomAction;
