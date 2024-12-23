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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const client_1 = require("../../app/ui-utils/client");
const IRoomTypeConfig_1 = require("../../definition/IRoomTypeConfig");
const WarningModal_1 = __importDefault(require("../components/WarningModal"));
const useHideRoomAction_1 = require("../hooks/useHideRoomAction");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const useOmnichannelPrioritiesMenu_1 = require("../omnichannel/hooks/useOmnichannelPrioritiesMenu");
const fields = {
    f: true,
    t: true,
    name: true,
};
const leaveEndpoints = {
    p: '/v1/groups.leave',
    c: '/v1/channels.leave',
    d: '/v1/im.leave',
    v: '/v1/channels.leave',
    l: '/v1/groups.leave',
};
const RoomMenu = ({ rid, unread, threadUnread, alert, roomOpen, type, cl, name = '', hideDefaultOptions = false, }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = (0, fuselage_hooks_1.useMutableCallback)(() => setModal());
    const router = (0, ui_contexts_1.useRouter)();
    const subscription = (0, ui_contexts_1.useUserSubscription)(rid, fields);
    const canFavorite = (0, ui_contexts_1.useSetting)('Favorite_Rooms');
    const isFavorite = Boolean(subscription === null || subscription === void 0 ? void 0 : subscription.f);
    const readMessages = (0, ui_contexts_1.useEndpoint)('POST', '/v1/subscriptions.read');
    const toggleFavorite = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.favorite');
    const leaveRoom = (0, ui_contexts_1.useEndpoint)('POST', leaveEndpoints[type]);
    const unreadMessages = (0, ui_contexts_1.useMethod)('unreadMessages');
    const isUnread = alert || unread || threadUnread;
    const canLeaveChannel = (0, ui_contexts_1.usePermission)('leave-c');
    const canLeavePrivate = (0, ui_contexts_1.usePermission)('leave-p');
    const isOmnichannelRoom = type === 'l';
    const prioritiesMenu = (0, useOmnichannelPrioritiesMenu_1.useOmnichannelPrioritiesMenu)(rid);
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleHide = (0, useHideRoomAction_1.useHideRoomAction)({ rid, type, name }, { redirect: false });
    const canLeave = (() => {
        if (type === 'c' && !canLeaveChannel) {
            return false;
        }
        if (type === 'p' && !canLeavePrivate) {
            return false;
        }
        return !((cl != null && !cl) || ['d', 'l'].includes(type));
    })();
    const handleLeave = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const leave = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield leaveRoom({ roomId: rid });
                if (roomOpen) {
                    router.navigate('/home');
                }
                client_1.LegacyRoomManager.close(rid);
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            closeModal();
        });
        const warnText = roomCoordinator_1.roomCoordinator.getRoomDirectives(type).getUiText(IRoomTypeConfig_1.UiTextContext.LEAVE_WARNING);
        setModal((0, jsx_runtime_1.jsx)(WarningModal_1.default, { text: t(warnText, name), confirmText: t('Leave_room'), close: closeModal, cancelText: t('Cancel'), confirm: leave }));
    });
    const handleToggleRead = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            queryClient.invalidateQueries(['sidebar/search/spotlight']);
            if (isUnread) {
                yield readMessages({ rid, readThreads: true });
                return;
            }
            if (subscription == null) {
                return;
            }
            client_1.LegacyRoomManager.close(subscription.t + subscription.name);
            router.navigate('/home');
            yield unreadMessages(undefined, rid);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const handleToggleFavorite = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield toggleFavorite({ roomId: rid, favorite: !isFavorite });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const menuOptions = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, (!hideDefaultOptions && Object.assign(Object.assign(Object.assign(Object.assign({}, (isOmnichannelRoom
        ? {}
        : {
            hideRoom: {
                label: { label: t('Hide'), icon: 'eye-off' },
                action: handleHide,
            },
        })), { toggleRead: {
            label: { label: isUnread ? t('Mark_read') : t('Mark_unread'), icon: 'flag' },
            action: handleToggleRead,
        } }), (canFavorite
        ? {
            toggleFavorite: {
                label: {
                    label: isFavorite ? t('Unfavorite') : t('Favorite'),
                    icon: isFavorite ? 'star-filled' : 'star',
                },
                action: handleToggleFavorite,
            },
        }
        : {})), (canLeave && {
        leaveRoom: {
            label: { label: t('Leave_room'), icon: 'sign-out' },
            action: handleLeave,
        },
    })))), (isOmnichannelRoom && prioritiesMenu))), [
        hideDefaultOptions,
        t,
        handleHide,
        isUnread,
        handleToggleRead,
        canFavorite,
        isFavorite,
        handleToggleFavorite,
        canLeave,
        handleLeave,
        isOmnichannelRoom,
        prioritiesMenu,
    ]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Menu, { "rcx-sidebar-item__menu": true, title: t('Options'), mini: true, "aria-keyshortcuts": 'alt', options: menuOptions, maxHeight: 300, renderItem: (_a) => {
            var { label: { label, icon } } = _a, props = __rest(_a, ["label"]);
            return (0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ label: label, icon: icon }, props));
        } }));
};
exports.default = (0, react_1.memo)(RoomMenu);
