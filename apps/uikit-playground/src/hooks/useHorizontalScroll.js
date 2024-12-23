"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHorizontalScroll = useHorizontalScroll;
const react_1 = require("react");
function useHorizontalScroll() {
    const elRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY === 0) {
                    return;
                }
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    el.scrollLeft += e.deltaX;
                }
                el.scrollTo({ left: el.scrollLeft + e.deltaY });
            };
            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);
    return elRef;
}
