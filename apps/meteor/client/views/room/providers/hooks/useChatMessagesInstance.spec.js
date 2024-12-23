"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("@testing-library/react");
const useChatMessagesInstance_1 = require("./useChatMessagesInstance");
const E2ERoomState_1 = require("../../../../../app/e2e/client/E2ERoomState");
const ChatMessages_1 = require("../../../../../app/ui/client/lib/ChatMessages");
const EmojiPickerContext_1 = require("../../../../contexts/EmojiPickerContext");
const useUiKitActionManager_1 = require("../../../../uikit/hooks/useUiKitActionManager");
const RoomContext_1 = require("../../contexts/RoomContext");
const useE2EERoomState_1 = require("../../hooks/useE2EERoomState");
jest.mock('@rocket.chat/ui-contexts', () => ({
    useUserId: jest.fn(),
}));
jest.mock('../../contexts/RoomContext', () => ({
    useRoomSubscription: jest.fn(),
}));
jest.mock('../../../../uikit/hooks/useUiKitActionManager', () => ({
    useUiKitActionManager: jest.fn(),
}));
jest.mock('../../hooks/useE2EERoomState', () => ({
    useE2EERoomState: jest.fn(),
}));
jest.mock('../../../../contexts/EmojiPickerContext', () => ({
    useEmojiPicker: jest.fn(),
}));
const updateSubscriptionMock = jest.fn();
jest.mock('../../../../../app/ui/client/lib/ChatMessages', () => {
    return {
        ChatMessages: jest.fn().mockImplementation(() => {
            return {
                release: jest.fn(),
                readStateManager: {
                    updateSubscription: updateSubscriptionMock,
                },
            };
        }),
    };
});
describe('useChatMessagesInstance', () => {
    let mockUid;
    let mockSubscription;
    let mockActionManager;
    let mockE2EERoomState;
    let mockEmojiPicker;
    beforeEach(() => {
        jest.clearAllMocks();
        mockUid = 'mockUid';
        mockSubscription = {
            u: {
                _id: mockUid,
                username: 'usernameMock',
                name: 'nameMock',
            },
            t: 'p',
            rid: 'roomId',
        };
        mockActionManager = undefined;
        mockE2EERoomState = E2ERoomState_1.E2ERoomState.READY;
        mockEmojiPicker = {
            open: jest.fn(),
            isOpen: false,
            close: jest.fn(),
        };
        ui_contexts_1.useUserId.mockReturnValue(mockUid);
        RoomContext_1.useRoomSubscription.mockReturnValue(mockSubscription);
        useUiKitActionManager_1.useUiKitActionManager.mockReturnValue(mockActionManager);
        useE2EERoomState_1.useE2EERoomState.mockReturnValue(mockE2EERoomState);
        EmojiPickerContext_1.useEmojiPicker.mockReturnValue(mockEmojiPicker);
    });
    it('should initialize ChatMessages instance with correct arguments', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useChatMessagesInstance_1.useChatMessagesInstance)({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            encrypted: false,
        }), { legacyRoot: true });
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(1);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(1);
    });
    it('should update ChatMessages subscription', () => {
        const { result, rerender } = (0, react_1.renderHook)(() => (0, useChatMessagesInstance_1.useChatMessagesInstance)({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            encrypted: false,
        }), { legacyRoot: true });
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(1);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(1);
        RoomContext_1.useRoomSubscription.mockReturnValue(Object.assign(Object.assign({}, mockSubscription), { rid: 'newRoomId' }));
        rerender();
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(1);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(2);
    });
    it('should update ChatMessages instance when dependencies changes', () => {
        const { result, rerender } = (0, react_1.renderHook)(() => (0, useChatMessagesInstance_1.useChatMessagesInstance)({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            encrypted: false,
        }), { legacyRoot: true });
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(1);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(1);
        useE2EERoomState_1.useE2EERoomState.mockReturnValue(E2ERoomState_1.E2ERoomState.WAITING_KEYS);
        rerender();
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(2);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(2);
    });
    it('should update ChatMessages instance when hook props changes', () => {
        const initialProps = {
            rid: mockSubscription.rid,
            tmid: 'threadId',
            encrypted: false,
        };
        const { result, rerender } = (0, react_1.renderHook)((props = initialProps) => (0, useChatMessagesInstance_1.useChatMessagesInstance)(props), { legacyRoot: true });
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(1);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(1);
        rerender({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            encrypted: true,
        });
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledWith({
            rid: mockSubscription.rid,
            tmid: 'threadId',
            uid: mockUid,
            actionManager: mockActionManager,
        });
        expect(result.current.emojiPicker).toBe(mockEmojiPicker);
        expect(updateSubscriptionMock).toHaveBeenCalledTimes(2);
        expect(ChatMessages_1.ChatMessages).toHaveBeenCalledTimes(2);
    });
});
