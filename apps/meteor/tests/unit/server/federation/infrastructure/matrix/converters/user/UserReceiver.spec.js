"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const UserReceiverDto_1 = require("../../../../../../../../server/services/federation/application/room/input/UserReceiverDto");
const UserReceiver_1 = require("../../../../../../../../server/services/federation/infrastructure/matrix/converters/user/UserReceiver");
describe('Federation - Infrastructure - Matrix - MatrixUserReceiverConverter', () => {
    describe('#toUserTypingDto()', () => {
        const event = {
            content: { user_ids: ['id'] },
            room_id: '!roomId:matrix.org',
        };
        it('should return an instance of FederationUserTypingStatusEventDto', () => {
            (0, chai_1.expect)(UserReceiver_1.MatrixUserReceiverConverter.toUserTypingDto(event)).to.be.instanceOf(UserReceiverDto_1.FederationUserTypingStatusEventDto);
        });
        it('should convert the event properly', () => {
            const result = UserReceiver_1.MatrixUserReceiverConverter.toUserTypingDto(event);
            (0, chai_1.expect)(result).to.be.eql({
                externalEventId: '',
                externalRoomId: event.room_id,
                externalUserIdsTyping: event.content.user_ids,
                normalizedRoomId: 'roomId',
            });
        });
    });
});
