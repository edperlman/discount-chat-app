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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_aria_1 = require("react-aria");
const react_stately_1 = require("react-stately");
const RoomContext_1 = require("../contexts/RoomContext");
const RoomToolboxContext_1 = require("../contexts/RoomToolboxContext");
const UserCardContext_1 = require("../contexts/UserCardContext");
const UserCard = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../UserCard'))));
const UserCardProvider = ({ children }) => {
    const room = (0, RoomContext_1.useRoom)();
    const [userCardData, setUserCardData] = (0, react_1.useState)(null);
    const triggerRef = (0, react_1.useRef)(null);
    const state = (0, react_stately_1.useOverlayTriggerState)({});
    const { triggerProps, overlayProps } = (0, react_aria_1.useOverlayTrigger)({ type: 'dialog' }, state, triggerRef);
    delete triggerProps.onPress;
    const { openTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const openUserInfo = (0, fuselage_hooks_1.useEffectEvent)((username) => {
        var _a, _b;
        switch (room.t) {
            case 'l':
                openTab('room-info', username);
                break;
            case 'v':
                openTab('voip-room-info', username);
                break;
            case 'd':
                ((_b = (_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 2 ? openTab('user-info-group', username) : openTab('user-info', username);
                break;
            default:
                openTab('members-list', username);
                break;
        }
    });
    const handleSetUserCard = (0, react_1.useCallback)((e, username) => {
        triggerRef.current = e.target;
        state.open();
        setUserCardData({
            username,
            rid: room._id,
            onOpenUserInfo: () => openUserInfo(username),
            onClose: () => setUserCardData(null),
        });
    }, [openUserInfo, room._id, state]);
    const contextValue = (0, react_1.useMemo)(() => ({
        openUserCard: handleSetUserCard,
        closeUserCard: () => setUserCardData(null),
        triggerProps,
        triggerRef,
        state,
    }), [handleSetUserCard, state, triggerProps]);
    return ((0, jsx_runtime_1.jsxs)(UserCardContext_1.UserCardContext.Provider, { value: contextValue, children: [children, state.isOpen && userCardData && ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: (0, jsx_runtime_1.jsx)(fuselage_1.Popover, { placement: 'top left', triggerRef: triggerRef, state: state, children: (0, jsx_runtime_1.jsx)(UserCard, Object.assign({}, userCardData, overlayProps)) }) }))] }));
};
exports.default = UserCardProvider;
