"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presence = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const emitter_1 = require("@rocket.chat/emitter");
const meteor_1 = require("meteor/meteor");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const emitter = new emitter_1.Emitter();
const store = new Map();
const isUid = (eventType) => Boolean(eventType) && typeof eventType === 'string' && !['reset', 'restart', 'remove'].includes(eventType);
const uids = new Set();
const update = (update) => {
    if (update === null || update === void 0 ? void 0 : update._id) {
        store.set(update._id, Object.assign(Object.assign(Object.assign({}, store.get(update._id)), update), (status === 'disabled' && { status: core_typings_1.UserStatus.DISABLED })));
        uids.delete(update._id);
    }
};
const notify = (presence) => {
    if (presence._id) {
        update(presence);
        emitter.emit(presence._id, store.get(presence._id));
    }
};
const getPresence = (() => {
    let timer;
    const deletedUids = new Set();
    const fetch = (delay = 500) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const currentUids = new Set(uids);
            uids.clear();
            const ids = Array.from(currentUids);
            const removed = Array.from(deletedUids);
            meteor_1.Meteor.subscribe('stream-user-presence', '', Object.assign(Object.assign({}, (ids.length > 0 && { added: Array.from(currentUids) })), (removed.length && { removed: Array.from(deletedUids) })));
            deletedUids.clear();
            if (ids.length === 0) {
                return;
            }
            try {
                const params = {
                    ids: [...currentUids],
                };
                const { users } = yield SDKClient_1.sdk.rest.get('/v1/users.presence', params);
                users.forEach((user) => {
                    if (!store.has(user._id)) {
                        notify(user);
                    }
                    currentUids.delete(user._id);
                });
                currentUids.forEach((uid) => {
                    notify({ _id: uid, status: core_typings_1.UserStatus.OFFLINE });
                });
                currentUids.clear();
            }
            catch (_a) {
                fetch(delay + delay);
            }
            finally {
                currentUids.forEach((item) => uids.add(item));
            }
        }), delay);
    };
    const get = (uid) => {
        uids.add(uid);
        fetch();
    };
    const stop = (uid) => {
        deletedUids.add(uid);
        fetch();
    };
    emitter.on('remove', (uid) => {
        if (emitter.has(uid)) {
            return;
        }
        store.delete(uid);
        stop(uid);
    });
    emitter.on('reset', () => {
        emitter
            .events()
            .filter(isUid)
            .forEach((uid) => {
            emitter.emit(uid, undefined);
        });
        emitter.once('restart', () => {
            emitter.events().filter(isUid).forEach(get);
        });
    });
    return get;
})();
const listen = (uid, handler) => {
    if (!uid) {
        return;
    }
    emitter.on(uid, handler);
    const user = store.has(uid) && store.get(uid);
    if (user) {
        return;
    }
    getPresence(uid);
};
const stop = (uid, handler) => {
    emitter.off(uid, handler);
    setTimeout(() => {
        emitter.emit('remove', uid);
    }, 5000);
};
const reset = () => {
    store.clear();
    emitter.emit('reset');
};
const restart = () => {
    emitter.emit('restart');
};
const get = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const user = store.has(uid) && store.get(uid);
        if (user) {
            return resolve(user);
        }
        const callback = (args) => {
            resolve(args);
            stop(uid, callback);
        };
        listen(uid, callback);
    });
});
let status = 'enabled';
const setStatus = (newStatus) => {
    status = newStatus;
    reset();
};
exports.Presence = {
    setStatus,
    status,
    listen,
    stop,
    reset,
    restart,
    notify,
    store,
    get,
};
