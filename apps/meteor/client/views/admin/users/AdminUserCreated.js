"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const AdminUserCreated = ({ uid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { icon: 'user', title: t('You_have_created_user') }), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', onClick: () => router.navigate(`/admin/users/new`), flexBasis: '0', children: t('Add_more_users') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => router.navigate(`/admin/users/info/${uid}`), flexBasis: '0', children: t('Done') })] }) })] }));
};
exports.default = AdminUserCreated;
