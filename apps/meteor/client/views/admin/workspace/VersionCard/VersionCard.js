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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const VersionCardActionButton_1 = __importDefault(require("./components/VersionCardActionButton"));
const VersionCardActionItem_1 = __importDefault(require("./components/VersionCardActionItem"));
const VersionCardSkeleton_1 = require("./components/VersionCardSkeleton");
const VersionTag_1 = require("./components/VersionTag");
const getVersionStatus_1 = require("./getVersionStatus");
const RegisterWorkspaceModal_1 = __importDefault(require("./modals/RegisterWorkspaceModal"));
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const useLicense_1 = require("../../../../hooks/useLicense");
const useRegistrationStatus_1 = require("../../../../hooks/useRegistrationStatus");
const isOverLicenseLimits_1 = require("../../../../lib/utils/isOverLicenseLimits");
const SUPPORT_EXTERNAL_LINK = 'https://go.rocket.chat/i/version-support';
const RELEASES_EXTERNAL_LINK = 'https://go.rocket.chat/i/update-product';
const VersionCard = ({ serverInfo }) => {
    var _a, _b;
    const mediaQuery = (0, fuselage_hooks_1.useMediaQuery)('(min-width: 1024px)');
    const getUrl = (0, ui_contexts_1.useMediaUrl)();
    const cardBackground = {
        backgroundImage: `url(${getUrl('images/globe.png')})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 20px center',
        backgroundSize: mediaQuery ? 'auto' : 'contain',
    };
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { data: licenseData, isLoading, refetch: refetchLicense } = (0, useLicense_1.useLicense)({ loadValues: true });
    const { isRegistered } = (0, useRegistrationStatus_1.useRegistrationStatus)();
    const { license, limits } = licenseData || {};
    const isAirgapped = (_a = license === null || license === void 0 ? void 0 : license.information) === null || _a === void 0 ? void 0 : _a.offline;
    const licenseName = (0, useLicense_1.useLicenseName)();
    const serverVersion = serverInfo.version;
    const { versionStatus, versions } = (0, react_1.useMemo)(() => {
        var _a, _b;
        const supportedVersions = ((_a = serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.supportedVersions) === null || _a === void 0 ? void 0 : _a.signed) ? decodeBase64((_b = serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.supportedVersions) === null || _b === void 0 ? void 0 : _b.signed) : undefined;
        if (!supportedVersions) {
            return {};
        }
        const versionStatus = (0, getVersionStatus_1.getVersionStatus)(serverVersion, supportedVersions === null || supportedVersions === void 0 ? void 0 : supportedVersions.versions);
        return {
            versionStatus,
            versions: supportedVersions === null || supportedVersions === void 0 ? void 0 : supportedVersions.versions,
        };
    }, [(_b = serverInfo === null || serverInfo === void 0 ? void 0 : serverInfo.supportedVersions) === null || _b === void 0 ? void 0 : _b.signed, serverVersion]);
    const isOverLimits = limits && (0, isOverLicenseLimits_1.isOverLicenseLimits)(limits);
    const actionButton = (0, react_1.useMemo)(() => {
        if (!isRegistered) {
            return {
                action: () => {
                    const handleModalClose = () => {
                        setModal(null);
                        refetchLicense();
                    };
                    setModal((0, jsx_runtime_1.jsx)(RegisterWorkspaceModal_1.default, { onClose: handleModalClose, onStatusChange: refetchLicense }));
                },
                label: t('RegisterWorkspace_Button'),
            };
        }
        if ((versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.label) === 'outdated') {
            return {
                action: () => {
                    window.open(RELEASES_EXTERNAL_LINK, '_blank');
                },
                label: t('Update_version'),
            };
        }
        if (isOverLimits) {
            return { path: '/admin/subscription', label: t('Manage_subscription') };
        }
    }, [isRegistered, versionStatus, isOverLimits, t, setModal, refetchLicense]);
    const actionItems = (0, react_1.useMemo)(() => {
        return [
            isOverLimits
                ? {
                    danger: true,
                    icon: 'warning',
                    label: t('Plan_limits_reached'),
                }
                : {
                    icon: 'check',
                    label: t('Operating_withing_plan_limits'),
                },
            (isAirgapped || !versions) && {
                icon: 'warning',
                label: ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Check_support_availability', children: ["Check", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: SUPPORT_EXTERNAL_LINK, children: "support" }), "availability"] })),
            },
            (versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.label) !== 'outdated' &&
                (versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.expiration) && {
                icon: 'check',
                label: ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Version_supported_until', values: { date: formatDate(versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.expiration) }, children: ["Version", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: SUPPORT_EXTERNAL_LINK, children: "supported" }), "until ", formatDate(versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.expiration)] })),
            },
            (versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.label) === 'outdated' && {
                danger: true,
                icon: 'warning',
                label: ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Version_not_supported', children: ["Version", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: SUPPORT_EXTERNAL_LINK, children: "not supported" })] })),
            },
            isRegistered
                ? {
                    icon: 'check',
                    label: t('Workspace_registered'),
                }
                : {
                    danger: true,
                    icon: 'warning',
                    label: t('Workspace_not_registered'),
                },
        ].filter(Boolean).sort((a) => (a.danger ? -1 : 1));
    }, [isOverLimits, t, isAirgapped, versions, versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.label, versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.expiration, formatDate, isRegistered]);
    if (isLoading && !licenseData) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Card, { style: Object.assign({}, cardBackground), children: (0, jsx_runtime_1.jsx)(VersionCardSkeleton_1.VersionCardSkeleton, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { style: Object.assign({}, cardBackground), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardCol, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { variant: 'h3', children: t('Version_version', { version: serverVersion }) }), !isAirgapped && versions && (0, jsx_runtime_1.jsx)(VersionTag_1.VersionTag, { versionStatus: versionStatus === null || versionStatus === void 0 ? void 0 : versionStatus.label, title: versionStatus.version })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'secondary-info', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'rocketchat', size: 16 }), " ", licenseName.data] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { flexDirection: 'column', children: actionItems.length > 0 && actionItems.map((item, index) => (0, jsx_runtime_1.jsx)(VersionCardActionItem_1.default, Object.assign({}, item), index)) }), actionButton && ((0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)(VersionCardActionButton_1.default, Object.assign({}, actionButton)) }))] }));
};
exports.default = VersionCard;
const decodeBase64 = (b64) => {
    const [, bodyEncoded] = b64.split('.');
    if (!bodyEncoded) {
        return;
    }
    return JSON.parse(atob(bodyEncoded));
};
