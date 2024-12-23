"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallOngoing = void 0;
const isCallOngoing = (callStatus) => callStatus === "inProgress" /* CallStatus.IN_PROGRESS */ ||
    callStatus === "inProgressDifferentTab" /* CallStatus.IN_PROGRESS_DIFFERENT_TAB */ ||
    callStatus === "inProgressSameTab" /* CallStatus.IN_PROGRESS_SAME_TAB */;
exports.isCallOngoing = isCallOngoing;
