"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIDialingEvent = exports.isICallHangupEvent = exports.isIContactStatusEvent = exports.isICallUnHoldEvent = exports.isICallOnHoldEvent = exports.isIQueueCallerAbandonEvent = exports.isIQueueMemberRemovedEvent = exports.isIQueueMemberAddedEvent = exports.isIQueueCallerJoinEvent = exports.isIAgentCalledEvent = exports.isIAgentConnectEvent = void 0;
const isIAgentConnectEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'AgentConnect';
exports.isIAgentConnectEvent = isIAgentConnectEvent;
const isIAgentCalledEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'AgentCalled';
exports.isIAgentCalledEvent = isIAgentCalledEvent;
const isIQueueCallerJoinEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'QueueCallerJoin';
exports.isIQueueCallerJoinEvent = isIQueueCallerJoinEvent;
const isIQueueMemberAddedEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'QueueMemberAdded';
exports.isIQueueMemberAddedEvent = isIQueueMemberAddedEvent;
const isIQueueMemberRemovedEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'QueueMemberRemoved';
exports.isIQueueMemberRemovedEvent = isIQueueMemberRemovedEvent;
const isIQueueCallerAbandonEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'QueueCallerAbandon';
exports.isIQueueCallerAbandonEvent = isIQueueCallerAbandonEvent;
const isICallOnHoldEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'Hold';
exports.isICallOnHoldEvent = isICallOnHoldEvent;
const isICallUnHoldEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'Unhold';
exports.isICallUnHoldEvent = isICallUnHoldEvent;
const isIContactStatusEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'ContactStatus';
exports.isIContactStatusEvent = isIContactStatusEvent;
const isICallHangupEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'Hangup';
exports.isICallHangupEvent = isICallHangupEvent;
const isIDialingEvent = (v) => (v === null || v === void 0 ? void 0 : v.event) === 'DialState' || (v === null || v === void 0 ? void 0 : v.event) === 'DialEnd';
exports.isIDialingEvent = isIDialingEvent;
