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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const RoomContext_1 = require("../contexts/RoomContext");
const RoomToolboxContext_1 = require("../contexts/RoomToolboxContext");
const getRoomGroup_1 = require("../lib/getRoomGroup");
const useAppsRoomActions_1 = require("./hooks/useAppsRoomActions");
const useCoreRoomActions_1 = require("./hooks/useCoreRoomActions");
const RoomToolboxProvider = ({ children }) => {
    const room = (0, RoomContext_1.useRoom)();
    const router = (0, ui_contexts_1.useRouter)();
    const openTab = (0, fuselage_hooks_1.useMutableCallback)((actionId, context) => {
        if (actionId === (tab === null || tab === void 0 ? void 0 : tab.id) && context === undefined) {
            return closeTab();
        }
        const routeName = router.getRouteName();
        if (!routeName) {
            throw new Error('Route name is not defined');
        }
        const { layout } = router.getSearchParameters();
        router.navigate({
            name: routeName,
            params: Object.assign(Object.assign({}, router.getRouteParameters()), { tab: actionId, context: context !== null && context !== void 0 ? context : '' }),
            search: layout ? { layout } : undefined,
        });
    });
    const closeTab = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const routeName = router.getRouteName();
        if (!routeName) {
            throw new Error('Route name is not defined');
        }
        router.navigate({
            name: routeName,
            params: Object.assign(Object.assign({}, router.getRouteParameters()), { tab: '', context: '' }),
            search: router.getSearchParameters(),
        });
    });
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const coreRoomActions = (0, useCoreRoomActions_1.useCoreRoomActions)();
    const appsRoomActions = (0, useAppsRoomActions_1.useAppsRoomActions)();
    const allowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead', false);
    const uid = (0, ui_contexts_1.useUserId)();
    const { roomToolbox: hiddenActions } = (0, ui_contexts_1.useLayoutHiddenActions)();
    const actions = (0, fuselage_hooks_1.useStableArray)([...coreRoomActions, ...appsRoomActions]
        .filter((action) => uid || (allowAnonymousRead && 'anonymous' in action && action.anonymous))
        .filter((action) => !action.groups || action.groups.includes((0, getRoomGroup_1.getRoomGroup)(room)))
        .filter((action) => !hiddenActions.includes(action.id))
        .sort((a, b) => { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); }));
    const tabActionId = (0, ui_contexts_1.useRouteParameter)('tab');
    const tab = (0, react_1.useMemo)(() => {
        if (!tabActionId) {
            return undefined;
        }
        return actions.find((action) => action.id === tabActionId);
    }, [actions, tabActionId]);
    const contextValue = (0, react_1.useMemo)(() => ({
        actions,
        tab,
        context,
        openTab,
        closeTab,
    }), [actions, tab, context, openTab, closeTab]);
    return (0, jsx_runtime_1.jsx)(RoomToolboxContext_1.RoomToolboxContext.Provider, { value: contextValue, children: children });
};
exports.default = RoomToolboxProvider;
