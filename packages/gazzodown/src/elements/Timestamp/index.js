"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fuselage_1 = require("@rocket.chat/fuselage");
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const timeago_1 = require("./timeago");
const MarkupInteractionContext_1 = require("../../MarkupInteractionContext");
const Timestamp = ({ format, value }) => {
    switch (format) {
        case 't': // Short time format
            return (0, jsx_runtime_1.jsx)(ShortTime, { value: value });
        case 'T': // Long time format
            return (0, jsx_runtime_1.jsx)(LongTime, { value: value });
        case 'd': // Short date format
            return (0, jsx_runtime_1.jsx)(ShortDate, { value: value });
        case 'D': // Long date format
            return (0, jsx_runtime_1.jsx)(LongDate, { value: value });
        case 'f': // Full date and time format
            return (0, jsx_runtime_1.jsx)(FullDate, { value: value });
        case 'F': // Full date and time (long) format
            return (0, jsx_runtime_1.jsx)(FullDateLong, { value: value });
        case 'R': // Relative time format
            return (0, jsx_runtime_1.jsx)(RelativeTime, { value: value });
        default:
            return (0, jsx_runtime_1.jsxs)("time", { dateTime: value.toISOString(), children: [" ", JSON.stringify(value.getTime())] });
    }
};
// eslint-disable-next-line react/no-multi-comp
const TimestampWrapper = ({ children }) => {
    const { enableTimestamp } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    if (!enableTimestamp) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: `<t:${children.value.timestamp}:${children.value.format}>` });
    }
    return ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { fallback: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: new Date(parseInt(children.value.timestamp) * 1000).toUTCString() }), children: (0, jsx_runtime_1.jsx)(Timestamp, { format: children.value.format, value: new Date(parseInt(children.value.timestamp) * 1000) }) }));
};
// eslint-disable-next-line react/no-multi-comp
const ShortTime = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'p'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const LongTime = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'pp'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const ShortDate = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'P'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const LongDate = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'Pp'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const FullDate = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'PPPppp'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const FullDateLong = ({ value }) => (0, jsx_runtime_1.jsx)(Time, { value: (0, date_fns_1.format)(value, 'PPPPpppp'), dateTime: value.toISOString() });
// eslint-disable-next-line react/no-multi-comp
const Time = ({ value, dateTime }) => ((0, jsx_runtime_1.jsx)("time", { title: new Date(dateTime).toLocaleString(), dateTime: dateTime, style: {
        display: 'inline-block',
    }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: value }) }));
// eslint-disable-next-line react/no-multi-comp
const RelativeTime = ({ value }) => {
    const time = value.getTime();
    const { language } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const [text, setTime] = (0, react_1.useState)(() => (0, timeago_1.timeAgo)(time, language !== null && language !== void 0 ? language : 'en'));
    const [timeToRefresh, setTimeToRefresh] = (0, react_1.useState)(() => getTimeToRefresh(time));
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            setTime((0, timeago_1.timeAgo)(value.getTime(), 'en'));
            setTimeToRefresh(getTimeToRefresh(time));
        }, timeToRefresh);
        return () => clearInterval(interval);
    }, [time, timeToRefresh, value]);
    return (0, jsx_runtime_1.jsx)(Time, { value: text, dateTime: value.toISOString() });
};
const getTimeToRefresh = (time) => {
    const timeToRefresh = time - Date.now();
    // less than 1 minute
    if (timeToRefresh < 60000) {
        return 1000;
    }
    // if the difference is in the minutes range, we should refresh the time in 1 minute / 2
    if (timeToRefresh < 3600000) {
        return 60000 / 2;
    }
    // if the difference is in the hours range, we should refresh the time in 5 minutes
    if (timeToRefresh < 86400000) {
        return 60000 * 5;
    }
    // refresh the time in 1 hour
    return 3600000;
};
exports.default = TimestampWrapper;
