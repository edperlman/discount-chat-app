"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const PageHeader_1 = __importDefault(require("../../components/Page/PageHeader"));
const EDIT_LAYOUT_PERMISSIONS = ['view-privileged-setting', 'edit-privileged-setting', 'manage-selected-settings'];
const HomepageHeader = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const title = (0, ui_contexts_1.useSetting)('Layout_Home_Title', 'Home');
    const canEditLayout = (0, ui_contexts_1.useAllPermissions)(EDIT_LAYOUT_PERMISSIONS);
    const settingsRoute = (0, ui_contexts_1.useRoute)('admin-settings');
    return ((0, jsx_runtime_1.jsx)(PageHeader_1.default, { title: title, "data-qa-id": 'home-header', children: canEditLayout && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'pencil', onClick: () => settingsRoute.push({ group: 'Layout' }), children: t('Customize') })) }));
};
exports.default = HomepageHeader;
