"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBannerSection = void 0;
const react_1 = require("react");
const scrolling_1 = require("../../../../../app/ui/client/views/app/lib/scrolling");
const highOrderFunctions_1 = require("../../../../../lib/utils/highOrderFunctions");
const useBannerSection = () => {
    const [hideSection, setHideSection] = (0, react_1.useState)(false);
    const wrapperBoxRef = (0, react_1.useRef)(null);
    const innerScrollRef = (0, react_1.useCallback)((node) => {
        var _a;
        if (!node) {
            return;
        }
        let lastScrollTopRef = 0;
        (_a = wrapperBoxRef.current) === null || _a === void 0 ? void 0 : _a.addEventListener('mouseover', () => setHideSection(false));
        node.addEventListener('scroll', (0, highOrderFunctions_1.withThrottling)({ wait: 100 })((event) => {
            var _a;
            const roomLeader = (_a = wrapperBoxRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('.rcx-header-section');
            if (roomLeader) {
                if ((0, scrolling_1.isAtBottom)(node, 0)) {
                    setHideSection(false);
                }
                else if (event.target.scrollTop < lastScrollTopRef) {
                    setHideSection(true);
                }
                else if (!(0, scrolling_1.isAtBottom)(node, 100) && event.target.scrollTop > parseFloat(getComputedStyle(roomLeader).height)) {
                    setHideSection(true);
                }
            }
            lastScrollTopRef = event.target.scrollTop;
        }), { passive: true });
    }, []);
    return {
        wrapperRef: wrapperBoxRef,
        hideSection,
        innerRef: innerScrollRef,
    };
};
exports.useBannerSection = useBannerSection;
