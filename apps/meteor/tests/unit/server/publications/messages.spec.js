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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const mockMeteorError = class extends Error {
    constructor(error, reason, details) {
        super(reason);
        this.error = error;
        this.reason = reason;
        this.details = details;
        this.name = 'Meteor.Error';
    }
};
const messagesMock = {
    findForUpdates: sinon_1.default.stub(),
    trashFindDeletedAfter: sinon_1.default.stub(),
    trashFind: sinon_1.default.stub(),
};
const { extractTimestampFromCursor, mountCursorQuery, mountCursorFromMessage, mountNextCursor, mountPreviousCursor, handleWithoutPagination, handleCursorPagination, } = proxyquire_1.default.noCallThru().load('../../../../server/publications/messages', {
    'meteor/check': {
        check: sinon_1.default.stub(),
    },
    'meteor/meteor': {
        'Meteor': {
            methods: sinon_1.default.stub(),
            Error: mockMeteorError,
        },
        '@global': true,
    },
    '@rocket.chat/models': {
        Messages: messagesMock,
    },
});
(0, mocha_1.describe)('extractTimestampFromCursor', () => {
    (0, mocha_1.it)('should return the correct timestamp', () => {
        const cursor = new Date('2024-01-01T00:00:00.000Z').getTime().toString();
        const timestamp = extractTimestampFromCursor(cursor);
        (0, chai_1.expect)(timestamp).to.be.an.instanceOf(Date);
        (0, chai_1.expect)(timestamp.getTime()).to.equal(parseInt(cursor, 10));
    });
    (0, mocha_1.it)('should handle non-date compliant string', () => {
        (0, chai_1.expect)(() => extractTimestampFromCursor('not-a-date')).to.throw(Error, 'Invalid Date');
    });
});
(0, mocha_1.describe)('mountCursorQuery', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z').getTime();
    (0, mocha_1.it)('should return a query with $gt when next is provided', () => {
        const result = mountCursorQuery({ next: mockDate.toString() });
        (0, chai_1.expect)(result.query).to.deep.equal({ $gt: new Date(mockDate) });
    });
    (0, mocha_1.it)('should return a query with $lt when previous is provided', () => {
        const result = mountCursorQuery({ previous: mockDate.toString() });
        (0, chai_1.expect)(result.query).to.deep.equal({ $lt: new Date(mockDate) });
    });
    (0, mocha_1.it)('should return a query with $gt and sort when neither next nor previous is provided', () => {
        const result = mountCursorQuery({ count: 10 });
        (0, chai_1.expect)(result.query).to.deep.equal({ $gt: new Date(0) });
        (0, chai_1.expect)(result.options).to.deep.equal({ sort: { _updatedAt: 1 } });
    });
    (0, mocha_1.it)('should return a query with $gt and ascending sort when next is provided', () => {
        const result = mountCursorQuery({ next: mockDate.toString(), count: 10 });
        (0, chai_1.expect)(result.query).to.deep.equal({ $gt: new Date(mockDate) });
        (0, chai_1.expect)(result.options).to.deep.equal({ sort: { _updatedAt: 1 }, limit: 10 + 1 });
    });
    (0, mocha_1.it)('should return a query with $gt and descending sort when previous is provided', () => {
        const result = mountCursorQuery({ previous: mockDate.toString(), count: 10 });
        (0, chai_1.expect)(result.query).to.deep.equal({ $lt: new Date(mockDate) });
        (0, chai_1.expect)(result.options).to.deep.equal({ sort: { _updatedAt: -1 }, limit: 10 + 1 });
    });
});
(0, mocha_1.describe)('mountCursorFromMessage', () => {
    (0, mocha_1.it)('should return the updated timestamp for UPDATED type', () => {
        const message = {
            _updatedAt: new Date('2024-01-01T00:00:00Z'),
        };
        const result = mountCursorFromMessage(message, 'UPDATED');
        (0, chai_1.expect)(result).to.equal(`${message._updatedAt.getTime()}`);
    });
    (0, mocha_1.it)('should return the deleted timestamp for DELETED type', () => {
        const message = {
            _deletedAt: new Date('2024-01-01T00:00:00Z'),
        };
        const result = mountCursorFromMessage(message, 'DELETED');
        (0, chai_1.expect)(result).to.equal(`${message._deletedAt.getTime()}`);
    });
    (0, mocha_1.it)('should throw an error if DELETED type and _deletedAt is not present', () => {
        const message = {
            _updatedAt: new Date('2024-01-01T00:00:00Z'),
        };
        (0, chai_1.expect)(() => mountCursorFromMessage(message, 'DELETED')).to.throw(mockMeteorError, 'Cursor not found');
    });
});
(0, mocha_1.describe)('mountNextCursor', () => {
    const mockMessage = (timestamp) => ({
        _id: '1',
        ts: new Date(timestamp),
        _updatedAt: new Date(timestamp),
    });
    (0, mocha_1.it)('should return null if messages array is empty', () => {
        (0, chai_1.expect)(mountNextCursor([], 10, 'UPDATED')).to.be.null;
    });
    (0, mocha_1.it)('should return the first message cursor if previous is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000)];
        (0, chai_1.expect)(mountNextCursor(messages, 10, 'UPDATED', undefined, 'prev')).to.equal('1000');
    });
    (0, mocha_1.it)('should return null if messages length is less than or equal to count and next is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000)];
        (0, chai_1.expect)(mountNextCursor(messages, 2, 'UPDATED', 'next')).to.be.null;
    });
    (0, mocha_1.it)('should return the second last message cursor if messages length is greater than count and next is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000), mockMessage(3000)];
        (0, chai_1.expect)(mountNextCursor(messages, 2, 'UPDATED', 'next')).to.equal('2000');
    });
    (0, mocha_1.it)('should return the last message cursor if no next or previous is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000)];
        (0, chai_1.expect)(mountNextCursor(messages, 10, 'UPDATED')).to.equal('2000');
    });
});
(0, mocha_1.describe)('mountPreviousCursor', () => {
    const mockMessage = (timestamp) => ({
        _id: '1',
        ts: new Date(timestamp),
        _updatedAt: new Date(timestamp),
    });
    (0, mocha_1.it)('should return null if messages array is empty', () => {
        (0, chai_1.expect)(mountPreviousCursor([], 10, 'UPDATED')).to.be.null;
    });
    (0, mocha_1.it)('should return the first message cursor if messages length is less than or equal to count and next is provided', () => {
        const messages = [mockMessage(1000)];
        (0, chai_1.expect)(mountPreviousCursor(messages, 1, 'UPDATED', 'nextCursor')).to.equal('1000');
    });
    (0, mocha_1.it)('should return the first message cursor if messages length is greater than count and next is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000)];
        (0, chai_1.expect)(mountPreviousCursor(messages, 1, 'UPDATED', 'nextCursor')).to.equal('1000');
    });
    (0, mocha_1.it)('should return null if messages length is less than or equal to count and previous is provided', () => {
        const messages = [mockMessage(1000)];
        (0, chai_1.expect)(mountPreviousCursor(messages, 1, 'UPDATED', undefined, 'previousCursor')).to.be.null;
    });
    (0, mocha_1.it)('should return the second last message cursor if messages length is greater than count and previous is provided', () => {
        const messages = [mockMessage(1000), mockMessage(2000), mockMessage(3000)];
        (0, chai_1.expect)(mountPreviousCursor(messages, 2, 'UPDATED', undefined, 'previousCursor')).to.equal('2000');
    });
    (0, mocha_1.it)('should return the first message cursor if no next or previous is provided', () => {
        const messages = [mockMessage(1000)];
        (0, chai_1.expect)(mountPreviousCursor(messages, 1, 'UPDATED')).to.equal('1000');
    });
});
(0, mocha_1.describe)('handleWithoutPagination', () => {
    afterEach(() => {
        messagesMock.findForUpdates.reset();
        messagesMock.trashFindDeletedAfter.reset();
    });
    (0, mocha_1.it)('should return updated and deleted messages', () => __awaiter(void 0, void 0, void 0, function* () {
        const rid = 'roomId';
        const lastUpdate = new Date();
        const updatedMessages = [{ _id: '1', text: 'Hello' }];
        const deletedMessages = [{ _id: '2', _deletedAt: new Date() }];
        messagesMock.findForUpdates.returns({ toArray: sinon_1.default.stub().resolves(updatedMessages) });
        messagesMock.trashFindDeletedAfter.returns({ toArray: sinon_1.default.stub().resolves(deletedMessages) });
        const result = yield handleWithoutPagination(rid, lastUpdate);
        (0, chai_1.expect)(result).to.deep.equal({
            updated: updatedMessages,
            deleted: deletedMessages,
        });
        sinon_1.default.assert.calledWith(messagesMock.findForUpdates, rid, { $gt: lastUpdate }, { sort: { ts: -1 } });
        sinon_1.default.assert.calledWith(messagesMock.trashFindDeletedAfter, lastUpdate, { rid }, { projection: { _id: 1, _deletedAt: 1 }, sort: { ts: -1 } });
    }));
    (0, mocha_1.it)('should handle empty results', () => __awaiter(void 0, void 0, void 0, function* () {
        const rid = 'roomId';
        const lastUpdate = new Date();
        messagesMock.findForUpdates.returns({ toArray: sinon_1.default.stub().resolves([]) });
        messagesMock.trashFindDeletedAfter.returns({ toArray: sinon_1.default.stub().resolves([]) });
        const result = yield handleWithoutPagination(rid, lastUpdate);
        (0, chai_1.expect)(result).to.deep.equal({
            updated: [],
            deleted: [],
        });
    }));
});
(0, mocha_1.describe)('handleCursorPagination', () => {
    (0, mocha_1.it)('should return updated messages and cursor when type is UPDATED', () => __awaiter(void 0, void 0, void 0, function* () {
        const rid = 'roomId';
        const count = 10;
        const messages = [{ _id: 'msg1', _updatedAt: new Date('2024-01-01T00:00:00Z') }];
        messagesMock.findForUpdates.returns({ toArray: sinon_1.default.stub().resolves(messages) });
        const result = yield handleCursorPagination('UPDATED', rid, count);
        (0, chai_1.expect)(messagesMock.findForUpdates.calledOnce).to.be.true;
        (0, chai_1.expect)(result.updated).to.deep.equal(messages);
        (0, chai_1.expect)(result.cursor).to.have.keys(['next', 'previous']);
    }));
    (0, mocha_1.it)('should return deleted messages and cursor when type is DELETED', () => __awaiter(void 0, void 0, void 0, function* () {
        const rid = 'roomId';
        const count = 10;
        const messages = [{ _id: 'msg1', _deletedAt: new Date() }];
        messagesMock.trashFind.returns({ toArray: sinon_1.default.stub().resolves(messages) });
        const result = yield handleCursorPagination('DELETED', rid, count);
        (0, chai_1.expect)(messagesMock.trashFind.calledOnce).to.be.true;
        (0, chai_1.expect)(result.deleted).to.deep.equal(messages);
        (0, chai_1.expect)(result.cursor).to.have.keys(['next', 'previous']);
    }));
    (0, mocha_1.it)('should handle empty response correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const rid = 'roomId';
        const count = 10;
        messagesMock.findForUpdates.returns({ toArray: sinon_1.default.stub().resolves([]) });
        const result = yield handleCursorPagination('UPDATED', rid, count);
        (0, chai_1.expect)(result.updated).to.deep.equal([]);
        (0, chai_1.expect)(result.cursor).to.deep.equal({ next: null, previous: null });
    }));
});
