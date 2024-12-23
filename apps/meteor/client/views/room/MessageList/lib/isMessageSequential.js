"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessageSequential = void 0;
const date_fns_1 = require("date-fns");
const isMessageNewDay_1 = require("./isMessageNewDay");
const MessageTypes_1 = require("../../../../../app/ui-utils/lib/MessageTypes");
const isMessageSequential = (current, previous, groupingRange) => {
    if (!previous) {
        return false;
    }
    if (MessageTypes_1.MessageTypes.isSystemMessage(current) || MessageTypes_1.MessageTypes.isSystemMessage(previous)) {
        return false;
    }
    if (current.tmid) {
        return [previous.tmid, previous._id].includes(current.tmid);
    }
    if (previous.tmid) {
        return false;
    }
    if (current.groupable === false) {
        return false;
    }
    if (current.u._id !== previous.u._id) {
        return false;
    }
    if (current.alias !== previous.alias) {
        return false;
    }
    return (0, date_fns_1.differenceInSeconds)(current.ts, previous.ts) < groupingRange && !(0, isMessageNewDay_1.isMessageNewDay)(current, previous);
};
exports.isMessageSequential = isMessageSequential;
