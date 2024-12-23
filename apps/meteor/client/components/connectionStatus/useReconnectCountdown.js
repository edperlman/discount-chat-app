"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReconnectCountdown = void 0;
const react_1 = require("react");
const getReconnectCountdown = (retryTime) => {
    const timeDiff = retryTime - Date.now();
    return (timeDiff > 0 && Math.round(timeDiff / 1000)) || 0;
};
const useReconnectCountdown = (retryTime, status) => {
    const reconnectionTimerRef = (0, react_1.useRef)();
    const [reconnectCountdown, setReconnectCountdown] = (0, react_1.useState)(() => (retryTime ? getReconnectCountdown(retryTime) : 0));
    (0, react_1.useEffect)(() => {
        if (status === 'waiting') {
            if (reconnectionTimerRef.current) {
                return;
            }
            reconnectionTimerRef.current = setInterval(() => {
                retryTime && setReconnectCountdown(getReconnectCountdown(retryTime));
            }, 500);
            return;
        }
        reconnectionTimerRef.current && clearInterval(reconnectionTimerRef.current);
        reconnectionTimerRef.current = undefined;
    }, [retryTime, status]);
    (0, react_1.useEffect)(() => () => {
        reconnectionTimerRef.current && clearInterval(reconnectionTimerRef.current);
    }, []);
    return reconnectCountdown;
};
exports.useReconnectCountdown = useReconnectCountdown;
