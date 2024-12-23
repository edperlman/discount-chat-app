"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const useInstance_1 = require("./useInstance");
class MockChatMessages {
    release() {
        return 'released';
    }
}
describe('useInstance', () => {
    let factory;
    let release;
    beforeEach(() => {
        jest.clearAllMocks();
        release = jest.fn();
        factory = jest.fn().mockReturnValue([{ instance: new MockChatMessages() }, release]);
    });
    it('should create a new instance when dependencies change', () => {
        const { result, rerender } = (0, react_1.renderHook)(({ deps }) => (0, useInstance_1.useInstance)(factory, deps), {
            initialProps: { deps: ['initial-dep'] },
            legacyRoot: true,
        });
        expect(result.current).toEqual({ instance: new MockChatMessages() });
        expect(factory).toHaveBeenCalledTimes(1);
        expect(release).toHaveBeenCalledTimes(0);
        rerender({ deps: ['new-dep'] });
        expect(result.current).toEqual({ instance: new MockChatMessages() });
        expect(factory).toHaveBeenCalledTimes(2);
        expect(release).toHaveBeenCalledTimes(1);
    });
    it('should not create a new instance when dependencies do not change', () => {
        const { result, rerender } = (0, react_1.renderHook)(({ deps }) => (0, useInstance_1.useInstance)(factory, deps), {
            initialProps: { deps: ['initial-dep'] },
            legacyRoot: true,
        });
        expect(result.current).toEqual({ instance: new MockChatMessages() });
        expect(factory).toHaveBeenCalledTimes(1);
        expect(release).toHaveBeenCalledTimes(0);
        rerender({ deps: ['initial-dep'] });
        expect(result.current).toEqual({ instance: new MockChatMessages() });
        expect(factory).toHaveBeenCalledTimes(1);
        expect(release).toHaveBeenCalledTimes(0);
    });
    it('should call release function when component unmounts', () => {
        const { unmount } = (0, react_1.renderHook)(() => (0, useInstance_1.useInstance)(factory, ['initial-dep']), { legacyRoot: true });
        unmount();
        expect(release).toHaveBeenCalledTimes(1);
    });
});
