"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLeaderBanner = void 0;
const react_1 = require("react");
const scrolling_1 = require("../../../../../app/ui/client/views/app/lib/scrolling");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const useLeaderBanner = () => {
    const [hideLeaderHeader, setHideLeaderHeader] = (0, react_1.useState)(false);
    const wrapperBoxRef = (0, react_1.useRef)(null);
    const innerScrollRef = (0, react_1.useCallback)((node) => {
        if (!node) {
            return;
        }
        let lastScrollTopRef = 0;
        node.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 100 })((event) => {
            var _a;
            const roomLeader = (_a = wrapperBoxRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('.room-leader');
            if (roomLeader) {
                if (event.target.scrollTop < lastScrollTopRef) {
                    setHideLeaderHeader(false);
                }
                else if ((0, scrolling_1.isAtBottom)(node, 100) === false && event.target.scrollTop > parseFloat(getComputedStyle(roomLeader).height)) {
                    setHideLeaderHeader(true);
                }
            }
            lastScrollTopRef = event.target.scrollTop;
        }), { passive: true });
    }, []);
    return {
        wrapperRef: wrapperBoxRef,
        hideLeaderHeader,
        innerRef: innerScrollRef,
    };
};
exports.useLeaderBanner = useLeaderBanner;
