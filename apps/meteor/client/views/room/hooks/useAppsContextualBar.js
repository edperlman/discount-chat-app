"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppsContextualBar = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const shim_1 = require("use-sync-external-store/shim");
const useUiKitActionManager_1 = require("../../../uikit/hooks/useUiKitActionManager");
const useAppsContextualBar = () => {
    const viewId = (0, ui_contexts_1.useRouteParameter)('context');
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const getSnapshot = (0, react_1.useCallback)(() => {
        var _a;
        if (!viewId) {
            return undefined;
        }
        return (_a = actionManager.getInteractionPayloadByViewId(viewId)) === null || _a === void 0 ? void 0 : _a.view;
    }, [actionManager, viewId]);
    const subscribe = (0, react_1.useCallback)((handler) => {
        if (!viewId) {
            return () => undefined;
        }
        actionManager.on(viewId, handler);
        return () => actionManager.off(viewId, handler);
    }, [actionManager, viewId]);
    const view = (0, shim_1.useSyncExternalStore)(subscribe, getSnapshot);
    return view;
};
exports.useAppsContextualBar = useAppsContextualBar;
