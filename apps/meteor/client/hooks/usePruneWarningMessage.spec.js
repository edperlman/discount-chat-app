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
const react_1 = require("@testing-library/react");
const usePruneWarningMessage_1 = require("./usePruneWarningMessage");
const mockRetentionPolicySettings_1 = require("../../tests/mocks/client/mockRetentionPolicySettings");
const data_1 = require("../../tests/mocks/data");
jest.useFakeTimers();
const getRetentionRoomProps = (props = {}) => {
    return {
        retention: Object.assign({ enabled: true, overrideGlobal: true, maxAge: 30, filesOnly: false, excludePinned: false, ignoreThreads: false }, props),
    };
};
// Warning: The dates are formated using date-fns/intlFormat, which itself uses the JS Intl API
// The resulting formatted date can change depending on node version. These tests may break or the results
// may be different when running on the browser.
beforeEach(() => {
    jest.setSystemTime(new Date(2024, 5, 1, 0, 0, 0));
});
describe('usePruneWarningMessage hook', () => {
    describe('Cron timer and precision', () => {
        it('Should update the message after the nextRunDate has passaed', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                }),
            });
            expect(result.current).toEqual('a minute June 1, 2024 at 12:30 AM');
            jest.advanceTimersByTime(31 * 60 * 1000);
            expect(result.current).toEqual('a minute June 1, 2024 at 1:00 AM');
        }));
        it('Should return the default warning with precision set to every_hour', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    precision: '1',
                }),
            });
            expect(result.current).toEqual('a minute June 1, 2024 at 1:00 AM');
        });
        it('Should return the default warning with precision set to every_six_hours', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    precision: '2',
                }),
            });
            expect(result.current).toEqual('a minute June 1, 2024 at 6:00 AM');
        });
        it('Should return the default warning with precision set to every_day', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    precision: '3',
                }),
            });
            expect(result.current).toEqual('a minute June 2, 2024 at 12:00 AM');
        });
        it('Should return the default warning with advanced precision', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    advancedPrecision: true,
                    advancedPrecisionCron: '0 0 1 */1 *',
                }),
            });
            expect(result.current).toEqual('a minute July 1, 2024 at 12:00 AM');
        });
    });
    describe('No override', () => {
        it('Should return the default warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                }),
            });
            expect(result.current).toEqual('a minute June 1, 2024 at 12:30 AM');
        });
        it('Should return the unpinned messages warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    doNotPrunePinned: true,
                }),
            });
            expect(result.current).toEqual('Unpinned a minute June 1, 2024 at 12:30 AM');
        });
        it('Should return the files only warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    filesOnly: true,
                }),
            });
            expect(result.current).toEqual('FilesOnly a minute June 1, 2024 at 12:30 AM');
        });
        it('Should return the unpinned files only warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)({ t: 'c' });
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)({
                    appliesToChannels: true,
                    TTLChannels: 60000,
                    filesOnly: true,
                    doNotPrunePinned: true,
                }),
            });
            expect(result.current).toEqual('UnpinnedFilesOnly a minute June 1, 2024 at 12:30 AM');
        });
    });
    describe('Overriden', () => {
        it('Should return the default warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)(Object.assign({ t: 'p' }, getRetentionRoomProps()));
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)(),
            });
            expect(result.current).toEqual('30 days June 1, 2024 at 12:30 AM');
        });
        it('Should return the unpinned messages warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)(Object.assign({ t: 'p' }, getRetentionRoomProps({ excludePinned: true })));
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)(),
            });
            expect(result.current).toEqual('Unpinned 30 days June 1, 2024 at 12:30 AM');
        });
        it('Should return the files only warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)(Object.assign({ t: 'p' }, getRetentionRoomProps({ filesOnly: true })));
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)(),
            });
            expect(result.current).toEqual('FilesOnly 30 days June 1, 2024 at 12:30 AM');
        });
        it('Should return the unpinned files only warning', () => {
            const fakeRoom = (0, data_1.createFakeRoom)(Object.assign({ t: 'p' }, getRetentionRoomProps({ excludePinned: true, filesOnly: true })));
            const { result } = (0, react_1.renderHook)(() => (0, usePruneWarningMessage_1.usePruneWarningMessage)(fakeRoom), {
                legacyRoot: true,
                wrapper: (0, mockRetentionPolicySettings_1.createRenteionPolicySettingsMock)(),
            });
            expect(result.current).toEqual('UnpinnedFilesOnly 30 days June 1, 2024 at 12:30 AM');
        });
    });
});
