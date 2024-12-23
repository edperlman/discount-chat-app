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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const Federation = __importStar(require("../../../../lib/federation/Federation"));
const useMembersList_1 = require("../../../hooks/useMembersList");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const UserInfo_1 = __importDefault(require("../UserInfo"));
const AddUsers_1 = __importDefault(require("./AddUsers"));
const InviteUsers_1 = __importDefault(require("./InviteUsers"));
const RoomMembers_1 = __importDefault(require("./RoomMembers"));
var ROOM_MEMBERS_TABS;
(function (ROOM_MEMBERS_TABS) {
    ROOM_MEMBERS_TABS["INFO"] = "user-info";
    ROOM_MEMBERS_TABS["INVITE"] = "invite-users";
    ROOM_MEMBERS_TABS["ADD"] = "add-users";
    ROOM_MEMBERS_TABS["LIST"] = "users-list";
})(ROOM_MEMBERS_TABS || (ROOM_MEMBERS_TABS = {}));
const RoomMembersWithData = ({ rid }) => {
    var _a, _b, _c;
    const user = (0, ui_contexts_1.useUser)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const [type, setType] = (0, fuselage_hooks_1.useLocalStorage)('members-list-type', 'online');
    const [text, setText] = (0, react_1.useState)('');
    const subscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const isTeam = room && (0, core_typings_1.isTeamRoom)(room);
    const isDirect = room && (0, core_typings_1.isDirectMessageRoom)(room);
    const hasPermissionToCreateInviteLinks = (0, ui_contexts_1.usePermission)('create-invite-links', rid);
    const isFederated = room && (0, core_typings_1.isRoomFederated)(room);
    const canCreateInviteLinks = room && user && isFederated ? Federation.canCreateInviteLinks(user, room, subscription) : hasPermissionToCreateInviteLinks;
    const [state, setState] = (0, react_1.useState)({
        tab: ROOM_MEMBERS_TABS.LIST,
        userId: undefined,
    });
    const debouncedText = (0, fuselage_hooks_1.useDebouncedValue)(text, 800);
    const { data, fetchNextPage, isLoading, refetch, hasNextPage } = (0, useMembersList_1.useMembersList)((0, react_1.useMemo)(() => ({ rid, type, limit: 50, debouncedText, roomType: room === null || room === void 0 ? void 0 : room.t }), [rid, type, debouncedText, room === null || room === void 0 ? void 0 : room.t]));
    const hasPermissionToAddUsers = (0, ui_contexts_1.useAtLeastOnePermission)((0, react_1.useMemo)(() => [(room === null || room === void 0 ? void 0 : room.t) === 'p' ? 'add-user-to-any-p-room' : 'add-user-to-any-c-room', 'add-user-to-joined-room'], [room === null || room === void 0 ? void 0 : room.t]), rid);
    const canAddUsers = room && user && isFederated ? Federation.isEditableByTheUser(user, room, subscription) : hasPermissionToAddUsers;
    const handleTextChange = (0, react_1.useCallback)((event) => {
        setText(event.currentTarget.value);
    }, []);
    const openUserInfo = (0, fuselage_hooks_1.useMutableCallback)((e) => {
        const { userid } = e.currentTarget.dataset;
        setState({
            tab: ROOM_MEMBERS_TABS.INFO,
            userId: userid,
        });
    });
    const openInvite = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setState({ tab: ROOM_MEMBERS_TABS.INVITE });
    });
    const openAddUser = (0, fuselage_hooks_1.useMutableCallback)(() => {
        setState({ tab: ROOM_MEMBERS_TABS.ADD });
    });
    const handleBack = (0, react_1.useCallback)(() => {
        setState({ tab: ROOM_MEMBERS_TABS.LIST });
    }, [setState]);
    if (state.tab === ROOM_MEMBERS_TABS.INFO && state.userId) {
        return (0, jsx_runtime_1.jsx)(UserInfo_1.default, { rid: rid, uid: state.userId, onClose: closeTab, onClickBack: handleBack });
    }
    if (state.tab === ROOM_MEMBERS_TABS.INVITE) {
        return (0, jsx_runtime_1.jsx)(InviteUsers_1.default, { rid: rid, onClickBack: handleBack });
    }
    if (state.tab === ROOM_MEMBERS_TABS.ADD) {
        return (0, jsx_runtime_1.jsx)(AddUsers_1.default, { rid: rid, onClickBack: handleBack, reload: refetch });
    }
    return ((0, jsx_runtime_1.jsx)(RoomMembers_1.default, { rid: rid, isTeam: isTeam, isDirect: isDirect, loading: isLoading, type: type, text: text, setText: handleTextChange, setType: setType, members: (_b = (_a = data === null || data === void 0 ? void 0 : data.pages) === null || _a === void 0 ? void 0 : _a.flatMap((page) => page.members)) !== null && _b !== void 0 ? _b : [], total: (_c = data === null || data === void 0 ? void 0 : data.pages[data.pages.length - 1].total) !== null && _c !== void 0 ? _c : 0, onClickClose: closeTab, onClickView: openUserInfo, loadMoreItems: hasNextPage ? fetchNextPage : () => undefined, reload: refetch, onClickInvite: canCreateInviteLinks && canAddUsers ? openInvite : undefined, onClickAdd: canAddUsers ? openAddUser : undefined }));
};
exports.default = RoomMembersWithData;
