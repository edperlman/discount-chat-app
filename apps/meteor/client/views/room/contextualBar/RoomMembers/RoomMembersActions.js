"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useUserInfoActions_1 = require("../../hooks/useUserInfoActions");
const RoomMembersActions = ({ username, _id, name, rid, freeSwitchExtension, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { menuActions: menuOptions } = (0, useUserInfoActions_1.useUserInfoActions)({
        rid,
        user: { _id, username, name, freeSwitchExtension },
        reload,
        size: 0,
        isMember: true,
    });
    if (!menuOptions) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { detached: true, title: t('More'), "data-qa-id": 'UserUserInfo-menu', sections: menuOptions, placement: 'bottom-end' }, 'menu');
};
exports.default = RoomMembersActions;
