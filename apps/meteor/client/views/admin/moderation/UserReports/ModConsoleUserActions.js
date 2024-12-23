"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useDeactivateUserAction_1 = __importDefault(require("../hooks/useDeactivateUserAction"));
const useDismissUserAction_1 = __importDefault(require("../hooks/useDismissUserAction"));
const useResetAvatarAction_1 = __importDefault(require("../hooks/useResetAvatarAction"));
const ModConsoleUserActions = ({ report, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { reportedUser: { _id: uid }, } = report;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { title: t('Options'), sections: [
                {
                    items: [
                        {
                            id: 'seeReports',
                            content: t('Moderation_See_reports'),
                            icon: 'document-eye',
                            onClick: () => onClick(uid),
                        },
                    ],
                },
                {
                    items: [(0, useDismissUserAction_1.default)(uid, true), (0, useDeactivateUserAction_1.default)(uid, true), (0, useResetAvatarAction_1.default)(uid)],
                },
            ], placement: 'bottom-end' }) }));
};
exports.default = ModConsoleUserActions;
