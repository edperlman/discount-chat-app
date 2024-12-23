"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMarketplaceActions = void 0;
const react_query_1 = require("@tanstack/react-query");
const useAppsOrchestration_1 = require("./useAppsOrchestration");
const handleAPIError_1 = require("../helpers/handleAPIError");
const warnAppInstall_1 = require("../helpers/warnAppInstall");
const warnStatusChange_1 = require("../helpers/warnStatusChange");
const useMarketplaceActions = () => {
    const appsOrchestrator = (0, useAppsOrchestration_1.useAppsOrchestration)();
    if (!appsOrchestrator) {
        throw new Error('Apps orchestrator is not available');
    }
    const installAppMutation = (0, react_query_1.useMutation)(({ id, marketplaceVersion, permissionsGranted }) => appsOrchestrator.installApp(id, marketplaceVersion, permissionsGranted), {
        onSuccess: ({ status }, { name }) => {
            if (!status)
                return;
            (0, warnAppInstall_1.warnAppInstall)(name, status);
        },
        onError: (error) => {
            (0, handleAPIError_1.handleAPIError)(error);
        },
    });
    const updateAppMutation = (0, react_query_1.useMutation)(({ id, marketplaceVersion, permissionsGranted }) => appsOrchestrator.updateApp(id, marketplaceVersion, permissionsGranted), {
        onSuccess: ({ status }, { name }) => {
            if (!status)
                return;
            (0, warnStatusChange_1.warnStatusChange)(name, status);
        },
        onError: (error) => {
            (0, handleAPIError_1.handleAPIError)(error);
        },
    });
    return {
        purchase: installAppMutation.mutateAsync,
        install: installAppMutation.mutateAsync,
        update: updateAppMutation.mutateAsync,
    };
};
exports.useMarketplaceActions = useMarketplaceActions;
