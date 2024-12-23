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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const ComposerPopupProvider_1 = __importDefault(require("./ComposerPopupProvider"));
const RoomToolboxProvider_1 = __importDefault(require("./RoomToolboxProvider"));
const UserCardProvider_1 = __importDefault(require("./UserCardProvider"));
const useRedirectOnSettingsChanged_1 = require("./hooks/useRedirectOnSettingsChanged");
const useRoomQuery_1 = require("./hooks/useRoomQuery");
const useUsersNameChanged_1 = require("./hooks/useUsersNameChanged");
const client_1 = require("../../../../app/models/client");
const UserAction_1 = require("../../../../app/ui/client/lib/UserAction");
const client_2 = require("../../../../app/ui-utils/client");
const useReactiveQuery_1 = require("../../../hooks/useReactiveQuery");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const useRoomInfoEndpoint_1 = require("../../../hooks/useRoomInfoEndpoint");
const useSidePanelNavigation_1 = require("../../../hooks/useSidePanelNavigation");
const RoomManager_1 = require("../../../lib/RoomManager");
const queryKeys_1 = require("../../../lib/queryKeys");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const ImageGalleryProvider_1 = __importDefault(require("../../../providers/ImageGalleryProvider"));
const RoomNotFound_1 = __importDefault(require("../RoomNotFound"));
const RoomSkeleton_1 = __importDefault(require("../RoomSkeleton"));
const useRoomRolesManagement_1 = require("../body/hooks/useRoomRolesManagement");
const RoomContext_1 = require("../contexts/RoomContext");
const RoomProvider = ({ rid, children }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    (0, useRoomRolesManagement_1.useRoomRolesManagement)(rid);
    const resultFromServer = (0, useRoomInfoEndpoint_1.useRoomInfoEndpoint)(rid);
    const resultFromLocal = (0, useRoomQuery_1.useRoomQuery)(rid);
    // TODO: the following effect is a workaround while we don't have a general and definitive solution for it
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (resultFromLocal.isSuccess && !resultFromLocal.data) {
            router.navigate('/home');
        }
    }, [resultFromLocal.data, resultFromLocal.isSuccess, resultFromServer, router]);
    const subscriptionQuery = (0, useReactiveQuery_1.useReactiveQuery)(queryKeys_1.subscriptionsQueryKeys.subscription(rid), () => { var _a; return (_a = client_1.Subscriptions.findOne({ rid })) !== null && _a !== void 0 ? _a : null; });
    (0, useRedirectOnSettingsChanged_1.useRedirectOnSettingsChanged)(subscriptionQuery.data);
    (0, useUsersNameChanged_1.useUsersNameChanged)();
    const pseudoRoom = (0, react_1.useMemo)(() => {
        const room = resultFromLocal.data;
        if (!room) {
            return null;
        }
        return Object.assign(Object.assign(Object.assign({}, subscriptionQuery.data), room), { name: roomCoordinator_1.roomCoordinator.getRoomName(room.t, room), federationOriginalName: room.name });
    }, [resultFromLocal.data, subscriptionQuery.data]);
    const { hasMorePreviousMessages, hasMoreNextMessages, isLoadingMoreMessages } = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        const { hasMore, hasMoreNext, isLoading } = client_2.RoomHistoryManager.getRoom(rid);
        return {
            hasMorePreviousMessages: hasMore.get(),
            hasMoreNextMessages: hasMoreNext.get(),
            isLoadingMoreMessages: isLoading.get(),
        };
    }, [rid]));
    const context = (0, react_1.useMemo)(() => {
        var _a;
        if (!pseudoRoom) {
            return null;
        }
        return {
            rid,
            room: pseudoRoom,
            subscription: (_a = subscriptionQuery.data) !== null && _a !== void 0 ? _a : undefined,
            hasMorePreviousMessages,
            hasMoreNextMessages,
            isLoadingMoreMessages,
        };
    }, [hasMoreNextMessages, hasMorePreviousMessages, isLoadingMoreMessages, pseudoRoom, rid, subscriptionQuery.data]);
    const isSidepanelFeatureEnabled = (0, useSidePanelNavigation_1.useSidePanelNavigation)();
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (isSidepanelFeatureEnabled) {
            if (resultFromServer.isSuccess) {
                if ((_a = resultFromServer.data.room) === null || _a === void 0 ? void 0 : _a.teamMain) {
                    if (((_b = resultFromServer.data.room.sidepanel) === null || _b === void 0 ? void 0 : _b.items.includes('channels')) ||
                        ((_d = (_c = resultFromServer.data.room) === null || _c === void 0 ? void 0 : _c.sidepanel) === null || _d === void 0 ? void 0 : _d.items.includes('discussions'))) {
                        RoomManager_1.RoomManager.openSecondLevel(rid, rid);
                    }
                    else {
                        RoomManager_1.RoomManager.open(rid);
                    }
                    return () => {
                        RoomManager_1.RoomManager.back(rid);
                    };
                }
                switch (true) {
                    case ((_e = resultFromServer.data.room) === null || _e === void 0 ? void 0 : _e.prid) &&
                        resultFromServer.data.parent &&
                        ((_f = resultFromServer.data.parent.sidepanel) === null || _f === void 0 ? void 0 : _f.items.includes('discussions')):
                        RoomManager_1.RoomManager.openSecondLevel(resultFromServer.data.parent._id, rid);
                        break;
                    case ((_g = resultFromServer.data.team) === null || _g === void 0 ? void 0 : _g.roomId) &&
                        !((_h = resultFromServer.data.room) === null || _h === void 0 ? void 0 : _h.teamMain) &&
                        ((_k = (_j = resultFromServer.data.parent) === null || _j === void 0 ? void 0 : _j.sidepanel) === null || _k === void 0 ? void 0 : _k.items.includes('channels')):
                        RoomManager_1.RoomManager.openSecondLevel(resultFromServer.data.team.roomId, rid);
                        break;
                    default:
                        if (((_m = (_l = resultFromServer.data.parent) === null || _l === void 0 ? void 0 : _l.sidepanel) === null || _m === void 0 ? void 0 : _m.items.includes('channels')) ||
                            ((_p = (_o = resultFromServer.data.parent) === null || _o === void 0 ? void 0 : _o.sidepanel) === null || _p === void 0 ? void 0 : _p.items.includes('discussions'))) {
                            RoomManager_1.RoomManager.openSecondLevel(rid, rid);
                        }
                        else {
                            RoomManager_1.RoomManager.open(rid);
                        }
                        break;
                }
            }
            return () => {
                RoomManager_1.RoomManager.back(rid);
            };
        }
        RoomManager_1.RoomManager.open(rid);
        return () => {
            RoomManager_1.RoomManager.back(rid);
        };
    }, [
        isSidepanelFeatureEnabled,
        rid,
        (_b = (_a = resultFromServer.data) === null || _a === void 0 ? void 0 : _a.room) === null || _b === void 0 ? void 0 : _b.prid,
        (_d = (_c = resultFromServer.data) === null || _c === void 0 ? void 0 : _c.room) === null || _d === void 0 ? void 0 : _d.teamId,
        (_f = (_e = resultFromServer.data) === null || _e === void 0 ? void 0 : _e.room) === null || _f === void 0 ? void 0 : _f.teamMain,
        resultFromServer.isSuccess,
        (_g = resultFromServer.data) === null || _g === void 0 ? void 0 : _g.parent,
        (_j = (_h = resultFromServer.data) === null || _h === void 0 ? void 0 : _h.team) === null || _j === void 0 ? void 0 : _j.roomId,
        resultFromServer.data,
    ]);
    const subscribed = !!subscriptionQuery.data;
    (0, react_1.useEffect)(() => {
        if (!subscribed) {
            return;
        }
        return UserAction_1.UserAction.addStream(rid);
    }, [rid, subscribed]);
    if (!pseudoRoom) {
        return resultFromLocal.isSuccess && !resultFromLocal.data ? (0, jsx_runtime_1.jsx)(RoomNotFound_1.default, {}) : (0, jsx_runtime_1.jsx)(RoomSkeleton_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)(RoomContext_1.RoomContext.Provider, { value: context, children: (0, jsx_runtime_1.jsx)(RoomToolboxProvider_1.default, { children: (0, jsx_runtime_1.jsx)(ImageGalleryProvider_1.default, { children: (0, jsx_runtime_1.jsx)(UserCardProvider_1.default, { children: (0, jsx_runtime_1.jsx)(ComposerPopupProvider_1.default, { room: pseudoRoom, children: children }) }) }) }) }));
};
exports.default = (0, react_1.memo)(RoomProvider);
