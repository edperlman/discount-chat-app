"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const chai_1 = require("chai");
const RoomReceiverDto_1 = require("../../../../../../../../server/services/federation/application/room/input/RoomReceiverDto");
const IFederationBridge_1 = require("../../../../../../../../server/services/federation/domain/IFederationBridge");
const RoomReceiver_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/converters/room/RoomReceiver");
const MatrixEventType_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixEventType");
const MatrixPowerLevels_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixPowerLevels");
const MatrixRoomJoinRules_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixRoomJoinRules");
const RoomMembershipChanged_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/definitions/events/RoomMembershipChanged");
describe('Federation - Infrastructure - Matrix - MatrixRoomReceiverConverter', () => {
    describe('#toRoomCreateDto()', () => {
        const event = {
            content: { was_internally_programatically_created: true, name: 'roomName', internalRoomId: 'internalRoomId' },
            event_id: 'eventId',
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomCreateInputDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomCreateInputDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ room_id: event.room_id });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should return the external room name and room type when the room state is present on the event and it has the correct events', () => {
            const state = [
                { type: MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
                { type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN } },
            ];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ unsigned: { invite_room_state: state } });
            (0, chai_1.expect)(result.externalRoomName).to.be.equal(event.content.name);
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.CHANNEL);
        });
        it('should convert to the expected (private) room type when the join rule is equal to INVITE', () => {
            const state = [
                { type: MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
                { type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.INVITE } },
            ];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ unsigned: { invite_room_state: state } });
            (0, chai_1.expect)(result.externalRoomName).to.be.equal(event.content.name);
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.PRIVATE_GROUP);
        });
        it('should convert to the expected (channel) room type when the join rule is equal to JOIN', () => {
            const state = [{ type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN } }];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ invite_room_state: state });
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.CHANNEL);
        });
        it('should convert the inviter id to the a rc-format like (without any @ in it)', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ sender: event.sender });
            (0, chai_1.expect)(result.normalizedInviterId).to.be.equal('marcos.defendi:matrix.org');
        });
        it('should set wasInternallyProgramaticallyCreated accordingly to the event', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto({ content: event.content });
            (0, chai_1.expect)(result.wasInternallyProgramaticallyCreated).to.be.true;
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomCreateDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalInviterId: '@marcos.defendi:matrix.org',
                normalizedInviterId: 'marcos.defendi:matrix.org',
                wasInternallyProgramaticallyCreated: true,
                externalRoomName: undefined,
                roomType: undefined,
                internalRoomId: 'internalRoomId',
            });
        });
    });
    describe('#toChangeRoomMembershipDto()', () => {
        const event = {
            content: { name: 'roomName' },
            event_id: 'eventId',
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
            state_key: '@marcos.defendi2:matrix.org',
        };
        it('should return an instance of FederationRoomChangeMembershipDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({}, 'domain')).to.be.instanceOf(RoomReceiverDto_1.FederationRoomChangeMembershipDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ room_id: event.room_id }, 'domain');
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should return the external room name and room type when the room state is present on the event and it has the correct events', () => {
            const state = [
                { type: MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
                { type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN } },
            ];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ unsigned: { invite_room_state: state } }, 'domain');
            (0, chai_1.expect)(result.externalRoomName).to.be.equal(event.content.name);
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.CHANNEL);
        });
        it('should convert to the expected (private) room type when the join rule is equal to INVITE', () => {
            const state = [
                { type: MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
                { type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.INVITE } },
            ];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ unsigned: { invite_room_state: state } }, 'domain');
            (0, chai_1.expect)(result.externalRoomName).to.be.equal(event.content.name);
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.PRIVATE_GROUP);
        });
        it('should convert to the expected (channel) room type when the join rule is equal to JOIN', () => {
            const state = [{ type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN } }];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ invite_room_state: state }, 'domain');
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.CHANNEL);
        });
        it('should convert to the expected (direct) room type when the join rule is equal to INVITE and its a direct message', () => {
            const state = [{ type: MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.INVITE } }];
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({
                invite_room_state: state,
                content: { is_direct: true },
            }, 'domain');
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.DIRECT_MESSAGE);
        });
        it('should convert the inviter id to the a rc-format like (without any @ in it)', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: event.sender }, 'domain');
            (0, chai_1.expect)(result.normalizedInviterId).to.be.equal('marcos.defendi:matrix.org');
        });
        it('should convert the invitee id to the a rc-format like (without any @ in it)', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ state_key: event.sender }, 'domain');
            (0, chai_1.expect)(result.normalizedInviteeId).to.be.equal('marcos.defendi:matrix.org');
        });
        it('should convert the inviter id to the a rc-format username like (without any @ in it and just the part before the ":")', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: event.sender }, 'domain');
            (0, chai_1.expect)(result.inviterUsernameOnly).to.be.equal('marcos.defendi');
        });
        it('should convert the invitee id to the a rc-format username like (without any @ in it and just the part before the ":")', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ state_key: event.sender }, 'domain');
            (0, chai_1.expect)(result.inviteeUsernameOnly).to.be.equal('marcos.defendi');
        });
        it('should set leave to true if its a LEAVE event', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({
                content: { membership: RoomMembershipChanged_1.RoomMembershipChangedEventType.LEAVE },
            }, 'domain');
            (0, chai_1.expect)(result.leave).to.be.true;
        });
        it('should set leave to false if its NOT a LEAVE event', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({
                content: { membership: RoomMembershipChanged_1.RoomMembershipChangedEventType.JOIN },
            }, 'domain');
            (0, chai_1.expect)(result.leave).to.be.false;
        });
        it('should set the event origin as REMOTE if the inviter is from a different home server', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: 'a:matrix.org' }, 'domain');
            (0, chai_1.expect)(result.eventOrigin).to.be.equal(IFederationBridge_1.EVENT_ORIGIN.REMOTE);
        });
        it('should set the event origin as LOCAL if the inviter is NOT from a different home server', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: 'a:domain' }, 'domain');
            (0, chai_1.expect)(result.eventOrigin).to.be.equal(IFederationBridge_1.EVENT_ORIGIN.LOCAL);
        });
        it('should return the user profile properties when the event contains those infos', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(Object.assign(Object.assign({}, event), { content: { avatar_url: 'avatarUrl', displayname: 'displayname', membership: 'join' } }), 'domain');
            (0, chai_1.expect)(result.userProfile).to.be.eql({
                avatarUrl: 'avatarUrl',
                displayName: 'displayname',
            });
        });
        it('should add the allInviteesExternalIdsWhenDM as an empty array property when the event is a direct message but the event does not contain room histocial data', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(Object.assign(Object.assign({}, event), { content: {
                    avatar_url: 'avatarUrl',
                    displayname: 'displayname',
                    membership: 'join',
                    is_direct: true,
                } }), 'domain');
            (0, chai_1.expect)(result.allInviteesExternalIdsWhenDM).to.be.eql([]);
        });
        it('should add the allInviteesExternalIdsWhenDM property when the event is a direct message and the event contains the room historical data inside of invite_room_state', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(Object.assign(Object.assign({}, event), { content: {
                    avatar_url: 'avatarUrl',
                    displayname: 'displayname',
                    membership: 'join',
                    is_direct: true,
                }, invite_room_state: [
                    {
                        type: MatrixEventType_1.MatrixEventType.ROOM_CREATED,
                        content: {
                            inviteesExternalIds: ['@a:matrix.org'],
                        },
                    },
                ] }), 'domain');
            (0, chai_1.expect)(result.allInviteesExternalIdsWhenDM).to.be.eql([
                {
                    externalInviteeId: '@a:matrix.org',
                    normalizedInviteeId: 'a:matrix.org',
                    inviteeUsernameOnly: 'a',
                },
            ]);
        });
        it('should add the allInviteesExternalIdsWhenDM property when the event is a direct message and the event contains the room historical data inside of unsigned.invite_room_state', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(Object.assign(Object.assign({}, event), { content: {
                    avatar_url: 'avatarUrl',
                    displayname: 'displayname',
                    membership: 'join',
                    is_direct: true,
                }, unsigned: {
                    invite_room_state: [
                        {
                            type: MatrixEventType_1.MatrixEventType.ROOM_CREATED,
                            content: {
                                inviteesExternalIds: ['@a:matrix.org'],
                            },
                        },
                    ],
                } }), 'domain');
            (0, chai_1.expect)(result.allInviteesExternalIdsWhenDM).to.be.eql([
                {
                    externalInviteeId: '@a:matrix.org',
                    normalizedInviteeId: 'a:matrix.org',
                    inviteeUsernameOnly: 'a',
                },
            ]);
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toChangeRoomMembershipDto(event, 'domain');
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalInviterId: '@marcos.defendi:matrix.org',
                normalizedInviterId: 'marcos.defendi:matrix.org',
                externalInviteeId: '@marcos.defendi2:matrix.org',
                normalizedInviteeId: 'marcos.defendi2:matrix.org',
                inviteeUsernameOnly: 'marcos.defendi2',
                inviterUsernameOnly: 'marcos.defendi',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                leave: false,
                externalRoomName: undefined,
                roomType: undefined,
                allInviteesExternalIdsWhenDM: [],
                userProfile: {
                    avatarUrl: undefined,
                    displayName: undefined,
                },
            });
        });
    });
    describe('#toSendRoomMessageDto()', () => {
        const event = {
            event_id: 'eventId',
            content: {
                'body': 'rawMessage',
                'formatted_body': 'externalFormattedText',
                'm.relates_to': { 'm.in_reply_to': { event_id: 'replyToEventId' } },
            },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomReceiveExternalMessageDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(event)).to.be.instanceOf(RoomReceiverDto_1.FederationRoomReceiveExternalMessageDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(event);
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the sender id to the a rc-format like (without any @ in it)', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(event);
            (0, chai_1.expect)(result.normalizedSenderId).to.be.equal('marcos.defendi:matrix.org');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                externalFormattedText: 'externalFormattedText',
                rawMessage: 'rawMessage',
                replyToEventId: 'replyToEventId',
                thread: undefined,
            });
        });
        it('should convert the event properly when it is a thread', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(Object.assign(Object.assign({}, event), { content: Object.assign(Object.assign({}, event.content), { 'm.relates_to': {
                        'event_id': 'relatesToEventId',
                        'm.in_reply_to': { event_id: 'inReplyToEventId' },
                        'rel_type': MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD,
                        'is_falling_back': true,
                    } }) }));
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                externalFormattedText: 'externalFormattedText',
                rawMessage: 'rawMessage',
                replyToEventId: undefined,
                thread: {
                    rootEventId: 'relatesToEventId',
                    replyToEventId: 'inReplyToEventId',
                },
            });
        });
        it('should convert the event properly when it is a thread and the message is being edited inside the thread', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomMessageDto(Object.assign(Object.assign({}, event), { content: Object.assign(Object.assign({}, event.content), { 'm.relates_to': {
                        'event_id': 'relatesToEventId',
                        'm.in_reply_to': { event_id: 'inReplyToEventId' },
                        'rel_type': MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD,
                        'is_falling_back': false,
                    } }) }));
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                externalFormattedText: 'externalFormattedText',
                rawMessage: 'rawMessage',
                replyToEventId: 'inReplyToEventId',
                thread: {
                    rootEventId: 'relatesToEventId',
                    replyToEventId: 'inReplyToEventId',
                },
            });
        });
    });
    describe('#toEditRoomMessageDto()', () => {
        const event = {
            event_id: 'eventId',
            content: {
                'body': 'msg',
                'm.relates_to': { event_id: 'editsEventId' },
                'm.new_content': { body: 'newRawMessage', formatted_body: 'newExternalFormattedText' },
            },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomEditExternalMessageDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(event)).to.be.instanceOf(RoomReceiverDto_1.FederationRoomEditExternalMessageDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(event);
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the sender id to the a rc-format like (without any @ in it)', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(event);
            (0, chai_1.expect)(result.normalizedSenderId).to.be.equal('marcos.defendi:matrix.org');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toEditRoomMessageDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                newRawMessage: 'newRawMessage',
                newExternalFormattedText: 'newExternalFormattedText',
                editsEvent: 'editsEventId',
            });
        });
    });
    describe('#toRoomChangeJoinRulesDto()', () => {
        const event = {
            event_id: 'eventId',
            content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomChangeJoinRulesDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomChangeJoinRulesDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto({ room_id: event.room_id });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert to the expected (private) room type when the join rule is equal to INVITE', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto({ content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.INVITE } });
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.PRIVATE_GROUP);
        });
        it('should convert to the expected (channel) room type when the join rule is equal to JOIN', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto({ content: { join_rule: MatrixRoomJoinRules_1.MatrixRoomJoinRules.JOIN } });
            (0, chai_1.expect)(result.roomType).to.be.equal(rooms_1.RoomType.CHANNEL);
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeJoinRulesDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                roomType: rooms_1.RoomType.CHANNEL,
            });
        });
    });
    describe('#toRoomChangeNameDto()', () => {
        const event = {
            event_id: 'eventId',
            content: { name: '@roomName' },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of toRoomChangeNameDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeNameDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomChangeNameDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeNameDto({ room_id: event.room_id });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the roomName to a normalized version without starting with @', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeNameDto({ content: event.content });
            (0, chai_1.expect)(result.normalizedRoomName).to.be.equal('roomName');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeNameDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                normalizedRoomName: 'roomName',
                externalSenderId: '@marcos.defendi:matrix.org',
            });
        });
    });
    describe('#toRoomChangeTopicDto()', () => {
        const event = {
            event_id: 'eventId',
            content: { topic: 'room topic' },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomChangeTopicDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeTopicDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomChangeTopicDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeTopicDto({ room_id: event.room_id });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangeTopicDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                roomTopic: 'room topic',
                externalSenderId: '@marcos.defendi:matrix.org',
            });
        });
    });
    describe('#toSendRoomFileMessageDto()', () => {
        const event = {
            event_id: 'eventId',
            content: {
                'body': 'filename',
                'url': 'url',
                'info': { mimetype: 'mime', size: 12 },
                'm.relates_to': { 'm.in_reply_to': { event_id: 'replyToEventId' } },
            },
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should throw an error if the url is not present in the file event', () => {
            (0, chai_1.expect)(() => RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto({ content: {} })).to.throw(Error, 'Missing url in the file message');
        });
        it('should throw an error if the mimetype is not present in the file event', () => {
            (0, chai_1.expect)(() => RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto({ content: { url: 'url' } })).to.throw(Error, 'Missing mimetype in the file message');
        });
        it('should throw an error if the size is not present in the file event', () => {
            (0, chai_1.expect)(() => RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto({ content: { url: 'url', info: { mimetype: 'mime' } } })).to.throw(Error, 'Missing size in the file message');
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto({ room_id: event.room_id, content: event.content });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                messageBody: {
                    filename: event.content.body,
                    url: event.content.url,
                    mimetype: event.content.info.mimetype,
                    size: event.content.info.size,
                    messageText: event.content.body,
                },
                replyToEventId: 'replyToEventId',
                thread: undefined,
            });
        });
        it('should convert the event properly when it is a thread', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(Object.assign(Object.assign({}, event), { content: Object.assign(Object.assign({}, event.content), { 'm.relates_to': {
                        'event_id': 'relatesToEventId',
                        'm.in_reply_to': { event_id: 'inReplyToEventId' },
                        'rel_type': MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD,
                        'is_falling_back': true,
                    } }) }));
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                messageBody: {
                    filename: event.content.body,
                    url: event.content.url,
                    mimetype: event.content.info.mimetype,
                    size: event.content.info.size,
                    messageText: event.content.body,
                },
                replyToEventId: undefined,
                thread: {
                    rootEventId: 'relatesToEventId',
                    replyToEventId: 'inReplyToEventId',
                },
            });
        });
        it('should convert the event properly when it is a thread and the message is being edited inside the thread', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toSendRoomFileMessageDto(Object.assign(Object.assign({}, event), { content: Object.assign(Object.assign({}, event.content), { 'm.relates_to': {
                        'event_id': 'relatesToEventId',
                        'm.in_reply_to': { event_id: 'inReplyToEventId' },
                        'rel_type': MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD,
                        'is_falling_back': false,
                    } }) }));
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: '@marcos.defendi:matrix.org',
                normalizedSenderId: 'marcos.defendi:matrix.org',
                messageBody: {
                    filename: event.content.body,
                    url: event.content.url,
                    mimetype: event.content.info.mimetype,
                    size: event.content.info.size,
                    messageText: event.content.body,
                },
                replyToEventId: 'inReplyToEventId',
                thread: {
                    rootEventId: 'relatesToEventId',
                    replyToEventId: 'inReplyToEventId',
                },
            });
        });
    });
    describe('#toRoomRedactEventDto()', () => {
        const event = {
            event_id: 'eventId',
            redacts: '$eventId',
            room_id: '!roomId:matrix.org',
            sender: '@marcos.defendi:matrix.org',
        };
        it('should return an instance of FederationRoomRedactEventDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomRedactEventDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomRedactEventDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomRedactEventDto({ room_id: event.room_id });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should convert the event properly', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomRedactEventDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                redactsEvent: '$eventId',
                externalSenderId: '@marcos.defendi:matrix.org',
            });
        });
    });
    describe('#toRoomChangePowerLevelsEventDto()', () => {
        it('should return an instance of FederationRoomRoomChangePowerLevelsEventDto', () => {
            (0, chai_1.expect)(RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({})).to.be.instanceOf(RoomReceiverDto_1.FederationRoomRoomChangePowerLevelsEventDto);
        });
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({ room_id: '!roomId:matrix.org' });
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!roomId:matrix.org');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('roomId');
        });
        it('should return the changes on roles when the user was demoted to a default role and its previous role was owner', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {},
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'owner', action: 'remove' }],
                },
            });
        });
        it('should return the changes on roles when the user was demoted to a default role and its previous role was moderator', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {},
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'moderator', action: 'remove' }],
                },
            });
        });
        it('should return an empty object for changes when there is no changes at all', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {},
            });
        });
        it('should return the correct changes on roles when the user was downgraded to a lower role', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [
                        { role: 'owner', action: 'remove' },
                        { role: 'moderator', action: 'add' },
                    ],
                },
            });
        });
        it('should return the correct changes on roles when the user was promoted to owner', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [
                        { role: 'owner', action: 'add' },
                        { role: 'moderator', action: 'remove' },
                    ],
                },
            });
        });
        it('should return the correct changes on roles when the user was promoted to moderator', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'moderator', action: 'add' }],
                },
            });
        });
        it('should return the correct changes on roles when the user was a default user and now is an owner', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                    },
                },
                prev_content: {
                    users: {},
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'owner', action: 'add' }],
                },
            });
        });
        it('should return the correct changes on roles when the user was a default user and now is a moderator', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
                prev_content: {
                    users: {},
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'moderator', action: 'add' }],
                },
            });
        });
        it('should return the correct changes on roles when the user has a custom role ending up with a DEFAULT(<= 0) role', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': -1,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [{ role: 'moderator', action: 'remove' }],
                },
            });
        });
        it('should return the correct changes on roles when the user has a custom role ending up with a MODERATOR(> 0 && <= 50) role', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': 18,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [
                        { role: 'owner', action: 'remove' },
                        { role: 'moderator', action: 'add' },
                    ],
                },
            });
        });
        it('should return the correct changes on roles when the user has a custom role ending up with a OWNER(> 50) role', () => {
            const result = RoomReceiver_1.MatrixRoomReceiverConverter.toRoomChangePowerLevelsEventDto({
                room_id: '!roomId:matrix.org',
                event_id: 'eventId',
                sender: 'sender',
                content: {
                    users: {
                        '@marcos.defendi:matrix.org': 72,
                    },
                },
                prev_content: {
                    users: {
                        '@marcos.defendi:matrix.org': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                    },
                },
            });
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: 'eventId',
                externalRoomId: '!roomId:matrix.org',
                normalizedRoomId: 'roomId',
                externalSenderId: 'sender',
                roleChangesToApply: {
                    '@marcos.defendi:matrix.org': [
                        { role: 'owner', action: 'add' },
                        { role: 'moderator', action: 'remove' },
                    ],
                },
            });
        });
    });
});
