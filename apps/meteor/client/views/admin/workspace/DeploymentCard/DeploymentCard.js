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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const WorkspaceCardSection_1 = __importDefault(require("../components/WorkspaceCardSection"));
const InstancesModal_1 = __importDefault(require("./components/InstancesModal"));
const DeploymentCard = ({ serverInfo: { info, cloudWorkspaceId }, statistics, instances }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { commit = {}, marketplaceApiVersion: appsEngineVersion } = info || {};
    const handleInstancesModal = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setModal((0, jsx_runtime_1.jsx)(InstancesModal_1.default, { instances: instances, onClose: () => setModal() }));
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { "data-qa-id": 'deployment-card', height: 'full', children: [(0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Deployment') }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Version'), body: statistics.version }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Deployment_ID'), body: statistics.uniqueId }), cloudWorkspaceId && (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Cloud_Workspace_Id'), body: cloudWorkspaceId }), appsEngineVersion && (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Apps_Engine_Version'), body: appsEngineVersion }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Node_version'), body: statistics.process.nodeVersion }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('DB_Migration'), body: `${statistics.migration.version} (${formatDateAndTime(statistics.migration.lockedAt)})` }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('MongoDB'), body: `${statistics.mongoVersion} / ${statistics.mongoStorageEngine} ${!statistics.msEnabled ? `(oplog ${statistics.oplogEnabled ? t('Enabled') : t('Disabled')})` : ''}` }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('Commit_details'), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t('github_HEAD'), ": (", commit.hash ? commit.hash.slice(0, 9) : '', ") ", (0, jsx_runtime_1.jsx)("br", {}), t('Branch'), ": ", commit.branch, " ", (0, jsx_runtime_1.jsx)("br", {}), commit.subject] }) }), (0, jsx_runtime_1.jsx)(WorkspaceCardSection_1.default, { title: t('PID'), body: statistics.process.pid }), !!instances.length && ((0, jsx_runtime_1.jsx)(fuselage_1.CardControls, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { medium: true, onClick: handleInstancesModal, children: t('Instances') }) }))] }));
};
exports.default = (0, react_1.memo)(DeploymentCard);
