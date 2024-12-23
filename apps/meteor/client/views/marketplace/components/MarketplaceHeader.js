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
const GenericResourceUsage_1 = require("../../../components/GenericResourceUsage");
const Page_1 = require("../../../components/Page");
const UpgradeButton_1 = __importDefault(require("../../admin/subscription/components/UpgradeButton"));
const UnlimitedAppsUpsellModal_1 = __importDefault(require("../UnlimitedAppsUpsellModal"));
const EnabledAppsCount_1 = __importDefault(require("./EnabledAppsCount"));
const useAppsCountQuery_1 = require("../hooks/useAppsCountQuery");
const usePrivateAppsEnabled_1 = require("../hooks/usePrivateAppsEnabled");
const PrivateAppInstallModal_1 = __importDefault(require("./PrivateAppInstallModal/PrivateAppInstallModal"));
const UpdateRocketChatButton_1 = __importDefault(require("./UpdateRocketChatButton"));
const MarketplaceHeader = ({ title, unsupportedVersion }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdmin = (0, ui_contexts_1.usePermission)('manage-apps');
    const context = ((0, ui_contexts_1.useRouteParameter)('context') || 'explore');
    const route = (0, ui_contexts_1.useRoute)('marketplace');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const result = (0, useAppsCountQuery_1.useAppsCountQuery)(context);
    const privateAppsEnabled = (0, usePrivateAppsEnabled_1.usePrivateAppsEnabled)();
    const handleProceed = () => {
        setModal(null);
        route.push({ context, page: 'install' });
    };
    const handleClickPrivate = () => {
        if (!privateAppsEnabled) {
            setModal((0, jsx_runtime_1.jsx)(PrivateAppInstallModal_1.default, { onClose: () => setModal(null), onProceed: handleProceed }));
            return;
        }
        route.push({ context, page: 'install' });
    };
    if (result.isError) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.PageHeader, { title: title, children: [result.isLoading && (0, jsx_runtime_1.jsx)(GenericResourceUsage_1.GenericResourceUsageSkeleton, { mi: 16 }), !unsupportedVersion && result.isSuccess && !result.data.hasUnlimitedApps && ((0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 16, children: (0, jsx_runtime_1.jsx)(EnabledAppsCount_1.default, Object.assign({}, result.data, { tooltip: context === 'private' && !privateAppsEnabled ? t('Private_apps_premium_message') : undefined, context: context })) })), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { wrap: true, align: 'end', children: [!unsupportedVersion && isAdmin && result.isSuccess && !result.data.hasUnlimitedApps && context !== 'private' && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => {
                            setModal((0, jsx_runtime_1.jsx)(UnlimitedAppsUpsellModal_1.default, { onClose: () => setModal(null) }));
                        }, children: t('Enable_unlimited_apps') })), isAdmin && context === 'private' && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleClickPrivate, children: t('Upload_private_app') }), isAdmin && result.isSuccess && !privateAppsEnabled && context === 'private' && ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { primary: true, target: 'private-apps-header', action: 'upgrade', children: t('Upgrade') })), unsupportedVersion && isAdmin && context !== 'private' && (0, jsx_runtime_1.jsx)(UpdateRocketChatButton_1.default, {})] })] }));
};
exports.default = MarketplaceHeader;
