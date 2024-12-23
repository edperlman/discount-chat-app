"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const AppInstallationModal = ({ enabled, limit, appName, handleClose, handleConfirm, handleEnableUnlimitedApps, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getTitle = () => {
        if (enabled === limit) {
            return t('App_limit_reached');
        }
        if (enabled > limit) {
            return t('App_limit_exceeded');
        }
        return t('Apps_Currently_Enabled', { context: '', enabled, limit });
    };
    const getContent = () => {
        if (enabled === limit) {
            return t('Enable_of_limit_apps_currently_enabled', { context: '', enabled, limit, appName });
        }
        if (enabled > limit) {
            return t('Enable_of_limit_apps_currently_enabled_exceeded', {
                enabled,
                limit,
                exceed: enabled - limit + 1,
                appName,
            });
        }
        return t('Workspaces_on_Community_edition_install_app', { context: '', enabled, limit });
    };
    const confirmButtonOverLimitLabel = t('Install_anyway');
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { "data-qa-id": 'confirm-app-upload-modal-title', children: getTitle() }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: getContent() }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleEnableUnlimitedApps, children: t('Enable_unlimited_apps') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({}, (enabled < limit && { primary: true }), { onClick: handleConfirm, children: enabled < limit ? t('Next') : confirmButtonOverLimitLabel }))] }) })] }) }));
};
exports.default = AppInstallationModal;
