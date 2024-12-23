"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isMessageSequential_1 = require("./isMessageSequential");
const MessageTypes_1 = require("../../../../../app/ui-utils/lib/MessageTypes");
const TIME_RANGE_IN_SECONDS = 300;
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
it('should return false if no previous message', () => {
    const current = Object.assign({}, baseMessage);
    expect((0, isMessageSequential_1.isMessageSequential)(current, undefined, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it("should return false if both messages doesn't belong to the same user", () => {
    const previous = Object.assign({}, baseMessage);
    const current = Object.assign(Object.assign({}, baseMessage), { u: {
            _id: 'userId2',
            name: 'userName2',
            username: 'userName2',
        } });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return false if both messages belongs to the same user but have more than five minutes of difference', () => {
    const previous = Object.assign({}, baseMessage);
    const current = Object.assign(Object.assign({}, previous), { ts: new Date('2021-10-27T00:05:00.001Z') });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return true if both messages belongs to the same user and have less than five minutes of difference', () => {
    const previous = Object.assign({}, baseMessage);
    const current = Object.assign(Object.assign({}, previous), { ts: new Date('2021-10-27T00:04:59.999Z') });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(true);
});
it('should return false if message are not groupable', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { groupable: false });
    const current = Object.assign(Object.assign({}, previous), { groupable: false });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return false if both messages are not from the same thread', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { tmid: 'threadId' });
    const current = Object.assign(Object.assign({}, previous), { tmid: 'threadId2' });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return true if both messages are from the same thread same user and bellow the time range', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { tmid: 'threadId' });
    const current = Object.assign(Object.assign({}, previous), { tmid: 'threadId' });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(true);
});
it('should return false if previous message is thread message but the current is a regular one', () => {
    const previous = Object.assign({ tmid: 'threadId' }, baseMessage);
    const current = Object.assign({}, baseMessage);
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return true if message is a reply from a previous message', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { _id: 'threadId' });
    const current = Object.assign(Object.assign({}, previous), { tmid: 'threadId' });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(true);
});
it("should return false if both messages don't have the same alias", () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { alias: 'alias' });
    const current = Object.assign(Object.assign({}, previous), { alias: 'alias2' });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return false if message is from system', () => {
    MessageTypes_1.MessageTypes.registerType({
        id: 'au',
        system: true,
        message: 'User_added_by',
    });
    const previous = Object.assign({}, baseMessage);
    const current = Object.assign(Object.assign({}, previous), { ts: new Date('2021-10-27T00:04:59.999Z'), t: 'au' });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
it('should return false even if messages should be sequential, but they are from a different day', () => {
    const previous = Object.assign(Object.assign({}, baseMessage), { ts: new Date(2022, 0, 1, 23, 59, 59, 999) });
    const current = Object.assign(Object.assign({}, baseMessage), { ts: new Date(2022, 0, 2, 0, 0, 0, 0) });
    expect((0, isMessageSequential_1.isMessageSequential)(current, previous, TIME_RANGE_IN_SECONDS)).toBe(false);
});
