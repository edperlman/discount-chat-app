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
const mocha_1 = require("mocha");
const messageContainsHighlight_1 = require("../../../../../../../app/lib/server/functions/notifications/messageContainsHighlight");
(0, mocha_1.describe)('messageContainsHighlight', () => {
    (0, mocha_1.it)('should return false for no highlights', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, [])).to.be.false;
    }));
    (0, mocha_1.it)('should return true when find a highlight in the beggining of the message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['highlighted'])).to.be.true;
    }));
    (0, mocha_1.it)('should return true when find a highlight in the end of the message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['message'])).to.be.true;
    }));
    (0, mocha_1.it)('should return false if the highlight is just part of the word', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['light'])).to.be.false;
    }));
    (0, mocha_1.it)('should return true if find one of the multiple highlights', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['high', 'ssage', 'regular', 'light'])).to.be.true;
    }));
    (0, mocha_1.it)('should return true if highlight case not match', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted regular message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['ReGuLaR'])).to.be.true;
    }));
    (0, mocha_1.it)('should return false if the highlight word is an emoji', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted :thumbsup: message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['thumbsup'])).to.be.false;
    }));
    (0, mocha_1.it)('should return true for a highlight word beggining with :', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted :thumbsup message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['thumbsup'])).to.be.true;
    }));
    (0, mocha_1.it)('should return true for a highlight word ending with :', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            msg: 'highlighted thumbsup: message',
        };
        (0, chai_1.expect)((0, messageContainsHighlight_1.messageContainsHighlight)(message, ['thumbsup'])).to.be.true;
    }));
});
