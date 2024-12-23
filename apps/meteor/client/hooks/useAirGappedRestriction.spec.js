"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock_providers_1 = require("@rocket.chat/mock-providers");
const react_1 = require("@testing-library/react");
const useAirGappedRestriction_1 = require("./useAirGappedRestriction");
// [restricted, warning, remainingDays]
describe('useAirGappedRestriction hook', () => {
    it('should return [false, false, -1] if setting value is not a number', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useAirGappedRestriction_1.useAirGappedRestriction)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withSetting('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', -1).build(),
        });
        expect(result.current).toEqual([false, false, -1]);
    });
    it('should return [false, false, -1] if user has a license (remaining days is a negative value)', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useAirGappedRestriction_1.useAirGappedRestriction)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withSetting('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', -1).build(),
        });
        expect(result.current).toEqual([false, false, -1]);
    });
    it('should return [false, false, 8] if not on warning or restriction phase', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useAirGappedRestriction_1.useAirGappedRestriction)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withSetting('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', 8).build(),
        });
        expect(result.current).toEqual([false, false, 8]);
    });
    it('should return [true, false, 7] if on warning phase', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useAirGappedRestriction_1.useAirGappedRestriction)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withSetting('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', 7).build(),
        });
        expect(result.current).toEqual([false, true, 7]);
    });
    it('should return [true, false, 0] if on restriction phase', () => {
        const { result } = (0, react_1.renderHook)(() => (0, useAirGappedRestriction_1.useAirGappedRestriction)(), {
            legacyRoot: true,
            wrapper: (0, mock_providers_1.mockAppRoot)().withSetting('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', 0).build(),
        });
        expect(result.current).toEqual([true, false, 0]);
    });
});
