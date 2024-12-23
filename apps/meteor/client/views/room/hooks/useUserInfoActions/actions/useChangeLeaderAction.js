"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangeLeaderAction = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useEndpointAction_1 = require("../../../../../hooks/useEndpointAction");
const getRoomDirectives_1 = require("../../../lib/getRoomDirectives");
const useUserHasRoomRole_1 = require("../../useUserHasRoomRole");
const useChangeLeaderAction = (user, rid) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, ui_contexts_1.useUserRoom)(rid);
    const { _id: uid } = user;
    const userCanSetLeader = (0, ui_contexts_1.usePermission)('set-leader', rid);
    const userSubscription = (0, ui_contexts_1.useUserSubscription)(rid);
    if (!room) {
        throw Error('Room not provided');
    }
    const { roomCanSetLeader } = (0, getRoomDirectives_1.getRoomDirectives)({ room, showingUserId: uid, userSubscription });
    const isLeader = (0, useUserHasRoomRole_1.useUserHasRoomRole)(uid, rid, 'leader');
    const endpointPrefix = room.t === 'p' ? '/v1/groups' : '/v1/channels';
    const changeLeaderEndpoint = isLeader ? 'removeLeader' : 'addLeader';
    const changeLeaderMessage = isLeader ? 'removed__username__as__role_' : 'set__username__as__role_';
    const changeLeader = (0, useEndpointAction_1.useEndpointAction)('POST', `${endpointPrefix}.${changeLeaderEndpoint}`, {
        successMessage: t(changeLeaderMessage, { username: user.username, role: 'leader' }),
    });
    const changeLeaderAction = (0, fuselage_hooks_1.useMutableCallback)(() => changeLeader({ roomId: rid, userId: uid }));
    const changeLeaderOption = (0, react_1.useMemo)(() => roomCanSetLeader && userCanSetLeader
        ? {
            content: t(isLeader ? 'Remove_as_leader' : 'Set_as_leader'),
            icon: 'shield-alt',
            onClick: changeLeaderAction,
            type: 'privileges',
        }
        : undefined, [isLeader, roomCanSetLeader, t, userCanSetLeader, changeLeaderAction]);
    return changeLeaderOption;
};
exports.useChangeLeaderAction = useChangeLeaderAction;
