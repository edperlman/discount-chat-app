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
exports.MatrixRoomPowerLevelsChangedHandler = exports.MatrixRoomEventRedactedHandler = exports.MatrixRoomTopicChangedHandler = exports.MatrixRoomNameChangedHandler = exports.MatrixRoomJoinRulesChangedHandler = exports.MatrixRoomMessageSentHandler = exports.MatrixRoomMembershipChangedHandler = exports.MatrixRoomCreatedHandler = void 0;
const BaseEvent_1 = require("./BaseEvent");
const RoomReceiver_1 = require("../converters/room/RoomReceiver");
const MatrixEventType_1 = require("../definitions/MatrixEventType");
const RoomMessageSent_1 = require("../definitions/events/RoomMessageSent");
class MatrixRoomCreatedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_CREATED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onCreateRoom(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto(externalEvent));
        });
    }
}
exports.MatrixRoomCreatedHandler = MatrixRoomCreatedHandler;
class MatrixRoomMembershipChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService, rocketSettingsAdapter) {
        super();
        this.roomService = roomService;
        this.rocketSettingsAdapter = rocketSettingsAdapter;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_MEMBERSHIP_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onChangeRoomMembership(RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(externalEvent, this.rocketSettingsAdapter.getHomeServerDomain()));
        });
    }
}
exports.MatrixRoomMembershipChangedHandler = MatrixRoomMembershipChangedHandler;
class MatrixRoomMessageSentHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT;
    }
    executeTextMessageHandler(eventContent, externalEvent) {
        const isAnEditionEvent = eventContent['m.new_content'] &&
            eventContent['m.relates_to'] &&
            eventContent['m.relates_to'].rel_type === RoomMessageSent_1.MatrixEnumRelatesToRelType.REPLACE;
        return isAnEditionEvent
            ? this.roomService.onExternalMessageEditedReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(externalEvent))
            : this.roomService.onExternalMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent));
    }
    executeThreadedTextMessageHandler(eventContent, externalEvent) {
        const isAnEditionEvent = eventContent['m.new_content'] &&
            eventContent['m.relates_to'] &&
            eventContent['m.relates_to'].rel_type === RoomMessageSent_1.MatrixEnumRelatesToRelType.REPLACE;
        return isAnEditionEvent
            ? this.roomService.onExternalMessageEditedReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(externalEvent))
            : this.roomService.onExternalThreadedMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent));
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const handlers = {
                [RoomMessageSent_1.MatrixEnumSendMessageType.TEXT]: () => this.executeTextMessageHandler(externalEvent.content, externalEvent),
                [RoomMessageSent_1.MatrixEnumSendMessageType.AUDIO]: () => this.roomService.onExternalFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.FILE]: () => this.roomService.onExternalFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.IMAGE]: () => this.roomService.onExternalFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.NOTICE]: () => this.roomService.onExternalMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.VIDEO]: () => this.roomService.onExternalFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.EMOTE]: () => this.roomService.onExternalMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.LOCATION]: () => {
                    throw new Error('Location events are not supported yet');
                },
            };
            const threadHandlers = {
                [RoomMessageSent_1.MatrixEnumSendMessageType.TEXT]: () => this.executeThreadedTextMessageHandler(externalEvent.content, externalEvent),
                [RoomMessageSent_1.MatrixEnumSendMessageType.AUDIO]: () => this.roomService.onExternalThreadedFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.FILE]: () => this.roomService.onExternalThreadedFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.IMAGE]: () => this.roomService.onExternalThreadedFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.NOTICE]: () => this.roomService.onExternalThreadedMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.VIDEO]: () => this.roomService.onExternalThreadedFileMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.EMOTE]: () => this.roomService.onExternalThreadedMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent)),
                [RoomMessageSent_1.MatrixEnumSendMessageType.LOCATION]: () => {
                    throw new Error('Location events are not supported yet');
                },
            };
            const defaultHandler = () => this.roomService.onExternalThreadedMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent));
            const threadedDefaultHandler = () => this.roomService.onExternalThreadedMessageReceived(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(externalEvent));
            const isThreadedMessage = Boolean(((_b = (_a = externalEvent.content) === null || _a === void 0 ? void 0 : _a['m.relates_to']) === null || _b === void 0 ? void 0 : _b.rel_type) === MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD);
            if (isThreadedMessage) {
                return (threadHandlers[externalEvent.content.msgtype] || threadedDefaultHandler)();
            }
            yield (handlers[externalEvent.content.msgtype] || defaultHandler)();
        });
    }
}
exports.MatrixRoomMessageSentHandler = MatrixRoomMessageSentHandler;
class MatrixRoomJoinRulesChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onChangeJoinRules(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto(externalEvent));
        });
    }
}
exports.MatrixRoomJoinRulesChangedHandler = MatrixRoomJoinRulesChangedHandler;
class MatrixRoomNameChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onChangeRoomName(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeNameDto(externalEvent));
        });
    }
}
exports.MatrixRoomNameChangedHandler = MatrixRoomNameChangedHandler;
class MatrixRoomTopicChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_TOPIC_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onChangeRoomTopic(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeTopicDto(externalEvent));
        });
    }
}
exports.MatrixRoomTopicChangedHandler = MatrixRoomTopicChangedHandler;
class MatrixRoomEventRedactedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_EVENT_REDACTED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onRedactEvent(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomRedactEventDto(externalEvent));
        });
    }
}
exports.MatrixRoomEventRedactedHandler = MatrixRoomEventRedactedHandler;
class MatrixRoomPowerLevelsChangedHandler extends BaseEvent_1.MatrixBaseEventHandler {
    constructor(roomService) {
        super();
        this.roomService = roomService;
        this.eventType = MatrixEventType_1.MatrixEventType.ROOM_POWER_LEVELS_CHANGED;
    }
    handle(externalEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.roomService.onChangeRoomPowerLevels(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto(externalEvent));
        });
    }
}
exports.MatrixRoomPowerLevelsChangedHandler = MatrixRoomPowerLevelsChangedHandler;
