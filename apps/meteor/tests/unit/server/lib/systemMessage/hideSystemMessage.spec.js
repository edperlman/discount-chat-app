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
const hideSystemMessage_1 = require("../../../../../server/lib/systemMessage/hideSystemMessage");
describe('hideSystemMessage', () => {
    describe('isMutedUnmuted', () => {
        it('should return true for user-muted', () => {
            (0, chai_1.expect)((0, hideSystemMessage_1.isMutedUnmuted)('user-muted')).to.be.true;
        });
        it('should return true for user-unmuted', () => {
            (0, chai_1.expect)((0, hideSystemMessage_1.isMutedUnmuted)('user-unmuted')).to.be.true;
        });
        it('should return false for other message types', () => {
            (0, chai_1.expect)((0, hideSystemMessage_1.isMutedUnmuted)('some-other-type')).to.be.false;
        });
    });
    describe('shouldHideSystemMessage', () => {
        it('should return true if message type is in hidden system messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const hiddenMessages = ['user-muted', 'mute_unmute'];
            const result = (0, hideSystemMessage_1.shouldHideSystemMessage)('user-muted', hiddenMessages);
            (0, chai_1.expect)(result).to.be.true;
        }));
        it('should return true if message type is user-muted and mute_unmute is in hidden system messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const hiddenMessages = ['mute_unmute'];
            const result = (0, hideSystemMessage_1.shouldHideSystemMessage)('user-muted', hiddenMessages);
            (0, chai_1.expect)(result).to.be.true;
        }));
        it('should return false if message type is not in hidden system messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const hiddenMessages = ['room-archived'];
            const result = (0, hideSystemMessage_1.shouldHideSystemMessage)('user-muted', hiddenMessages);
            (0, chai_1.expect)(result).to.be.false;
        }));
        it('should return false if hidden system messages are undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = (0, hideSystemMessage_1.shouldHideSystemMessage)('user-muted', undefined);
            (0, chai_1.expect)(result).to.be.false;
        }));
    });
});
