"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const getBadgeVariantAndTitle = (unread, mention, all) => {
    if (!unread) {
        return false;
    }
    if (mention) {
        return ['danger', 'Mentions_you'];
    }
    if (all) {
        return ['warning', 'mention-all'];
    }
    return ['primary', 'Unread'];
};
const ThreadMetricsUnreadBadge = ({ unread, mention, all }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const result = getBadgeVariantAndTitle(unread, mention, all);
    if (!result)
        return null;
    const [variant, title] = result;
    return (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { small: true, variant: variant, role: 'status', title: t(title) });
};
exports.default = ThreadMetricsUnreadBadge;
