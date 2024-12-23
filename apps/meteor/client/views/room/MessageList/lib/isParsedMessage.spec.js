"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isParsedMessage_1 = require("./isParsedMessage");
const date = new Date('2021-10-27T00:00:00.000Z');
const baseMessage = {
    ts: date,
    u: {
        _id: 'userId',
        name: 'userName',
        username: 'userName',
    },
    msg: 'message',
    md: [
        {
            type: 'PARAGRAPH',
            value: [
                {
                    type: 'PLAIN_TEXT',
                    value: 'message',
                },
            ],
        },
    ],
    rid: 'roomId',
    _id: 'messageId',
    _updatedAt: date,
    urls: [],
};
it('should return true if the message parsed', () => {
    const message = Object.assign({}, baseMessage);
    expect((0, isParsedMessage_1.isParsedMessage)(message.md)).toBe(true);
});
it('should return false if the message is not parsed', () => {
    const message = Object.assign({}, baseMessage);
    expect((0, isParsedMessage_1.isParsedMessage)(message.msg)).toBe(false);
});
