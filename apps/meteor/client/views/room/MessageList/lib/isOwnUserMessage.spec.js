"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isOwnUserMessage_1 = require("./isOwnUserMessage");
const MessageTypes_1 = require("../../../../../app/ui-utils/lib/MessageTypes");
const date = new Date('2021-10-27T00:00:00.000Z');
const baseMessage = {
    ts: date,
    u: {
        _id: 'userId',
        name: 'userName',
        username: 'userName',
    },
    msg: 'message',
    rid: 'roomId',
    _id: 'messageId',
    _updatedAt: date,
    urls: [],
};
// Register a system message
MessageTypes_1.MessageTypes.registerType({
    id: 'au',
    system: true,
    message: 'User_added_to',
});
it('should return true if the message is from user', () => {
    const message = Object.assign({}, baseMessage);
    const subscription = {
        u: {
            _id: 'userId',
        },
    };
    expect((0, isOwnUserMessage_1.isOwnUserMessage)(message, subscription)).toBe(true);
});
it('should return false if the message is not from user', () => {
    const message = Object.assign({}, baseMessage);
    const subscription = {
        u: {
            _id: 'otherUser',
        },
    };
    expect((0, isOwnUserMessage_1.isOwnUserMessage)(message, subscription)).toBe(false);
});
it('should return false if there is no subscription', () => {
    const message = Object.assign({}, baseMessage);
    expect((0, isOwnUserMessage_1.isOwnUserMessage)(message, undefined)).toBe(false);
});
