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
const core_typings_1 = require("@rocket.chat/core-typings");
const react_1 = require("@testing-library/react");
const useDecryptedMessage_1 = require("./useDecryptedMessage");
const rocketchat_e2e_1 = require("../../app/e2e/client/rocketchat.e2e");
// Mock the dependencies
jest.mock('@rocket.chat/core-typings', () => ({
    isE2EEMessage: jest.fn(),
}));
jest.mock('../../app/e2e/client/rocketchat.e2e', () => ({
    e2e: {
        decryptMessage: jest.fn(),
    },
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
describe('useDecryptedMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return the original message for non-E2EE messages', () => {
        core_typings_1.isE2EEMessage.mockReturnValue(false);
        const message = { msg: 'Hello, world!' };
        const { result } = (0, react_1.renderHook)(() => (0, useDecryptedMessage_1.useDecryptedMessage)(message), { legacyRoot: true });
        expect(result.current).toBe('Hello, world!');
        expect(rocketchat_e2e_1.e2e.decryptMessage).not.toHaveBeenCalled();
    });
    it('should return decrypted message for E2EE messages', () => __awaiter(void 0, void 0, void 0, function* () {
        core_typings_1.isE2EEMessage.mockReturnValue(true);
        rocketchat_e2e_1.e2e.decryptMessage.mockResolvedValue({ msg: 'Decrypted message' });
        const message = { msg: 'Encrypted message' };
        const { result } = (0, react_1.renderHook)(() => (0, useDecryptedMessage_1.useDecryptedMessage)(message), { legacyRoot: true });
        yield (0, react_1.waitFor)(() => {
            expect(result.current).not.toBe('E2E_message_encrypted_placeholder');
        });
        expect(result.current).toBe('Decrypted message');
        expect(rocketchat_e2e_1.e2e.decryptMessage).toHaveBeenCalledWith(message);
    }));
    it('should handle E2EE messages with attachments', () => __awaiter(void 0, void 0, void 0, function* () {
        core_typings_1.isE2EEMessage.mockReturnValue(true);
        rocketchat_e2e_1.e2e.decryptMessage.mockResolvedValue({
            attachments: [{ description: 'Attachment description' }],
        });
        const message = { msg: 'Encrypted message with attachment' };
        const { result } = (0, react_1.renderHook)(() => (0, useDecryptedMessage_1.useDecryptedMessage)(message), { legacyRoot: true });
        yield (0, react_1.waitFor)(() => {
            expect(result.current).toBe('E2E_message_encrypted_placeholder');
        });
        expect(result.current).toBe('Attachment description');
        expect(rocketchat_e2e_1.e2e.decryptMessage).toHaveBeenCalledWith(message);
    }));
    it('should handle E2EE messages with attachments but no description', () => __awaiter(void 0, void 0, void 0, function* () {
        core_typings_1.isE2EEMessage.mockReturnValue(true);
        rocketchat_e2e_1.e2e.decryptMessage.mockResolvedValue({
            attachments: [{}],
        });
        const message = { msg: 'Encrypted message with attachment' };
        const { result } = (0, react_1.renderHook)(() => (0, useDecryptedMessage_1.useDecryptedMessage)(message), { legacyRoot: true });
        yield (0, react_1.waitFor)(() => {
            expect(result.current).toBe('E2E_message_encrypted_placeholder');
        });
        expect(result.current).toBe('Message_with_attachment');
        expect(rocketchat_e2e_1.e2e.decryptMessage).toHaveBeenCalledWith(message);
    }));
});
