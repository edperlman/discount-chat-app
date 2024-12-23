"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const moment_1 = __importDefault(require("moment"));
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppMenu_1 = __importDefault(require("../AppMenu"));
const BundleChips_1 = __importDefault(require("../BundleChips"));
const helpers_1 = require("../helpers");
const AppStatus_1 = __importDefault(require("./tabs/AppStatus"));
const versioni18nKey = (app) => {
    const { version, marketplaceVersion, installed } = app;
    return installed ? version : marketplaceVersion;
};
const AppDetailsPageHeader = ({ app }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { iconFileData, name, author, iconFileContent, installed, modifiedAt, bundledIn, versionIncompatible, isSubscribed, shortDescription, } = app;
    const lastUpdated = modifiedAt && (0, moment_1.default)(modifiedAt).fromNow();
    const incompatibleStatus = versionIncompatible ? (0, helpers_1.appIncompatibleStatusProps)() : undefined;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'default', display: 'flex', flexDirection: 'row', mbe: 20, w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: 32, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.AppAvatar, { size: 'x124', iconFileContent: iconFileContent, iconFileData: iconFileData }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', mbe: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h1', mie: 8, children: name }), bundledIn && Boolean(bundledIn.length) && (0, jsx_runtime_1.jsx)(BundleChips_1.default, { bundledIn: bundledIn })] }), shortDescription && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', mbe: 16, children: shortDescription })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', mbe: 16, children: [(0, jsx_runtime_1.jsx)(AppStatus_1.default, { app: app, installed: installed, isAppDetailsPage: true }), (installed || isSubscribed) && (0, jsx_runtime_1.jsx)(AppMenu_1.default, { app: app, isAppDetailsPage: true })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'c1', display: 'flex', flexDirection: 'row', color: 'hint', alignItems: 'center', children: [author === null || author === void 0 ? void 0 : author.name, (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 16, color: 'disabled', children: "|" }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Version_version', { version: versioni18nKey(app) }) }), lastUpdated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 16, color: 'disabled', children: "|" }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Marketplace_app_last_updated', {
                                            lastUpdated,
                                        }) })] })), versionIncompatible && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 16, color: 'disabled', children: "|" }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { title: incompatibleStatus === null || incompatibleStatus === void 0 ? void 0 : incompatibleStatus.tooltipText, variant: (incompatibleStatus === null || incompatibleStatus === void 0 ? void 0 : incompatibleStatus.label) === 'Disabled' ? 'secondary-danger' : 'secondary', children: incompatibleStatus === null || incompatibleStatus === void 0 ? void 0 : incompatibleStatus.label }) })] }))] })] })] }));
};
exports.default = AppDetailsPageHeader;
