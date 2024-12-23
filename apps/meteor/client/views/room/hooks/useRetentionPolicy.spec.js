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
const useRetentionPolicy_1 = require("./useRetentionPolicy");
const data_1 = require("../../../../tests/mocks/data");
const getGlobalSettings = ({ enabled = false, filesOnly = false, doNotPrunePinned = false, ignoreThreads = false, appliesToChannels = false, appliesToGroups = false, appliesToDMs = false, }) => {
    return (0, mock_providers_1.mockAppRoot)()
        .withSetting('RetentionPolicy_Enabled', enabled)
        .withSetting('RetentionPolicy_FilesOnly', filesOnly)
        .withSetting('RetentionPolicy_DoNotPrunePinned', doNotPrunePinned)
        .withSetting('RetentionPolicy_DoNotPruneThreads', ignoreThreads)
        .withSetting('RetentionPolicy_AppliesToChannels', appliesToChannels)
        .withSetting('RetentionPolicy_AppliesToGroups', appliesToGroups)
        .withSetting('RetentionPolicy_AppliesToDMs', appliesToDMs);
};
const defaultValue = {
    enabled: false,
    isActive: false,
    filesOnly: false,
    excludePinned: false,
    ignoreThreads: false,
};
const roomTypeConfig = {
    c: { appliesToChannels: true },
    p: { appliesToGroups: true },
    d: { appliesToDMs: true },
};
const CHANNELS_TYPE = 'c';
it('should return the default value if global retention is not enabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const fakeRoom = (0, data_1.createFakeRoom)({ t: CHANNELS_TYPE });
    const { result } = (0, react_1.renderHook)(() => (0, useRetentionPolicy_1.useRetentionPolicy)(fakeRoom), {
        legacyRoot: true,
        wrapper: getGlobalSettings({}).build(),
    });
    expect(result.current).toEqual(expect.objectContaining(defaultValue));
}));
it('should return enabled true if global retention is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
    const fakeRoom = (0, data_1.createFakeRoom)({ t: CHANNELS_TYPE });
    const { result } = (0, react_1.renderHook)(() => (0, useRetentionPolicy_1.useRetentionPolicy)(fakeRoom), {
        legacyRoot: true,
        wrapper: getGlobalSettings({ enabled: true }).build(),
    });
    expect(result.current).toEqual(expect.objectContaining(Object.assign(Object.assign({}, defaultValue), { enabled: true })));
}));
it('should return enabled and active true global retention is active for rooms of the type', () => __awaiter(void 0, void 0, void 0, function* () {
    const fakeRoom = (0, data_1.createFakeRoom)({ t: CHANNELS_TYPE });
    const { result } = (0, react_1.renderHook)(() => (0, useRetentionPolicy_1.useRetentionPolicy)(fakeRoom), {
        legacyRoot: true,
        wrapper: getGlobalSettings(Object.assign({ enabled: true }, roomTypeConfig[CHANNELS_TYPE])).build(),
    });
    expect(result.current).toEqual(expect.objectContaining(Object.assign(Object.assign({}, defaultValue), { enabled: true, isActive: true })));
}));
it('should isActive be false if global retention is active for rooms of the type and room has retention.enabled false', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fakeRoom = (0, data_1.createFakeRoom)({ t: CHANNELS_TYPE, retention: { enabled: false } });
    const { result } = (0, react_1.renderHook)(() => (0, useRetentionPolicy_1.useRetentionPolicy)(fakeRoom), {
        legacyRoot: true,
        wrapper: getGlobalSettings(Object.assign({ enabled: true }, roomTypeConfig[CHANNELS_TYPE])).build(),
    });
    expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.isActive).toBe(false);
}));
