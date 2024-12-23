"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const toast_1 = require("../../../lib/toast");
const RoomContext_1 = require("../contexts/RoomContext");
const ComposerReadOnly = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const isSubscribed = (0, RoomContext_1.useUserIsSubscribed)();
    const joinChannel = (0, ui_contexts_1.useEndpoint)('POST', '/v1/channels.join');
    const join = (0, react_query_1.useMutation)(() => joinChannel({ roomId: room._id }), {
        onError: (error) => {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
        },
    });
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { children: [(0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCalloutContent, { children: t('room_is_read_only') }), !isSubscribed && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => join.mutate(), loading: join.isLoading, children: t('Join') }))] }));
};
exports.default = ComposerReadOnly;
