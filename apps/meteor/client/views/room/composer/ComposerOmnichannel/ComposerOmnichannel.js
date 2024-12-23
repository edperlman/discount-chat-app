"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useIsRoomOverMacLimit_1 = require("../../../../hooks/omnichannel/useIsRoomOverMacLimit");
const RoomContext_1 = require("../../contexts/RoomContext");
const ComposerMessage_1 = __importDefault(require("../ComposerMessage"));
const ComposerOmnichannelCallout_1 = __importDefault(require("./ComposerOmnichannelCallout"));
const ComposerOmnichannelInquiry_1 = require("./ComposerOmnichannelInquiry");
const ComposerOmnichannelJoin_1 = require("./ComposerOmnichannelJoin");
const ComposerOmnichannelOnHold_1 = require("./ComposerOmnichannelOnHold");
const ComposerOmnichannel = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const userId = (0, ui_contexts_1.useUserId)();
    const room = (0, RoomContext_1.useOmnichannelRoom)();
    const { servedBy, queuedAt, open, onHold } = room;
    const isSubscribed = (0, RoomContext_1.useUserIsSubscribed)();
    const isInquired = !servedBy && queuedAt;
    const isSameAgent = (servedBy === null || servedBy === void 0 ? void 0 : servedBy._id) === userId;
    const isRoomOverMacLimit = (0, useIsRoomOverMacLimit_1.useIsRoomOverMacLimit)(room);
    if (!open) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCallout, { color: 'default', children: t('This_conversation_is_already_closed') })] }));
    }
    if (isRoomOverMacLimit) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCallout, { color: 'default', children: t('Workspace_exceeded_MAC_limit_disclaimer') })] }));
    }
    if (onHold) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ComposerOmnichannelOnHold_1.ComposerOmnichannelOnHold, {})] }));
    }
    if (isInquired) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ComposerOmnichannelInquiry_1.ComposerOmnichannelInquiry, {})] }));
    }
    if (!isSubscribed && !isSameAgent) {
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ComposerOmnichannelJoin_1.ComposerOmnichannelJoin, {})] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ComposerOmnichannelCallout_1.default, {}), (0, jsx_runtime_1.jsx)(ComposerMessage_1.default, Object.assign({}, props))] }));
};
exports.default = ComposerOmnichannel;
