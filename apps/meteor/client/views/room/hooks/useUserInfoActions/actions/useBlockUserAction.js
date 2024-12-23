"use strict";
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
exports.useBlockUserAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const useBlockUserAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const currentSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const { _id: uid } = user;
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanBlock } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription: currentSubscription });
    const isUserBlocked = currentSubscription === null || currentSubscription === void 0 ? void 0 : currentSubscription.blocker;
    const toggleBlock = (0, ui_contexts_1.useMethod)(isUserBlocked ? 'unblockUser' : 'blockUser');
    const toggleBlockUserAction = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield toggleBlock({ rid, blocked: uid });
            dispatchToastMessage({
                type: 'success',
                message: t(isUserBlocked ? 'User_is_unblocked' : 'User_is_blocked'),
            });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const toggleBlockUserOption = (0, react_1.useMemo)(() => roomCanBlock && uid !== ownUserId
        ? {
            content: t(isUserBlocked ? 'Unblock' : 'Block'),
            icon: 'ban',
            onClick: toggleBlockUserAction,
        }
        : undefined, [isUserBlocked, ownUserId, roomCanBlock, t, toggleBlockUserAction, uid]);
    return toggleBlockUserOption;
};
exports.useBlockUserAction = useBlockUserAction;
