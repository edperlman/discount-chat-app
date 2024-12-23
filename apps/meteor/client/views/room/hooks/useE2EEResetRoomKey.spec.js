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
const mock_providers_1 = require("@rocket.chat/mock-providers");
const react_1 = require("@testing-library/react");
const useE2EEResetRoomKey_1 = require("./useE2EEResetRoomKey");
const client_1 = require("../../../../app/e2e/client");
jest.mock('../../../../app/e2e/client', () => ({
    e2e: {
        getInstanceByRoomId: jest.fn(),
    },
}));
describe('useE2EEResetRoomKey', () => {
    const e2eResetRoomKeyMock = jest.fn().mockResolvedValue({
        e2eKeyId: 'E2E_KEY_ID',
        e2eKey: 'E2E_KEY',
    });
    const resetRoomKeyMock = jest.fn();
    const roomId = 'ROOM_ID';
    afterEach(() => {
        jest.clearAllMocks();
    });
    beforeEach(() => {
        client_1.e2e.getInstanceByRoomId.mockImplementation(() => ({
            resetRoomKey: e2eResetRoomKeyMock,
        }));
    });
    it('should call resetRoomKey endpoint with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        const { result } = (0, react_1.renderHook)(() => (0, useE2EEResetRoomKey_1.useE2EEResetRoomKey)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withEndpoint('POST', '/v1/e2e.resetRoomKey', resetRoomKeyMock).build(),
        });
        yield (0, react_1.waitFor)(() => result.current.mutate({ roomId }));
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledTimes(1);
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledWith('ROOM_ID');
        expect(e2eResetRoomKeyMock).toHaveBeenCalledTimes(1);
        expect(resetRoomKeyMock).toHaveBeenCalledWith({
            rid: roomId,
            e2eKeyId: 'E2E_KEY_ID',
            e2eKey: 'E2E_KEY',
        });
        yield (0, react_1.waitFor)(() => expect(result.current.status).toBe('success'));
    }));
    it('should return an errror if e2e.getInstanceByRoomId() does not return correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        client_1.e2e.getInstanceByRoomId.mockReturnValue(null);
        const { result } = (0, react_1.renderHook)(() => (0, useE2EEResetRoomKey_1.useE2EEResetRoomKey)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withEndpoint('POST', '/v1/e2e.resetRoomKey', resetRoomKeyMock).build(),
        });
        yield (0, react_1.waitFor)(() => result.current.mutate({ roomId }));
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledTimes(1);
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledWith('ROOM_ID');
        expect(e2eResetRoomKeyMock).toHaveBeenCalledTimes(0);
        yield (0, react_1.waitFor)(() => expect(result.current.status).toBe('error'));
    }));
    it('should return an errror if e2e.resetRoomKey() does not return correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        const e2eResetRoomKeyMock = jest.fn().mockResolvedValue(null);
        const roomId = 'ROOM_ID';
        client_1.e2e.getInstanceByRoomId.mockImplementation(() => ({
            resetRoomKey: e2eResetRoomKeyMock,
        }));
        const { result } = (0, react_1.renderHook)(() => (0, useE2EEResetRoomKey_1.useE2EEResetRoomKey)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withEndpoint('POST', '/v1/e2e.resetRoomKey', resetRoomKeyMock).build(),
        });
        yield (0, react_1.waitFor)(() => result.current.mutate({ roomId }));
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledTimes(1);
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledWith('ROOM_ID');
        expect(e2eResetRoomKeyMock).toHaveBeenCalledTimes(1);
        expect(resetRoomKeyMock).toHaveBeenCalledTimes(0);
        yield (0, react_1.waitFor)(() => expect(result.current.status).toBe('error'));
    }));
    it('should return an error if resetRoomKey does not resolve', () => __awaiter(void 0, void 0, void 0, function* () {
        resetRoomKeyMock.mockRejectedValue(new Error('error-e2e-key-reset-in-progress'));
        const { result } = (0, react_1.renderHook)(() => (0, useE2EEResetRoomKey_1.useE2EEResetRoomKey)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withEndpoint('POST', '/v1/e2e.resetRoomKey', resetRoomKeyMock).build(),
        });
        yield (0, react_1.waitFor)(() => result.current.mutate({ roomId }));
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledTimes(1);
        expect(client_1.e2e.getInstanceByRoomId).toHaveBeenCalledWith('ROOM_ID');
        expect(e2eResetRoomKeyMock).toHaveBeenCalledTimes(1);
        expect(resetRoomKeyMock).toHaveBeenCalledWith({
            rid: roomId,
            e2eKeyId: 'E2E_KEY_ID',
            e2eKey: 'E2E_KEY',
        });
        yield (0, react_1.waitFor)(() => expect(result.current.status).toBe('error'));
    }));
});
