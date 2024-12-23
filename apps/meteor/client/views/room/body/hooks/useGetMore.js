"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetMore = void 0;
const react_1 = require("react");
const client_1 = require("../../../../../app/ui-utils/client");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const useGetMore = (rid, atBottomRef) => {
    return {
        innerRef: (0, react_1.useCallback)((wrapper) => {
            if (!wrapper) {
                return;
            }
            let lastScrollTopRef = 0;
            wrapper.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 100 })((event) => {
                lastScrollTopRef = event.target.scrollTop;
                const height = event.target.clientHeight;
                const isLoading = client_1.RoomHistoryManager.isLoading(rid);
                const hasMore = client_1.RoomHistoryManager.hasMore(rid);
                const hasMoreNext = client_1.RoomHistoryManager.hasMoreNext(rid);
                if ((isLoading === false && hasMore === true) || hasMoreNext === true) {
                    if (hasMore === true && lastScrollTopRef <= height / 3) {
                        client_1.RoomHistoryManager.getMore(rid);
                    }
                    else if (hasMoreNext === true && Math.ceil(lastScrollTopRef) >= event.target.scrollHeight - height) {
                        client_1.RoomHistoryManager.getMoreNext(rid, atBottomRef);
                        atBottomRef.current = false;
                    }
                }
            }));
        }, [atBottomRef, rid]),
    };
};
exports.useGetMore = useGetMore;
