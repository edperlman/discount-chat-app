"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionsQueryKeys = exports.roomsQueryKeys = void 0;
exports.roomsQueryKeys = {
    all: ['rooms'],
    room: (rid) => ['rooms', rid],
    starredMessages: (rid) => [...exports.roomsQueryKeys.room(rid), 'starred-messages'],
    pinnedMessages: (rid) => [...exports.roomsQueryKeys.room(rid), 'pinned-messages'],
    messages: (rid) => [...exports.roomsQueryKeys.room(rid), 'messages'],
    message: (rid, mid) => [...exports.roomsQueryKeys.messages(rid), mid],
    threads: (rid) => [...exports.roomsQueryKeys.room(rid), 'threads'],
};
exports.subscriptionsQueryKeys = {
    all: ['subscriptions'],
    subscription: (rid) => [...exports.subscriptionsQueryKeys.all, { rid }],
};
