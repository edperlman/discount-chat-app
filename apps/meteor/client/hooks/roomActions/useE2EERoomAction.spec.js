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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("@testing-library/react");
const E2EEState_1 = require("../../../app/e2e/client/E2EEState");
const rocketchat_e2e_1 = require("../../../app/e2e/client/rocketchat.e2e");
const OtrRoomState_1 = require("../../../app/otr/lib/OtrRoomState");
const imperativeModal_1 = require("../../lib/imperativeModal");
const toast_1 = require("../../lib/toast");
const RoomContext_1 = require("../../views/room/contexts/RoomContext");
const useE2EEState_1 = require("../../views/room/hooks/useE2EEState");
const useOTR_1 = require("../useOTR");
const useE2EERoomAction_1 = require("./useE2EERoomAction");
jest.mock('@rocket.chat/ui-contexts', () => ({
    useSetting: jest.fn(),
    usePermission: jest.fn(),
    useEndpoint: jest.fn(),
}));
jest.mock('../../lib/toast', () => ({
    dispatchToastMessage: jest.fn(),
}));
jest.mock('../../lib/imperativeModal', () => ({
    imperativeModal: {
        open: jest.fn(),
        close: jest.fn(),
    },
}));
jest.mock('../../views/room/contexts/RoomContext', () => ({
    useRoom: jest.fn(),
    useRoomSubscription: jest.fn(),
}));
jest.mock('../useOTR', () => ({
    useOTR: jest.fn(),
}));
jest.mock('../../../app/e2e/client/rocketchat.e2e', () => ({
    e2e: {
        isReady: jest.fn(),
    },
}));
jest.mock('../../views/room/hooks/useE2EEState', () => ({
    useE2EEState: jest.fn(),
}));
jest.mock('../../views/room/hooks/useE2EERoomState', () => ({
    useE2EERoomState: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
jest.mock('meteor/tracker', () => ({
    Tracker: {
        autorun: jest.fn(),
    },
}));
describe('useE2EERoomAction', () => {
    const mockRoom = { _id: 'roomId', encrypted: false, t: 'd', name: 'Test Room' };
    const mockSubscription = { autoTranslate: false };
    beforeEach(() => {
        ui_contexts_1.useSetting.mockReturnValue(true);
        RoomContext_1.useRoom.mockReturnValue(mockRoom);
        RoomContext_1.useRoomSubscription.mockReturnValue(mockSubscription);
        useE2EEState_1.useE2EEState.mockReturnValue(E2EEState_1.E2EEState.READY);
        ui_contexts_1.usePermission.mockReturnValue(true);
        ui_contexts_1.useEndpoint.mockReturnValue(jest.fn().mockResolvedValue({ success: true }));
        rocketchat_e2e_1.e2e.isReady.mockReturnValue(true);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should dispatch error toast message when otrState is ESTABLISHED', () => __awaiter(void 0, void 0, void 0, function* () {
        useOTR_1.useOTR.mockReturnValue({ otrState: OtrRoomState_1.OtrRoomState.ESTABLISHED });
        const { result } = (0, react_1.renderHook)(() => (0, useE2EERoomAction_1.useE2EERoomAction)(), { legacyRoot: true });
        yield (0, react_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            yield ((_b = (_a = result === null || result === void 0 ? void 0 : result.current) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.call(_a));
        }));
        expect(toast_1.dispatchToastMessage).toHaveBeenCalledWith({ type: 'error', message: 'E2EE_not_available_OTR' });
    }));
    it('should dispatch error toast message when otrState is ESTABLISHING', () => __awaiter(void 0, void 0, void 0, function* () {
        useOTR_1.useOTR.mockReturnValue({ otrState: OtrRoomState_1.OtrRoomState.ESTABLISHING });
        const { result } = (0, react_1.renderHook)(() => (0, useE2EERoomAction_1.useE2EERoomAction)(), { legacyRoot: true });
        (0, react_1.act)(() => {
            var _a, _b;
            (_b = (_a = result === null || result === void 0 ? void 0 : result.current) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
        yield (0, react_1.waitFor)(() => expect(toast_1.dispatchToastMessage).toHaveBeenCalledWith({ type: 'error', message: 'E2EE_not_available_OTR' }));
    }));
    it('should dispatch error toast message when otrState is REQUESTED', () => __awaiter(void 0, void 0, void 0, function* () {
        useOTR_1.useOTR.mockReturnValue({ otrState: OtrRoomState_1.OtrRoomState.REQUESTED });
        const { result } = (0, react_1.renderHook)(() => (0, useE2EERoomAction_1.useE2EERoomAction)(), { legacyRoot: true });
        (0, react_1.act)(() => {
            var _a, _b;
            (_b = (_a = result === null || result === void 0 ? void 0 : result.current) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
        yield (0, react_1.waitFor)(() => expect(toast_1.dispatchToastMessage).toHaveBeenCalledWith({ type: 'error', message: 'E2EE_not_available_OTR' }));
    }));
    it('should open Enable E2EE confirmation modal', () => __awaiter(void 0, void 0, void 0, function* () {
        useOTR_1.useOTR.mockReturnValue({ otrState: OtrRoomState_1.OtrRoomState.NOT_STARTED });
        const { result } = (0, react_1.renderHook)(() => (0, useE2EERoomAction_1.useE2EERoomAction)(), { legacyRoot: true });
        (0, react_1.act)(() => {
            var _a, _b;
            (_b = (_a = result === null || result === void 0 ? void 0 : result.current) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
        yield (0, react_1.waitFor)(() => expect(imperativeModal_1.imperativeModal.open).toHaveBeenCalledTimes(1));
    }));
});
