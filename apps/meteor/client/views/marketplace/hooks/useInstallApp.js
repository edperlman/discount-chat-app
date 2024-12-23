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
exports.useInstallApp = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const orchestrator_1 = require("../../../apps/orchestrator");
const useAppsReload_1 = require("../../../contexts/hooks/useAppsReload");
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const AppExemptModal_1 = __importDefault(require("../AppExemptModal"));
const AppPermissionsReviewModal_1 = __importDefault(require("../AppPermissionsReviewModal"));
const AppUpdateModal_1 = __importDefault(require("../AppUpdateModal"));
const useAppsCountQuery_1 = require("./useAppsCountQuery");
const handleAPIError_1 = require("../helpers/handleAPIError");
const handleInstallError_1 = require("../helpers/handleInstallError");
const getManifestFromZippedApp_1 = require("../lib/getManifestFromZippedApp");
const useInstallApp = (file) => {
    const reloadAppsList = (0, useAppsReload_1.useAppsReload)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const appCountQuery = (0, useAppsCountQuery_1.useAppsCountQuery)('private');
    const uploadAppEndpoint = (0, ui_contexts_1.useUpload)('/apps');
    const uploadUpdateEndpoint = (0, ui_contexts_1.useUpload)('/apps/update');
    const { data } = (0, useIsEnterprise_1.useIsEnterprise)();
    const [isInstalling, setInstalling] = (0, react_1.useState)(false);
    const { mutate: sendFile } = (0, react_query_1.useMutation)(['apps/installPrivateApp'], ({ permissionsGranted, appFile, appId }) => {
        const fileData = new FormData();
        fileData.append('app', appFile, appFile.name);
        fileData.append('permissions', JSON.stringify(permissionsGranted));
        if (appId) {
            return uploadUpdateEndpoint(fileData);
        }
        return uploadAppEndpoint(fileData);
    }, {
        onSuccess: (data) => {
            router.navigate({
                name: 'marketplace',
                params: {
                    context: 'private',
                    page: 'info',
                    id: data.app.id,
                },
            });
        },
        onError: (e) => {
            (0, handleAPIError_1.handleAPIError)(e);
        },
        onSettled: () => {
            setInstalling(false);
            setModal(null);
            reloadAppsList();
        },
    });
    const cancelAction = (0, react_1.useCallback)(() => {
        setInstalling(false);
        setModal(null);
    }, [setInstalling, setModal]);
    const isAppInstalled = (appId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const app = yield orchestrator_1.AppClientOrchestratorInstance.getApp(appId);
            return !!app || false;
        }
        catch (e) {
            return false;
        }
    });
    const handleAppPermissionsReview = (permissions, appFile, appId) => __awaiter(void 0, void 0, void 0, function* () {
        setModal((0, jsx_runtime_1.jsx)(AppPermissionsReviewModal_1.default, { appPermissions: permissions, onCancel: cancelAction, onConfirm: (permissionsGranted) => sendFile({ permissionsGranted, appFile, appId }) }));
    });
    const uploadFile = (appFile_1, _a) => __awaiter(void 0, [appFile_1, _a], void 0, function* (appFile, { id, permissions }) {
        const isInstalled = yield isAppInstalled(id);
        const isExempt = !(data === null || data === void 0 ? void 0 : data.isEnterprise) && isInstalled;
        if (isInstalled && isExempt) {
            return setModal((0, jsx_runtime_1.jsx)(AppExemptModal_1.default, { appName: appFile.name, onCancel: cancelAction }));
        }
        if (isInstalled) {
            return setModal((0, jsx_runtime_1.jsx)(AppUpdateModal_1.default, { cancel: cancelAction, confirm: () => handleAppPermissionsReview(permissions, appFile, id) }));
        }
        yield handleAppPermissionsReview(permissions, appFile);
    });
    const extractManifestFromAppFile = (appFile) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return (0, getManifestFromZippedApp_1.getManifestFromZippedApp)(appFile);
        }
        catch (error) {
            (0, handleInstallError_1.handleInstallError)(error);
        }
    });
    const install = () => __awaiter(void 0, void 0, void 0, function* () {
        setInstalling(true);
        if (!appCountQuery.data) {
            return cancelAction();
        }
        const appFile = file;
        if (!appFile) {
            return cancelAction();
        }
        const manifest = yield extractManifestFromAppFile(appFile);
        if (!manifest) {
            return cancelAction();
        }
        return uploadFile(appFile, manifest);
    });
    return { install, isInstalling };
};
exports.useInstallApp = useInstallApp;
