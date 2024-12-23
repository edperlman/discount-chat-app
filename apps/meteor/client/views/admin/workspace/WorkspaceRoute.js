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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const WorkspacePage_1 = __importDefault(require("./WorkspacePage"));
const Page_1 = require("../../../components/Page");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useWorkspaceInfo_1 = require("../../../hooks/useWorkspaceInfo");
const download_1 = require("../../../lib/download");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const WorkspaceRoute = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const canViewStatistics = (0, ui_contexts_1.usePermission)('view-statistics');
    const [refreshStatistics, setRefreshStatistics] = (0, react_1.useState)(false);
    const [serverInfoQuery, instancesQuery, statisticsQuery] = (0, useWorkspaceInfo_1.useWorkspaceInfo)({ refreshStatistics });
    if (!canViewStatistics) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (serverInfoQuery.isLoading || instancesQuery.isLoading || statisticsQuery.isLoading) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    const handleClickRefreshButton = () => __awaiter(void 0, void 0, void 0, function* () {
        setRefreshStatistics(true);
        statisticsQuery.refetch();
    });
    const handleClickDownloadInfo = () => {
        (0, download_1.downloadJsonAs)(statisticsQuery.data, 'statistics');
    };
    if (serverInfoQuery.isError || instancesQuery.isError || statisticsQuery.isError) {
        return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Workspace'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'reload', primary: true, type: 'button', onClick: handleClickRefreshButton, loading: statisticsQuery.isLoading, children: t('Refresh') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('Error_loading_pages') }) })] }));
    }
    return ((0, jsx_runtime_1.jsx)(WorkspacePage_1.default, { canViewStatistics: canViewStatistics, serverInfo: serverInfoQuery.data, statistics: statisticsQuery.data, statisticsIsLoading: statisticsQuery.isLoading, instances: instancesQuery.data, onClickRefreshButton: handleClickRefreshButton, onClickDownloadInfo: handleClickDownloadInfo }));
};
exports.default = (0, react_1.memo)(WorkspaceRoute);
