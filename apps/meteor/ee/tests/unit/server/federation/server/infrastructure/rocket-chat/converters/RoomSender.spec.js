"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RoomSenderDto_1 = require("../../../../../../../../server/local-services/federation/application/room/sender/input/RoomSenderDto");
const RoomSender_1 = require("../../../../../../../../server/local-services/federation/infrastructure/rocket-chat/converters/RoomSender");
describe('FederationEE - Infrastructure - Matrix - FederationRoomSenderConverterEE', () => {
    const inviteeId = '@marcos.defendi:matrix.org';
    describe('#toRoomInviteUserDto()', () => {
        it('should return an instance of FederationRoomInviteUserDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverterEE.toRoomInviteUserDto('inviterId', 'roomId', inviteeId)).to.be.instanceOf(RoomSenderDto_1.FederationRoomInviteUserDto);
        });
        it('should return the basic user  properties correctly (normalizedInviteeId without any "@" and inviteeUsernameOnly only the part before the ":") if any', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toRoomInviteUserDto('inviterId', 'roomId', inviteeId);
            (0, chai_1.expect)(result.normalizedInviteeId).to.be.equal('marcos.defendi:matrix.org');
            (0, chai_1.expect)(result.internalRoomId).to.be.equal('roomId');
            (0, chai_1.expect)(result.inviteeUsernameOnly).to.be.equal('marcos.defendi');
            (0, chai_1.expect)(result.internalInviterId).to.be.equal('inviterId');
            (0, chai_1.expect)(result.rawInviteeId).to.be.equal(inviteeId);
        });
    });
    describe('#toSetupRoomDto()', () => {
        it('should return an instance of FederationSetupRoomDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverterEE.toSetupRoomDto('inviterId', 'roomId')).to.be.instanceOf(RoomSenderDto_1.FederationSetupRoomDto);
        });
        it('should return the invitees without the owner and with normalized invitees', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toSetupRoomDto('inviterId', 'roomId');
            (0, chai_1.expect)(result.internalRoomId).to.be.equal('roomId');
            (0, chai_1.expect)(result.internalInviterId).to.be.equal('inviterId');
        });
    });
    describe('#toOnRoomCreationDto()', () => {
        it('should return an instance of FederationRoomInviteUserDto', () => {
            (0, chai_1.expect)(RoomSender_1.FederationRoomSenderConverterEE.toOnRoomCreationDto('inviterId', 'username', 'roomId', ['username1'], 'domain')).to.be.instanceOf(RoomSenderDto_1.FederationOnRoomCreationDto);
        });
        it('should return the invitees without the owner and with normalized invitees', () => {
            var _a;
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnRoomCreationDto('inviterId', 'username', 'roomId', [inviteeId, 'username'], 'domain');
            (0, chai_1.expect)(result.internalRoomId).to.be.equal('roomId');
            (0, chai_1.expect)(result.internalInviterId).to.be.equal('inviterId');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                {
                    normalizedInviteeId: inviteeId.replace('@', ''),
                    inviteeUsernameOnly: (_a = inviteeId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', ''),
                    rawInviteeId: `@${inviteeId.replace('@', '')}`,
                },
            ]);
        });
    });
    describe('#toOnAddedUsersToARoomDto()', () => {
        it('should return the invitees without the owner and with normalized invitees', () => {
            var _a;
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnAddedUsersToARoomDto('inviterId', 'username', 'roomId', [inviteeId, 'username'], 'domain');
            (0, chai_1.expect)(result.internalRoomId).to.be.equal('roomId');
            (0, chai_1.expect)(result.internalInviterId).to.be.equal('inviterId');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                {
                    normalizedInviteeId: inviteeId.replace('@', ''),
                    inviteeUsernameOnly: (_a = inviteeId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', ''),
                    rawInviteeId: `@${inviteeId.replace('@', '')}`,
                },
            ]);
        });
        it('should return the inviteComesFromAnExternalHomeServer property as true when the invite comes from an external home server', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnAddedUsersToARoomDto('inviterId', 'username:matrix.org', 'roomId', [inviteeId, 'username'], 'domain');
            (0, chai_1.expect)(result.inviteComesFromAnExternalHomeServer).to.be.equal(true);
        });
        it('should return the inviteComesFromAnExternalHomeServer property as false when the invite comes from an external home server', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnAddedUsersToARoomDto('inviterId', 'username:matrix.org', 'roomId', [inviteeId, 'username'], 'matrix.org');
            (0, chai_1.expect)(result.inviteComesFromAnExternalHomeServer).to.be.equal(false);
        });
    });
    describe('#toOnDirectMessageCreatedDto()', () => {
        it('should return the invitees without the owner and with normalized invitees', () => {
            var _a;
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnDirectMessageCreatedDto('inviterId', 'roomId', [inviteeId, { _id: 'inviterId', username: 'username' }, { _id: '_id', username: 'usernameToBeInvited' }], 'domain');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                {
                    normalizedInviteeId: inviteeId.replace('@', ''),
                    inviteeUsernameOnly: (_a = inviteeId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', ''),
                    rawInviteeId: `@${inviteeId.replace('@', '')}`,
                },
                {
                    normalizedInviteeId: 'usernameToBeInvited:domain',
                    inviteeUsernameOnly: 'usernameToBeInvited',
                    rawInviteeId: '@usernameToBeInvited:domain',
                },
            ]);
        });
        it('should return the inviteComesFromAnExternalHomeServer property as true when the invite comes from an external home server', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnDirectMessageCreatedDto('@inviterId:matrix.org', 'roomId', [inviteeId, 'username'], 'domain');
            (0, chai_1.expect)(result.inviteComesFromAnExternalHomeServer).to.be.equal(true);
        });
        it('should return the inviteComesFromAnExternalHomeServer property as false when the invite comes from an external home server', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toOnDirectMessageCreatedDto('inviterId', 'roomId', [inviteeId, 'username'], 'matrix.org');
            (0, chai_1.expect)(result.inviteComesFromAnExternalHomeServer).to.be.equal(false);
        });
    });
    describe('#toBeforeDirectMessageCreatedDto()', () => {
        it('should return the invitees without the owner and with normalized invitees', () => {
            var _a;
            const result = RoomSender_1.FederationRoomSenderConverterEE.toBeforeDirectMessageCreatedDto([inviteeId, { _id: 'inviterId', username: 'username' }, { _id: '_id', username: 'usernameToBeInvited' }], 'domain');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                {
                    normalizedInviteeId: inviteeId.replace('@', ''),
                    inviteeUsernameOnly: (_a = inviteeId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', ''),
                    rawInviteeId: `@${inviteeId.replace('@', '')}`,
                },
            ]);
        });
    });
    describe('#toBeforeAddUserToARoomDto()', () => {
        it('should return the invitees correctly', () => {
            var _a;
            const result = RoomSender_1.FederationRoomSenderConverterEE.toBeforeAddUserToARoomDto([inviteeId, { _id: 'inviterId', username: 'username' }, { _id: '_id', username: 'usernameToBeInvited' }], { _id: 'roomId' }, 'domain');
            (0, chai_1.expect)(result.internalRoomId).to.be.equal('roomId');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                {
                    normalizedInviteeId: inviteeId.replace('@', ''),
                    inviteeUsernameOnly: (_a = inviteeId.split(':')[0]) === null || _a === void 0 ? void 0 : _a.replace('@', ''),
                    rawInviteeId: `@${inviteeId.replace('@', '')}`,
                },
            ]);
        });
    });
    describe('#toCreateDirectMessageDto()', () => {
        it('should return the invitees correctly', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toCreateDirectMessageDto('inviterId', [
                inviteeId,
                { _id: 'inviterId', username: 'username' },
                { _id: '_id', username: 'usernameToBeInvited' },
            ]);
            (0, chai_1.expect)(result.internalInviterId).to.be.equal('inviterId');
            (0, chai_1.expect)(result.invitees).to.be.eql([
                inviteeId,
                { _id: 'inviterId', username: 'username' },
                { _id: '_id', username: 'usernameToBeInvited' },
            ]);
        });
    });
    describe('#toJoinExternalPublicRoomDto()', () => {
        it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toJoinExternalPublicRoomDto('internalUserId', '!externalRoomId:server.com');
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!externalRoomId:server.com');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('externalRoomId');
        });
        it('should return the dto correctly', () => {
            const result = RoomSender_1.FederationRoomSenderConverterEE.toJoinExternalPublicRoomDto('internalUserId', '!externalRoomId:server.com');
            (0, chai_1.expect)(result.externalRoomId).to.be.equal('!externalRoomId:server.com');
            (0, chai_1.expect)(result.normalizedRoomId).to.be.equal('externalRoomId');
            (0, chai_1.expect)(result.internalUserId).to.be.equal('internalUserId');
            (0, chai_1.expect)(result.externalRoomHomeServerName).to.be.equal('server.com');
        });
    });
});
