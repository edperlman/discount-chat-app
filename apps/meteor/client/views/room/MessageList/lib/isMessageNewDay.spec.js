"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isMessageNewDay_1 = require("./isMessageNewDay");
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
it('should return true if the message is from a different day', () => {
    const message = Object.assign({}, baseMessage);
    const message2 = Object.assign(Object.assign({}, baseMessage), { ts: new Date('2021-10-28T00:00:00.000Z') });
    expect((0, isMessageNewDay_1.isMessageNewDay)(message, message2)).toBe(true);
});
it('should return false if the message is from the same day', () => {
    const message = Object.assign({}, baseMessage);
    const message2 = Object.assign({}, baseMessage);
    expect((0, isMessageNewDay_1.isMessageNewDay)(message, message2)).toBe(false);
});
it('should return true if there is no previous message', () => {
    const message = Object.assign({}, baseMessage);
    expect((0, isMessageNewDay_1.isMessageNewDay)(message, undefined)).toBe(true);
});
it('should return true for different days even if the range is on second', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { ts: new Date(2022, 0, 1, 23, 59, 59, 999) });
    const current = Object.assign(Object.assign({}, baseMessage), { ts: new Date(2022, 0, 2, 0, 0, 0, 0) });
    expect((0, isMessageNewDay_1.isMessageNewDay)(current, previous)).toBe(true);
});
