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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAddUserAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const Federation = __importStar(require("../../../../../lib/federation/Federation"));
const useAddMatrixUsers_1 = require("../../../contextualBar/RoomMembers/AddUsers/AddMatrixUsers/useAddMatrixUsers");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const inviteUserEndpoints = {
    c: '/v1/channels.invite',
    p: '/v1/groups.invite',
};
const useAddUserAction = (user, rid, reload) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const currentUser = (0, ui_contexts_1.useUser)();
    const subscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { username, _id: uid } = user;
    if (!room) {
        throw Error('Room not provided');
    }
    const hasPermissionToAddUsers = (0, ui_contexts_1.useAtLeastOnePermission)((0, react_1.useMemo)(() => [(room === null || room === void 0 ? void 0 : room.t) === 'p' ? 'add-user-to-any-p-room' : 'add-user-to-any-c-room', 'add-user-to-joined-room'], [room === null || room === void 0 ? void 0 : room.t]), rid);
    const userCanAdd = room && user && (0, core_typings_1.isRoomFederated)(room)
        ? Federation.isEditableByTheUser(currentUser || undefined, room, subscription)
        : hasPermissionToAddUsers;
    const { roomCanInvite } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription: subscription });
    const inviteUser = (0, ui_contexts_1.useEndpoint)('POST', inviteUserEndpoints[room.t === 'p' ? 'p' : 'c']);
    const handleAddUser = (0, fuselage_hooks_1.useEffectEvent)((_a) => __awaiter(void 0, [_a], void 0, function* ({ users }) {
        const [username] = users;
        yield inviteUser({ roomId: rid, username });
        reload === null || reload === void 0 ? void 0 : reload();
    }));
    const addClickHandler = (0, useAddMatrixUsers_1.useAddMatrixUsers)();
    const addUserOptionAction = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = [username];
            if ((0, core_typings_1.isRoomFederated)(room)) {
                addClickHandler.mutate({
                    users,
                    handleSave: handleAddUser,
                });
            }
            else {
                yield handleAddUser({ users });
            }
            dispatchToastMessage({ type: 'success', message: t('User_added') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const addUserOption = (0, react_1.useMemo)(() => roomCanInvite && userCanAdd && room.archived !== true
        ? {
            content: t('add-to-room'),
            icon: 'user-plus',
            onClick: addUserOptionAction,
            type: 'management',
        }
        : undefined, [roomCanInvite, userCanAdd, room.archived, t, addUserOptionAction]);
    return addUserOption;
};
exports.useAddUserAction = useAddUserAction;
