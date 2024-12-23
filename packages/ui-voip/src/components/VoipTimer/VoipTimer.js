"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const setPreciseInterval_1 = require("../../utils/setPreciseInterval");
const VoipTimer = ({ startAt = new Date() }) => {
    const [start] = (0, react_1.useState)(startAt.getTime());
    const [ellapsedTime, setEllapsedTime] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        return (0, setPreciseInterval_1.setPreciseInterval)(() => {
            setEllapsedTime(Date.now() - start);
        }, 1000);
    });
    const [hours, minutes, seconds] = (0, react_1.useMemo)(() => {
        const totalSeconds = Math.floor(ellapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')];
    }, [ellapsedTime]);
    return ((0, jsx_runtime_1.jsxs)("time", { "aria-hidden": true, children: [hours !== '00' ? `${hours}:` : '', minutes, ":", seconds] }));
};
exports.default = VoipTimer;
