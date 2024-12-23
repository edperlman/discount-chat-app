"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipErrorSession = exports.isVoipOutgoingSession = exports.isVoipOngoingSession = exports.isVoipIncomingSession = void 0;
const isVoipIncomingSession = (session) => {
    return (session === null || session === void 0 ? void 0 : session.type) === 'INCOMING';
};
exports.isVoipIncomingSession = isVoipIncomingSession;
const isVoipOngoingSession = (session) => {
    return (session === null || session === void 0 ? void 0 : session.type) === 'ONGOING';
};
exports.isVoipOngoingSession = isVoipOngoingSession;
const isVoipOutgoingSession = (session) => {
    return (session === null || session === void 0 ? void 0 : session.type) === 'OUTGOING';
};
exports.isVoipOutgoingSession = isVoipOutgoingSession;
const isVoipErrorSession = (session) => {
    return (session === null || session === void 0 ? void 0 : session.type) === 'ERROR';
};
exports.isVoipErrorSession = isVoipErrorSession;
