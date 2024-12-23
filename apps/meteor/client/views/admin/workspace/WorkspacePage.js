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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DeploymentCard_1 = __importDefault(require("./DeploymentCard/DeploymentCard"));
const MessagesRoomsCard_1 = __importDefault(require("./MessagesRoomsCard/MessagesRoomsCard"));
const UsersUploadsCard_1 = __importDefault(require("./UsersUploadsCard/UsersUploadsCard"));
const VersionCard_1 = __importDefault(require("./VersionCard/VersionCard"));
const Page_1 = require("../../../components/Page");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const WorkspacePage = ({ canViewStatistics, serverInfo, statistics, statisticsIsLoading, instances, onClickRefreshButton, onClickDownloadInfo, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const warningMultipleInstances = !(data === null || data === void 0 ? void 0 : data.isEnterprise) && !(statistics === null || statistics === void 0 ? void 0 : statistics.msEnabled) && (statistics === null || statistics === void 0 ? void 0 : statistics.instanceCount) > 1;
    const alertOplogForMultipleInstances = warningMultipleInstances && !statistics.oplogEnabled;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { bg: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Workspace'), children: canViewStatistics && ((0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickDownloadInfo, children: t('Download_Info') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickRefreshButton, loading: statisticsIsLoading, children: t('Refresh') })] })) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { p: 16, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { marginBlock: 'none', marginInline: 'auto', width: 'full', color: 'default', children: [warningMultipleInstances && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', title: t('Multiple_monolith_instances_alert'), marginBlockEnd: 16 })), alertOplogForMultipleInstances && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('Error_RocketChat_requires_oplog_tailing_when_running_in_multiple_instances'), marginBlockEnd: 16, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withRichContent: true, children: [(0, jsx_runtime_1.jsx)("p", { children: t('Error_RocketChat_requires_oplog_tailing_when_running_in_multiple_instances_details') }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("a", { rel: 'noopener noreferrer', target: '_blank', href: 'https://rocket.chat/docs/installation/manual-installation/multiple-instances-to-improve-' +
                                                'performance/#running-multiple-instances-per-host-to-improve-performance', children: t('Click_here_for_more_info') }) })] }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 16, children: (0, jsx_runtime_1.jsx)(VersionCard_1.default, { serverInfo: serverInfo }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardGrid, { breakpoints: { lg: 4, xs: 4, p: 8 }, children: [(0, jsx_runtime_1.jsx)(DeploymentCard_1.default, { serverInfo: serverInfo, statistics: statistics, instances: instances }), (0, jsx_runtime_1.jsx)(UsersUploadsCard_1.default, { statistics: statistics }), (0, jsx_runtime_1.jsx)(MessagesRoomsCard_1.default, { statistics: statistics })] })] }) })] }));
};
exports.default = (0, react_1.memo)(WorkspacePage);
