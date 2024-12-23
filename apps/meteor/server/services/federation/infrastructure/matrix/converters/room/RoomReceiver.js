"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixRoomReceiverConverter = exports.convertExternalRoomIdToInternalRoomIdFormat = exports.extractServerNameFromExternalIdentifier = exports.isAnExternalUserIdFormat = exports.isAnExternalIdentifierFormat = exports.formatExternalUserIdToInternalUsernameFormat = exports.removeExternalSpecificCharsFromExternalIdentifier = void 0;
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const RoomReceiverDto_1 = require("../../../../application/room/input/RoomReceiverDto");
const IFederationBridge_1 = require("../../../../domain/IFederationBridge");
const FederatedRoomInternalRoles_1 = require("../../../rocket-chat/definitions/FederatedRoomInternalRoles");
const MatrixEventType_1 = require("../../definitions/MatrixEventType");
const MatrixPowerLevels_1 = require("../../definitions/MatrixPowerLevels");
const MatrixRoomJoinRules_1 = require("../../definitions/MatrixRoomJoinRules");
const RoomMembershipChanged_1 = require("../../definitions/events/RoomMembershipChanged");
/** @deprecated export from {@link ../../helpers/MatrixIdStringTools} instead */
const removeExternalSpecificCharsFromExternalIdentifier = (matrixIdentifier = '') => {
    return matrixIdentifier.replace('@', '').replace('!', '').replace('#', '');
};
exports.removeExternalSpecificCharsFromExternalIdentifier = removeExternalSpecificCharsFromExternalIdentifier;
/** @deprecated export from {@link ../../helpers/MatrixIdStringTools} instead */
const formatExternalUserIdToInternalUsernameFormat = (matrixUserId = '') => {
    var _a;
    return (_a = matrixUserId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', '');
};
exports.formatExternalUserIdToInternalUsernameFormat = formatExternalUserIdToInternalUsernameFormat;
const isAnExternalIdentifierFormat = (identifier) => identifier.includes(':');
exports.isAnExternalIdentifierFormat = isAnExternalIdentifierFormat;
/** @deprecated export from {@link ../../helpers/MatrixIdStringTools} instead */
const isAnExternalUserIdFormat = (userId) => (0, exports.isAnExternalIdentifierFormat)(userId) && userId.includes('@');
exports.isAnExternalUserIdFormat = isAnExternalUserIdFormat;
/** @deprecated export from {@link ../../helpers/MatrixIdStringTools} instead */
const extractServerNameFromExternalIdentifier = (identifier = '') => {
    const splitted = identifier.split(':');
    return splitted.length > 1 ? splitted[1] : '';
};
exports.extractServerNameFromExternalIdentifier = extractServerNameFromExternalIdentifier;
const convertExternalRoomIdToInternalRoomIdFormat = (matrixRoomId = '') => {
    const prefixedRoomIdOnly = matrixRoomId.split(':')[0];
    const prefix = '!';
    return prefixedRoomIdOnly === null || prefixedRoomIdOnly === void 0 ? void 0 : prefixedRoomIdOnly.replace(prefix, '');
};
exports.convertExternalRoomIdToInternalRoomIdFormat = convertExternalRoomIdToInternalRoomIdFormat;
const getEventOrigin = (inviterId = '', homeServerDomain) => {
    const fromADifferentServer = (0, exports.extractServerNameFromExternalIdentifier)(inviterId) !== homeServerDomain;
    return fromADifferentServer ? IFederationBridge_1.EVENT_ORIGIN.REMOTE : IFederationBridge_1.EVENT_ORIGIN.LOCAL;
};
const convertExternalJoinRuleToInternalRoomType = (matrixJoinRule, matrixRoomIsDirect = false) => {
    if (matrixRoomIsDirect) {
        return rooms_1.RoomType.DIRECT_MESSAGE;
    }
    const mapping = {
        [MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN]: rooms_1.RoomType.CHANNEL,
        [MatrixRoomJoinRules_1.MatrixRoomJoinRules.INVITE]: rooms_1.RoomType.PRIVATE_GROUP,
    };
    return mapping[matrixJoinRule] || rooms_1.RoomType.CHANNEL;
};
const tryToExtractExternalRoomNameFromTheRoomState = (roomState = []) => {
    var _a, _b;
    if (roomState.length === 0) {
        return {};
    }
    const externalRoomName = (_b = (_a = roomState.find((stateEvent) => stateEvent.type === MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED)) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.name;
    return Object.assign({}, (externalRoomName ? { externalRoomName: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalRoomName) } : {}));
};
const tryToExtractAndConvertRoomTypeFromTheRoomState = (roomState = [], matrixRoomIsDirect = false) => {
    var _a, _b;
    if (roomState.length === 0) {
        return {};
    }
    const externalRoomJoinRule = (_b = (_a = roomState.find((stateEvent) => stateEvent.type === MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED)) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.join_rule;
    return Object.assign({}, (externalRoomJoinRule ? { roomType: convertExternalJoinRuleToInternalRoomType(externalRoomJoinRule, matrixRoomIsDirect) } : {}));
};
const convertNumericalPowerLevelToInternalRole = (powerLevel) => {
    const mapping = {
        [MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER]: undefined,
        [MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR]: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR,
        [MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN]: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER,
    };
    if (mapping[powerLevel]) {
        return mapping[powerLevel];
    }
    if (powerLevel <= MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER) {
        return;
    }
    if (powerLevel > MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER && powerLevel <= MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR) {
        return FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR;
    }
    return FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER;
};
const onlyRolesAddedToDefaultUsers = (previousRolesState, externalUserId) => !previousRolesState[externalUserId];
const verifyIfNewRolesWereAddedForDefaultUsers = (currentRolesState, previousRolesState, changesAlreadyMadeToRoles) => Object.keys(currentRolesState)
    .filter((externalUserId) => onlyRolesAddedToDefaultUsers(previousRolesState, externalUserId))
    .reduce((externalRolesChangesForDefaultUsers, externalUserId) => {
    const isCurrentRoleAnOwner = convertNumericalPowerLevelToInternalRole(currentRolesState[externalUserId]) === FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER;
    externalRolesChangesForDefaultUsers[externalUserId] = isCurrentRoleAnOwner
        ? [{ action: 'add', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER }]
        : [{ action: 'add', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR }];
    return externalRolesChangesForDefaultUsers;
}, changesAlreadyMadeToRoles);
const createExternalRolesChangesActions = (currentRolesState = {}, previousRolesState = {}) => {
    const changesInRolesBasedOnPreviousState = Object.keys(previousRolesState).reduce((externalRolesChangesByUser, externalUserId) => {
        const currentPowerLevel = currentRolesState[externalUserId];
        const previousPowerLevel = previousRolesState[externalUserId];
        const convertedPreviousExternalRole = convertNumericalPowerLevelToInternalRole(previousPowerLevel);
        const convertedCurrentExternalRole = convertNumericalPowerLevelToInternalRole(currentPowerLevel);
        const wasPreviousRoleAnOwner = convertedPreviousExternalRole === FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER;
        const isCurrentRoleAnOwner = convertedCurrentExternalRole === FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER;
        const isCurrentRoleADefault = currentPowerLevel === undefined;
        const isStillTheSameRole = currentPowerLevel === previousPowerLevel;
        const isDowngradingTheRole = currentPowerLevel < previousPowerLevel;
        if (isCurrentRoleADefault) {
            externalRolesChangesByUser[externalUserId] = wasPreviousRoleAnOwner
                ? [{ action: 'remove', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER }]
                : [{ action: 'remove', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR }];
            return externalRolesChangesByUser;
        }
        if (isStillTheSameRole) {
            return externalRolesChangesByUser;
        }
        if (isDowngradingTheRole) {
            externalRolesChangesByUser[externalUserId] = [
                ...(convertedPreviousExternalRole ? [{ action: 'remove', role: convertedPreviousExternalRole }] : []),
                ...(convertedCurrentExternalRole ? [{ action: 'add', role: convertedCurrentExternalRole }] : []),
            ];
            return externalRolesChangesByUser;
        }
        externalRolesChangesByUser[externalUserId] = isCurrentRoleAnOwner
            ? [
                { action: 'add', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER },
                { action: 'remove', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR },
            ]
            : [
                { action: 'add', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR },
                { action: 'remove', role: FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER },
            ];
        return externalRolesChangesByUser;
    }, {});
    return verifyIfNewRolesWereAddedForDefaultUsers(currentRolesState, previousRolesState, changesInRolesBasedOnPreviousState);
};
const getInviteesFromRoomState = (roomState = []) => {
    var _a;
    const inviteesFromRoomState = (_a = roomState === null || roomState === void 0 ? void 0 : roomState.find((stateEvent) => stateEvent.type === MatrixEventType_1.MatrixEventType.ROOM_CREATED)) === null || _a === void 0 ? void 0 : _a.content.inviteesExternalIds;
    if (inviteesFromRoomState) {
        return inviteesFromRoomState.map((inviteeExternalId) => ({
            externalInviteeId: inviteeExternalId,
            normalizedInviteeId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(inviteeExternalId),
            inviteeUsernameOnly: (0, exports.formatExternalUserIdToInternalUsernameFormat)(inviteeExternalId),
        }));
    }
    return [];
};
const extractAllInviteeIdsWhenDM = (externalEvent) => {
    var _a, _b;
    if (!externalEvent.invite_room_state && !((_a = externalEvent.unsigned) === null || _a === void 0 ? void 0 : _a.invite_room_state)) {
        return [];
    }
    return getInviteesFromRoomState(externalEvent.invite_room_state || ((_b = externalEvent.unsigned) === null || _b === void 0 ? void 0 : _b.invite_room_state) || []);
};
class MatrixRoomReceiverConverter {
    static toRoomCreateDto(externalEvent) {
        var _a, _b, _c, _d;
        return new RoomReceiverDto_1.FederationRoomCreateInputDto(Object.assign(Object.assign(Object.assign({ externalEventId: externalEvent.event_id, externalRoomId: externalEvent.room_id, normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id) }, tryToExtractExternalRoomNameFromTheRoomState(externalEvent.invite_room_state || ((_a = externalEvent.unsigned) === null || _a === void 0 ? void 0 : _a.invite_room_state))), tryToExtractAndConvertRoomTypeFromTheRoomState(externalEvent.invite_room_state || ((_b = externalEvent.unsigned) === null || _b === void 0 ? void 0 : _b.invite_room_state))), { externalInviterId: externalEvent.sender, normalizedInviterId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.sender), wasInternallyProgramaticallyCreated: ((_c = externalEvent.content) === null || _c === void 0 ? void 0 : _c.was_internally_programatically_created) || false, internalRoomId: (_d = externalEvent.content) === null || _d === void 0 ? void 0 : _d.internalRoomId }));
    }
    static toChangeRoomMembershipDto(externalEvent, homeServerDomain) {
        var _a, _b, _c, _d, _e, _f, _g;
        return new RoomReceiverDto_1.FederationRoomChangeMembershipDto(Object.assign(Object.assign(Object.assign(Object.assign({ externalEventId: externalEvent.event_id, externalRoomId: externalEvent.room_id, normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id) }, tryToExtractExternalRoomNameFromTheRoomState(externalEvent.invite_room_state || ((_a = externalEvent.unsigned) === null || _a === void 0 ? void 0 : _a.invite_room_state))), tryToExtractAndConvertRoomTypeFromTheRoomState(externalEvent.invite_room_state || ((_b = externalEvent.unsigned) === null || _b === void 0 ? void 0 : _b.invite_room_state), (_c = externalEvent.content) === null || _c === void 0 ? void 0 : _c.is_direct)), { externalInviterId: externalEvent.sender, normalizedInviterId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.sender), externalInviteeId: externalEvent.state_key, normalizedInviteeId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.state_key), inviteeUsernameOnly: (0, exports.formatExternalUserIdToInternalUsernameFormat)(externalEvent.state_key), inviterUsernameOnly: (0, exports.formatExternalUserIdToInternalUsernameFormat)(externalEvent.sender), eventOrigin: getEventOrigin(externalEvent.sender, homeServerDomain), leave: ((_d = externalEvent.content) === null || _d === void 0 ? void 0 : _d.membership) === RoomMembershipChanged_1.RoomMembershipChangedEventType.LEAVE, userProfile: {
                avatarUrl: (_e = externalEvent.content) === null || _e === void 0 ? void 0 : _e.avatar_url,
                displayName: (_f = externalEvent.content) === null || _f === void 0 ? void 0 : _f.displayname,
            } }), (((_g = externalEvent.content) === null || _g === void 0 ? void 0 : _g.is_direct) ? { allInviteesExternalIdsWhenDM: extractAllInviteeIdsWhenDM(externalEvent) } : {})));
    }
    static toSendRoomMessageDto(externalEvent) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const isThreadedMessage = Boolean(((_b = (_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a['m.relates_to']) === null || _b === void 0 ? void 0 : _b.rel_type) === MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD);
        return new RoomReceiverDto_1.FederationRoomReceiveExternalMessageDto(Object.assign({ externalEventId: externalEvent.event_id, externalRoomId: externalEvent.room_id, normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id), externalSenderId: externalEvent.sender, normalizedSenderId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.sender), externalFormattedText: externalEvent.content.formatted_body || '', rawMessage: externalEvent.content.body }, (isThreadedMessage
            ? {
                thread: {
                    rootEventId: ((_d = (_c = externalEvent.content) === null || _c === void 0 ? void 0 : _c['m.relates_to']) === null || _d === void 0 ? void 0 : _d.event_id) || '',
                    replyToEventId: ((_g = (_f = (_e = externalEvent.content) === null || _e === void 0 ? void 0 : _e['m.relates_to']) === null || _f === void 0 ? void 0 : _f['m.in_reply_to']) === null || _g === void 0 ? void 0 : _g.event_id) || '',
                },
                replyToEventId: !((_j = (_h = externalEvent.content) === null || _h === void 0 ? void 0 : _h['m.relates_to']) === null || _j === void 0 ? void 0 : _j.is_falling_back)
                    ? (_m = (_l = (_k = externalEvent.content) === null || _k === void 0 ? void 0 : _k['m.relates_to']) === null || _l === void 0 ? void 0 : _l['m.in_reply_to']) === null || _m === void 0 ? void 0 : _m.event_id
                    : undefined,
            }
            : {
                replyToEventId: (_q = (_p = (_o = externalEvent.content) === null || _o === void 0 ? void 0 : _o['m.relates_to']) === null || _p === void 0 ? void 0 : _p['m.in_reply_to']) === null || _q === void 0 ? void 0 : _q.event_id,
            })));
    }
    static toEditRoomMessageDto(externalEvent) {
        var _a, _b, _c;
        return new RoomReceiverDto_1.FederationRoomEditExternalMessageDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            normalizedSenderId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.sender),
            newExternalFormattedText: ((_a = externalEvent.content['m.new_content']) === null || _a === void 0 ? void 0 : _a.formatted_body) || '',
            newRawMessage: (_b = externalEvent.content['m.new_content']) === null || _b === void 0 ? void 0 : _b.body,
            editsEvent: (_c = externalEvent.content['m.relates_to']) === null || _c === void 0 ? void 0 : _c.event_id,
        });
    }
    static toSendRoomFileMessageDto(externalEvent) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        if (!externalEvent.content.url) {
            throw new Error('Missing url in the file message');
        }
        if (!((_a = externalEvent.content.info) === null || _a === void 0 ? void 0 : _a.mimetype)) {
            throw new Error('Missing mimetype in the file message info');
        }
        if (!((_b = externalEvent.content.info) === null || _b === void 0 ? void 0 : _b.size)) {
            throw new Error('Missing size in the file message info');
        }
        const isThreadedMessage = Boolean(((_d = (_c = externalEvent.content) === null || _c === void 0 ? void 0 : _c['m.relates_to']) === null || _d === void 0 ? void 0 : _d.rel_type) === MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD);
        return new RoomReceiverDto_1.FederationRoomReceiveExternalFileMessageDto(Object.assign({ externalEventId: externalEvent.event_id, externalRoomId: externalEvent.room_id, normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id), externalSenderId: externalEvent.sender, normalizedSenderId: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)(externalEvent.sender), filename: externalEvent.content.body, url: externalEvent.content.url, mimetype: externalEvent.content.info.mimetype, size: externalEvent.content.info.size, messageText: externalEvent.content.body }, (isThreadedMessage
            ? {
                thread: {
                    rootEventId: ((_f = (_e = externalEvent.content) === null || _e === void 0 ? void 0 : _e['m.relates_to']) === null || _f === void 0 ? void 0 : _f.event_id) || '',
                    replyToEventId: ((_j = (_h = (_g = externalEvent.content) === null || _g === void 0 ? void 0 : _g['m.relates_to']) === null || _h === void 0 ? void 0 : _h['m.in_reply_to']) === null || _j === void 0 ? void 0 : _j.event_id) || '',
                },
                replyToEventId: !((_l = (_k = externalEvent.content) === null || _k === void 0 ? void 0 : _k['m.relates_to']) === null || _l === void 0 ? void 0 : _l.is_falling_back)
                    ? (_p = (_o = (_m = externalEvent.content) === null || _m === void 0 ? void 0 : _m['m.relates_to']) === null || _o === void 0 ? void 0 : _o['m.in_reply_to']) === null || _p === void 0 ? void 0 : _p.event_id
                    : undefined,
            }
            : {
                replyToEventId: (_s = (_r = (_q = externalEvent.content) === null || _q === void 0 ? void 0 : _q['m.relates_to']) === null || _r === void 0 ? void 0 : _r['m.in_reply_to']) === null || _s === void 0 ? void 0 : _s.event_id,
            })));
    }
    static toRoomChangeJoinRulesDto(externalEvent) {
        var _a;
        return new RoomReceiverDto_1.FederationRoomChangeJoinRulesDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            roomType: convertExternalJoinRuleToInternalRoomType((_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a.join_rule),
        });
    }
    static toRoomChangeNameDto(externalEvent) {
        var _a;
        return new RoomReceiverDto_1.FederationRoomChangeNameDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            normalizedRoomName: (0, exports.removeExternalSpecificCharsFromExternalIdentifier)((_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a.name),
        });
    }
    static toRoomChangeTopicDto(externalEvent) {
        var _a;
        return new RoomReceiverDto_1.FederationRoomChangeTopicDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            roomTopic: (_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a.topic,
        });
    }
    static toRoomRedactEventDto(externalEvent) {
        return new RoomReceiverDto_1.FederationRoomRedactEventDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            redactsEvent: externalEvent.redacts,
        });
    }
    static toRoomChangePowerLevelsEventDto(externalEvent) {
        var _a, _b;
        return new RoomReceiverDto_1.FederationRoomRoomChangePowerLevelsEventDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, exports.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            roleChangesToApply: createExternalRolesChangesActions((_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a.users, ((_b = externalEvent.prev_content) === null || _b === void 0 ? void 0 : _b.users) || {}),
        });
    }
}
exports.MatrixRoomReceiverConverter = MatrixRoomReceiverConverter;
