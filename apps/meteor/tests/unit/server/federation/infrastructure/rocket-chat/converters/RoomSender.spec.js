"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RoomSenderDto_1 = require("../../../../../../../server/services/federation/application/room/input/RoomSenderDto");
const RoomSender_1 = require("../../../../../../../server/services/federation/infrastructure/rocket-chat/converters/RoomSender");
describe.skip('Federation - Infrastructure - RocketChat - FederationRoomSenderConverter', () => {
    describe('#toCreateDirectMessageRoomDto()', () => {
        it('should return an instance of FederationCreateDMAndInviteUserDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto('internalInviterId', 'internalRoomId', 'externalInviteeId')).to.be.instanceOf(RoomSenderDto_1.FederationCreateDMAndInviteUserDto);
        });
        it('should return the normalizedInviteeId property without any @ if any', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto('internalInviterId', 'internalRoomId', '@externalInviteeId:server-name.com').normalizedInviteeId).to.be.equal('externalInviteeId:server-name.com');
        });
        it('should return the inviteeUsernameOnly property without any @ if any and only the first part before ":"', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto('internalInviterId', 'internalRoomId', '@externalInviteeId:server-name.com').inviteeUsernameOnly).to.be.equal('externalInviteeId');
        });
        it('should return the normalizedInviteeId AND inviteeUsernameOnly equals to the rawInviteeId if it does not have any special chars', () => {
            const result = RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto('internalInviterId', 'internalRoomId', 'externalInviteeId');
            (0, chai_1.expect)(result.rawInviteeId).to.be.equal('externalInviteeId');
            (0, chai_1.expect)(result.normalizedInviteeId).to.be.equal('externalInviteeId');
            (0, chai_1.expect)(result.inviteeUsernameOnly).to.be.equal('externalInviteeId');
        });
        it('should have all the properties set', () => {
            const internalInviterId = 'internalInviterId';
            const internalRoomId = 'internalRoomId';
            const externalInviteeId = 'externalInviteeId';
            const result = RoomSender_1.FederationRoomSenderConverter.toCreateDirectMessageRoomDto(internalInviterId, internalRoomId, externalInviteeId);
            (0, chai_1.expect)(result).to.be.eql({
                internalInviterId,
                internalRoomId,
                rawInviteeId: externalInviteeId,
                normalizedInviteeId: externalInviteeId,
                inviteeUsernameOnly: externalInviteeId,
            });
        });
    });
    describe('#toSendExternalMessageDto()', () => {
        it('should return an instance of FederationRoomSendExternalMessageDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toSendExternalMessageDto('internalSenderId', 'internalRoomId', { msg: 'text' })).to.be.instanceOf(RoomSenderDto_1.FederationRoomSendExternalMessageDto);
        });
        it('should have all the properties set', () => {
            const internalSenderId = 'internalSenderId';
            const internalRoomId = 'internalRoomId';
            const msg = { msg: 'text' };
            const result = RoomSender_1.FederationRoomSenderConverter.toSendExternalMessageDto(internalSenderId, internalRoomId, msg);
            (0, chai_1.expect)(result).to.be.eql({
                internalSenderId,
                internalRoomId,
                message: msg,
            });
        });
    });
    describe('#toAfterUserLeaveRoom()', () => {
        it('should return an instance of FederationAfterLeaveRoomDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toAfterUserLeaveRoom('internalUserId', 'internalRoomId')).to.be.instanceOf(RoomSenderDto_1.FederationAfterLeaveRoomDto);
        });
        it('should have all the properties set', () => {
            const internalUserId = 'internalUserId';
            const internalRoomId = 'internalRoomId';
            const result = RoomSender_1.FederationRoomSenderConverter.toAfterUserLeaveRoom('internalUserId', 'internalRoomId');
            (0, chai_1.expect)(result).to.be.eql({
                internalUserId,
                internalRoomId,
            });
        });
    });
    describe('#toOnUserRemovedFromRoom()', () => {
        it('should return an instance of FederationAfterRemoveUserFromRoomDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverter.toOnUserRemovedFromRoom('internalUserId', 'internalRoomId', 'actionDoneByInternalId')).to.be.instanceOf(RoomSenderDto_1.FederationAfterRemoveUserFromRoomDto);
        });
        it('should have all the properties set', () => {
            const internalUserId = 'internalUserId';
            const internalRoomId = 'internalRoomId';
            const actionDoneByInternalId = 'actionDoneByInternalId';
            const result = RoomSender_1.FederationRoomSenderConverter.toOnUserRemovedFromRoom('internalUserId', 'internalRoomId', 'actionDoneByInternalId');
            (0, chai_1.expect)(result).to.be.eql({
                internalUserId,
                internalRoomId,
                actionDoneByInternalId,
            });
        });
    });
});
