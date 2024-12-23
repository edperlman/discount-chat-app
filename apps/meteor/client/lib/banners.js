"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.close = exports.closeById = exports.open = exports.firstSubscription = exports.isLegacyPayload = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const isLegacyPayload = (payload) => !('blocks' in payload);
exports.isLegacyPayload = isLegacyPayload;
const queue = [];
const emitter = new emitter_1.Emitter();
exports.firstSubscription = [
    (callback) => emitter.on('update-first', callback),
    () => { var _a; return (_a = queue[0]) !== null && _a !== void 0 ? _a : null; },
];
const open = (payload) => {
    let index = queue.findIndex((_payload) => {
        if ((0, exports.isLegacyPayload)(_payload) && (0, exports.isLegacyPayload)(payload)) {
            return _payload.id === payload.id;
        }
        if (!(0, exports.isLegacyPayload)(_payload) && !(0, exports.isLegacyPayload)(payload)) {
            return _payload.viewId === payload.viewId;
        }
        return false;
    });
    if (index === -1) {
        index = queue.length;
    }
    queue[index] = payload;
    emitter.emit('update');
    if (index === 0) {
        emitter.emit('update-first');
    }
};
exports.open = open;
const closeById = (id) => {
    const index = queue.findIndex((banner) => {
        if (!(0, exports.isLegacyPayload)(banner)) {
            return banner.viewId === id;
        }
        return banner.id === id;
    });
    if (index < 0) {
        return;
    }
    queue.splice(index, 1);
    emitter.emit('update');
    index === 0 && emitter.emit('update-first');
};
exports.closeById = closeById;
const close = () => {
    queue.shift();
    emitter.emit('update');
    emitter.emit('update-first');
};
exports.close = close;
const clear = () => {
    queue.splice(0, queue.length);
    emitter.emit('update');
    emitter.emit('update-first');
};
exports.clear = clear;
