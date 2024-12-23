"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const useDepsMatch_1 = require("./useDepsMatch");
describe('useDepsMatch', () => {
    it('should return true when dependencies match', () => {
        const { result, rerender } = (0, react_1.renderHook)(({ deps }) => (0, useDepsMatch_1.useDepsMatch)(deps), {
            initialProps: { deps: ['dep1', 'dep2'] },
            legacyRoot: true,
        });
        expect(result.current).toBe(true);
        rerender({ deps: ['dep1', 'dep2'] });
        expect(result.current).toBe(true);
    });
    it('should return false when dependencies do not match', () => {
        const { result, rerender } = (0, react_1.renderHook)(({ deps }) => (0, useDepsMatch_1.useDepsMatch)(deps), {
            initialProps: { deps: ['dep1', 'dep2'] },
            legacyRoot: true,
        });
        expect(result.current).toBe(true);
        rerender({ deps: ['dep1', 'dep3'] });
        expect(result.current).toBe(false);
    });
    it('should return false when dependencies length changes', () => {
        const { result, rerender } = (0, react_1.renderHook)(({ deps }) => (0, useDepsMatch_1.useDepsMatch)(deps), {
            initialProps: { deps: ['dep1', 'dep2'] },
            legacyRoot: true,
        });
        expect(result.current).toBe(true);
        rerender({ deps: ['dep1'] });
        expect(result.current).toBe(false);
    });
});
