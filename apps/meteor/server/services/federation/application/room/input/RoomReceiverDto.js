"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationRoomRoomChangePowerLevelsEventDto = exports.FederationRoomRedactEventDto = exports.FederationRoomChangeTopicDto = exports.FederationRoomChangeNameDto = exports.FederationRoomChangeJoinRulesDto = exports.FederationRoomReceiveExternalFileMessageDto = exports.FederationRoomEditExternalMessageDto = exports.FederationRoomReceiveExternalMessageDto = exports.FederationRoomChangeMembershipDto = exports.FederationRoomCreateInputDto = exports.FederationBaseRoomInputDto = void 0;
class FederationBaseDto {
    constructor({ externalEventId }) {
        this.externalEventId = externalEventId;
    }
}
class FederationBaseRoomInputDto extends FederationBaseDto {
    constructor({ externalRoomId, normalizedRoomId, externalEventId }) {
        super({ externalEventId });
        this.externalRoomId = externalRoomId;
        this.normalizedRoomId = normalizedRoomId;
    }
}
exports.FederationBaseRoomInputDto = FederationBaseRoomInputDto;
class FederationRoomCreateInputDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalInviterId, normalizedInviterId, wasInternallyProgramaticallyCreated, roomType, externalRoomName, internalRoomId, externalEventId, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.externalInviterId = externalInviterId;
        this.normalizedInviterId = normalizedInviterId;
        this.wasInternallyProgramaticallyCreated = wasInternallyProgramaticallyCreated;
        this.roomType = roomType;
        this.externalRoomName = externalRoomName;
        this.internalRoomId = internalRoomId;
    }
}
exports.FederationRoomCreateInputDto = FederationRoomCreateInputDto;
class FederationRoomChangeMembershipDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalInviterId, normalizedInviterId, externalInviteeId, normalizedInviteeId, inviteeUsernameOnly, inviterUsernameOnly, eventOrigin, leave, roomType, externalRoomName, externalEventId, userProfile, allInviteesExternalIdsWhenDM = [], }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.externalInviterId = externalInviterId;
        this.normalizedInviterId = normalizedInviterId;
        this.externalInviteeId = externalInviteeId;
        this.normalizedInviteeId = normalizedInviteeId;
        this.inviteeUsernameOnly = inviteeUsernameOnly;
        this.inviterUsernameOnly = inviterUsernameOnly;
        this.eventOrigin = eventOrigin;
        this.leave = leave;
        this.roomType = roomType;
        this.externalRoomName = externalRoomName;
        this.userProfile = userProfile;
        this.allInviteesExternalIdsWhenDM = allInviteesExternalIdsWhenDM;
    }
}
exports.FederationRoomChangeMembershipDto = FederationRoomChangeMembershipDto;
class ExternalMessageBaseDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalSenderId, normalizedSenderId, externalEventId }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.externalSenderId = externalSenderId;
        this.normalizedSenderId = normalizedSenderId;
    }
}
class FederationRoomReceiveExternalMessageDto extends ExternalMessageBaseDto {
    constructor({ externalRoomId, normalizedRoomId, externalSenderId, normalizedSenderId, externalFormattedText, rawMessage, externalEventId, replyToEventId, thread, }) {
        super({ externalRoomId, normalizedRoomId });
        this.externalSenderId = externalSenderId;
        this.normalizedSenderId = normalizedSenderId;
        this.externalFormattedText = externalFormattedText;
        this.rawMessage = rawMessage;
        this.replyToEventId = replyToEventId;
        this.externalEventId = externalEventId;
        this.thread = thread;
    }
}
exports.FederationRoomReceiveExternalMessageDto = FederationRoomReceiveExternalMessageDto;
class FederationRoomEditExternalMessageDto extends ExternalMessageBaseDto {
    constructor({ externalRoomId, normalizedRoomId, externalSenderId, normalizedSenderId, newRawMessage, newExternalFormattedText, editsEvent, externalEventId, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.externalSenderId = externalSenderId;
        this.normalizedSenderId = normalizedSenderId;
        this.newRawMessage = newRawMessage;
        this.newExternalFormattedText = newExternalFormattedText;
        this.editsEvent = editsEvent;
    }
}
exports.FederationRoomEditExternalMessageDto = FederationRoomEditExternalMessageDto;
class FederationFileMessageInputDto {
    constructor({ filename, mimetype, size, messageText, url }) {
        this.filename = filename;
        this.mimetype = mimetype;
        this.size = size;
        this.messageText = messageText;
        this.url = url;
    }
}
class FederationRoomReceiveExternalFileMessageDto extends ExternalMessageBaseDto {
    constructor({ externalRoomId, normalizedRoomId, externalSenderId, normalizedSenderId, filename, mimetype, size, messageText, url, externalEventId, replyToEventId, thread, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.externalSenderId = externalSenderId;
        this.normalizedSenderId = normalizedSenderId;
        this.replyToEventId = replyToEventId;
        this.messageBody = new FederationFileMessageInputDto({ filename, mimetype, size, messageText, url });
        this.thread = thread;
    }
}
exports.FederationRoomReceiveExternalFileMessageDto = FederationRoomReceiveExternalFileMessageDto;
class FederationRoomChangeJoinRulesDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, roomType, externalEventId }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.roomType = roomType;
    }
}
exports.FederationRoomChangeJoinRulesDto = FederationRoomChangeJoinRulesDto;
class FederationRoomChangeNameDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, normalizedRoomName, externalSenderId, externalEventId, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.normalizedRoomName = normalizedRoomName;
        this.externalSenderId = externalSenderId;
    }
}
exports.FederationRoomChangeNameDto = FederationRoomChangeNameDto;
class FederationRoomChangeTopicDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, roomTopic, externalSenderId, externalEventId }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.roomTopic = roomTopic;
        this.externalSenderId = externalSenderId;
    }
}
exports.FederationRoomChangeTopicDto = FederationRoomChangeTopicDto;
class FederationRoomRedactEventDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalEventId, redactsEvent, externalSenderId }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.redactsEvent = redactsEvent;
        this.externalSenderId = externalSenderId;
    }
}
exports.FederationRoomRedactEventDto = FederationRoomRedactEventDto;
class FederationRoomRoomChangePowerLevelsEventDto extends FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalEventId, roleChangesToApply, externalSenderId, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.roleChangesToApply = roleChangesToApply;
        this.externalSenderId = externalSenderId;
    }
}
exports.FederationRoomRoomChangePowerLevelsEventDto = FederationRoomRoomChangePowerLevelsEventDto;
