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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserInfo_1 = require("../../../../components/UserInfo");
const useMemberExists_1 = require("../../../hooks/useMemberExists");
const useUserInfoActions_1 = require("../../hooks/useUserInfoActions");
const UserInfoActions = ({ user, rid, backToList }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: isMemberData, refetch, isSuccess: membershipCheckSuccess, isLoading, } = (0, useMemberExists_1.useMemberExists)({ roomId: rid, username: user.username });
    const isMember = membershipCheckSuccess && (isMemberData === null || isMemberData === void 0 ? void 0 : isMemberData.isMember);
    const { _id: userId, username, name, freeSwitchExtension } = user;
    const { actions: actionsDefinition, menuActions: menuOptions } = (0, useUserInfoActions_1.useUserInfoActions)({
        rid,
        user: { _id: userId, username, name, freeSwitchExtension },
        size: 3,
        isMember,
        reload: () => {
            backToList === null || backToList === void 0 ? void 0 : backToList();
            refetch();
        },
    });
    const menu = (0, react_1.useMemo)(() => {
        if (!(menuOptions === null || menuOptions === void 0 ? void 0 : menuOptions.length)) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { button: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'kebab', secondary: true }), title: t('More'), "data-qa-id": 'UserUserInfo-menu', sections: menuOptions, placement: 'bottom-end', small: false, "data-qa": 'UserUserInfo-menu' }, 'menu'));
    }, [menuOptions, t]);
    // TODO: sanitize Action type to avoid any
    const actions = (0, react_1.useMemo)(() => {
        const mapAction = ([key, { content, title, icon, onClick }]) => ((0, jsx_runtime_1.jsx)(UserInfo_1.UserInfoAction, { title: title, label: content, onClick: onClick, icon: icon }, key));
        return [...actionsDefinition.map(mapAction), menu].filter(Boolean);
    }, [actionsDefinition, menu]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full' });
    }
    return (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { align: 'center', children: actions });
};
exports.default = UserInfoActions;
