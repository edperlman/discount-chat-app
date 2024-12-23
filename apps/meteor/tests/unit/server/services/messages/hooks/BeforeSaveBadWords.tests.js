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
const chai_1 = require("chai");
const BeforeSaveBadWords_1 = require("../../../../../../server/services/messages/hooks/BeforeSaveBadWords");
const createMessage = (msg) => ({
    _id: 'random',
    rid: 'GENERAL',
    ts: new Date(),
    u: {
        _id: 'userId',
        username: 'username',
    },
    _updatedAt: new Date(),
    msg: msg,
});
describe('Filter bad words before saving message', () => {
    it('should return same message if bad words not configured', () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        const message = createMessage('hell');
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.be.equal('hell');
    }));
    it("should return same message if no 'msg' property provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        const message = createMessage();
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.be.equal(undefined);
    }));
    it('should return filter bad words from message when configured', () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        yield badWords.configure();
        const message = createMessage('hell');
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.equal('****');
    }));
    it('should return same message if bad words disabled after configured', () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        yield badWords.configure();
        badWords.disable();
        const message = createMessage('hell');
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.be.equal('hell');
    }));
    it('should filter custom bad words', () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        yield badWords.configure('good');
        const message = createMessage('good');
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.be.equal('****');
    }));
    it('should allow custom good words', () => __awaiter(void 0, void 0, void 0, function* () {
        const badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
        yield badWords.configure(undefined, 'hell');
        const message = createMessage('hell');
        const result = yield badWords.filterBadWords({ message });
        return (0, chai_1.expect)(result.msg).to.be.equal('hell');
    }));
});
