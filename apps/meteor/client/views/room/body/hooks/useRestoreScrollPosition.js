"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRestoreScrollPosition = useRestoreScrollPosition;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const scrolling_1 = require("../../../../../app/ui/client/views/app/lib/scrolling");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const RoomManager_1 = require("../../../../lib/RoomManager");
function useRestoreScrollPosition(roomId) {
    const ref = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        const store = RoomManager_1.RoomManager.getStore(roomId);
        if ((store === null || store === void 0 ? void 0 : store.scroll) && !store.atBottom) {
            node.scrollTo({
                left: 30,
                top: store.scroll,
            });
        }
        else {
            node.scrollTo({
                top: node.scrollHeight,
            });
        }
    }, [roomId]);
    const refCallback = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        const store = RoomManager_1.RoomManager.getStore(roomId);
        const handleWrapperScroll = (0, highOrderFunctions_1.withThrottling)({ wait: 100 })(() => {
            store === null || store === void 0 ? void 0 : store.update({ scroll: node.scrollTop, atBottom: (0, scrolling_1.isAtBottom)(node, 50) });
        });
        node.addEventListener('scroll', handleWrapperScroll, {
            passive: true,
        });
    }, [roomId]);
    return {
        innerRef: (0, fuselage_hooks_1.useMergedRefs)(refCallback, ref),
    };
}
