"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useDeactivateUserAction_1 = __importDefault(require("./hooks/useDeactivateUserAction"));
const useDeleteMessagesAction_1 = __importDefault(require("./hooks/useDeleteMessagesAction"));
const useDismissUserAction_1 = __importDefault(require("./hooks/useDismissUserAction"));
const useResetAvatarAction_1 = __importDefault(require("./hooks/useResetAvatarAction"));
const MessageContextFooter = ({ userId, deleted }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dismissUserAction = (0, useDismissUserAction_1.default)(userId);
    const deleteMessagesAction = (0, useDeleteMessagesAction_1.default)(userId);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: dismissUserAction.onClick, children: t('Moderation_Dismiss_all_reports') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: deleteMessagesAction.onClick, secondary: true, danger: true, children: t('Moderation_Delete_all_messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 0, marginInlineStart: 8, children: (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { large: true, title: t('More'), items: [
                        Object.assign(Object.assign({}, (0, useDeactivateUserAction_1.default)(userId)), (deleted && { disabled: true })),
                        Object.assign(Object.assign({}, (0, useResetAvatarAction_1.default)(userId)), (deleted && { disabled: true })),
                    ], placement: 'top-end' }) })] }));
};
exports.default = MessageContextFooter;
