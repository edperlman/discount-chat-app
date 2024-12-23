"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const dompurify_1 = __importDefault(require("dompurify"));
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppDetailsAPIs_1 = __importDefault(require("./AppDetailsAPIs"));
const normalizeUrl_1 = require("./normalizeUrl");
const useExternalLink_1 = require("../../../../../hooks/useExternalLink");
const useHasLicenseModule_1 = require("../../../../../hooks/useHasLicenseModule");
const links_1 = require("../../../../admin/subscription/utils/links");
const ScreenshotCarouselAnchor_1 = __importDefault(require("../../../components/ScreenshotCarouselAnchor"));
const purifyOptions_1 = require("../../../lib/purifyOptions");
const AppDetails = ({ app }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { author: { homepage, support } = {}, detailedDescription, description, categories = [], screenshots, apis, documentationUrl: documentation, addon, installedAddon, installed, } = app;
    const isMarkdown = detailedDescription && Object.keys(detailedDescription).length !== 0 && detailedDescription.rendered;
    const isCarouselVisible = screenshots && Boolean(screenshots.length);
    const normalizedHomepageUrl = homepage ? (0, normalizeUrl_1.normalizeUrl)(homepage) : undefined;
    const normalizedSupportUrl = support ? (0, normalizeUrl_1.normalizeUrl)(support) : undefined;
    const normalizedDocumentationUrl = documentation ? (0, normalizeUrl_1.normalizeUrl)(documentation) : undefined;
    const appAddon = installed ? installedAddon : addon;
    const workspaceHasAddon = (0, useHasLicenseModule_1.useHasLicenseModule)(appAddon);
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbs: '36px', maxWidth: 'x640', w: 'full', marginInline: 'auto', color: 'default', children: [appAddon && !workspaceHasAddon && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { mb: 16, title: t('Subscription_add-on_required'), type: 'info', actions: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: () => openExternalLink(links_1.GET_ADDONS_LINK), children: t('Contact_sales') }), children: t('App_cannot_be_enabled_without_add-on') })), app.licenseValidation && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [Object.entries(app.licenseValidation.warnings).map(([key]) => ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', mb: 16, children: t(`Apps_License_Message_${key}`) }, key))), Object.entries(app.licenseValidation.errors).map(([key]) => ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', mb: 16, children: t(`Apps_License_Message_${key}`) }, key)))] })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 16, children: [isCarouselVisible && (0, jsx_runtime_1.jsx)(ScreenshotCarouselAnchor_1.default, { screenshots: screenshots }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', mbe: 8, color: 'titles-labels', children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { dangerouslySetInnerHTML: {
                                        __html: isMarkdown
                                            ? dompurify_1.default.sanitize(detailedDescription.rendered, purifyOptions_1.purifyOptions)
                                            : dompurify_1.default.sanitize(description, purifyOptions_1.purifyOptions),
                                    }, withRichContent: true })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', mbe: 8, color: 'titles-labels', children: t('Categories') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'center', children: categories === null || categories === void 0 ? void 0 : categories.map((current) => ((0, jsx_runtime_1.jsx)(fuselage_1.Chip, { textTransform: 'uppercase', m: 4, children: current }, current))) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', mbe: 8, children: t('Contact') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around', flexWrap: 'wrap', mbe: 24, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', mie: 12, flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', color: 'hint', children: t('Author_Site') }), normalizedHomepageUrl ? (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: normalizedHomepageUrl, children: homepage }) : homepage] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', color: 'hint', children: t('Support') }), normalizedSupportUrl ? (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: normalizedSupportUrl, children: support }) : support] })] }), (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', color: 'hint', children: t('Documentation') }), normalizedDocumentationUrl ? (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: normalizedDocumentationUrl, children: documentation }) : documentation] })] }), (apis === null || apis === void 0 ? void 0 : apis.length) ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'section', children: (0, jsx_runtime_1.jsx)(AppDetailsAPIs_1.default, { apis: apis || [] }) })) : null] }) })] }));
};
exports.default = AppDetails;
