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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useOmnichannelPriorities_1 = require("../hooks/useOmnichannelPriorities");
const PRIORITY_ICONS = {
    [core_typings_1.LivechatPriorityWeight.HIGHEST]: {
        iconName: 'chevron-double-up',
        color: fuselage_1.Palette.badge['badge-background-level-4'].toString(),
    },
    [core_typings_1.LivechatPriorityWeight.HIGH]: {
        iconName: 'chevron-up',
        color: fuselage_1.Palette.badge['badge-background-level-4'].toString(),
    },
    [core_typings_1.LivechatPriorityWeight.MEDIUM]: {
        iconName: 'equal',
        color: fuselage_1.Palette.badge['badge-background-level-3'].toString(),
    },
    [core_typings_1.LivechatPriorityWeight.LOW]: {
        iconName: 'chevron-down',
        color: fuselage_1.Palette.badge['badge-background-level-2'].toString(),
    },
    [core_typings_1.LivechatPriorityWeight.LOWEST]: {
        iconName: 'chevron-double-down',
        color: fuselage_1.Palette.badge['badge-background-level-2'].toString(),
    },
};
const PriorityIcon = (_a) => {
    var { level, size = 20, showUnprioritized = false } = _a, props = __rest(_a, ["level", "size", "showUnprioritized"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { iconName, color } = PRIORITY_ICONS[level] || {};
    const { data: priorities } = (0, useOmnichannelPriorities_1.useOmnichannelPriorities)();
    const name = (0, react_1.useMemo)(() => {
        const { _id, dirty, name, i18n } = priorities.find((p) => p.sortItem === level) || {};
        if (!_id) {
            return '';
        }
        return dirty ? name : t(i18n);
    }, [level, priorities, t]);
    if (showUnprioritized && level === core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'i', mi: '4px', title: t('Unprioritized'), children: (0, jsx_runtime_1.jsx)(fuselage_1.StatusBullet, { status: 'offline' }) }));
    }
    return iconName ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, Object.assign({}, props, { name: iconName, color: color, size: size, title: name })) : null;
};
exports.PriorityIcon = PriorityIcon;
