"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = exports.createSDK = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const accounts_base_1 = require("meteor/accounts-base");
const ddp_common_1 = require("meteor/ddp-common");
const meteor_1 = require("meteor/meteor");
const RestApiClient_1 = require("./RestApiClient");
const isChangedCollectionPayload = (msg) => {
    if (typeof msg !== 'object' && (msg !== null || msg !== undefined)) {
        return false;
    }
    if (msg.msg !== 'changed') {
        return false;
    }
    if (typeof msg.collection !== 'string') {
        return false;
    }
    if (typeof msg.fields !== 'object' && (msg.fields !== null || msg.fields !== undefined)) {
        return false;
    }
    if (typeof msg.fields.eventName !== 'string') {
        return false;
    }
    if (!Array.isArray(msg.fields.args)) {
        return false;
    }
    return true;
};
const createNewMeteorStream = (streamName, key, args) => {
    const ee = new emitter_1.Emitter();
    const meta = {
        ready: false,
    };
    const sub = meteor_1.Meteor.connection.subscribe(`stream-${streamName}`, key, { useCollection: false, args }, {
        onReady: (args) => {
            meta.ready = true;
            ee.emit('ready', [undefined, args]);
        },
        onError: (err) => {
            ee.emit('ready', [err]);
            ee.emit('error', err);
        },
    });
    const onChange = (cb) => {
        if (meta.ready) {
            cb({
                msg: 'ready',
                subs: [],
            });
            return;
        }
        ee.once('ready', ([error, result]) => {
            if (error) {
                cb({
                    msg: 'nosub',
                    id: '',
                    error,
                });
                return;
            }
            cb(result);
        });
    };
    const ready = () => {
        if (meta.ready) {
            return Promise.resolve();
        }
        return new Promise((r) => {
            ee.once('ready', r);
        });
    };
    return {
        stop: sub.stop,
        onChange,
        ready,
        error: (cb) => ee.once('error', (error) => {
            cb(error);
        }),
        get isReady() {
            return meta.ready;
        },
        unsubList: new Set(),
    };
};
const createStreamManager = () => {
    // Emitter that replicates stream messages to registered callbacks
    const streamProxy = new emitter_1.Emitter();
    // Collection of unsubscribe callbacks for each stream.
    // const proxyUnsubLists = new Map<string, Set<() => void>>();
    const streams = new Map();
    accounts_base_1.Accounts.onLogout(() => {
        streams.forEach((stream) => {
            stream.unsubList.forEach((stop) => stop());
        });
    });
    meteor_1.Meteor.connection._stream.on('message', (rawMsg) => {
        const msg = ddp_common_1.DDPCommon.parseDDP(rawMsg);
        if (!isChangedCollectionPayload(msg)) {
            return;
        }
        streamProxy.emit(`${msg.collection}/${msg.fields.eventName}`, msg.fields.args);
    });
    const stream = (name, data, callback, _options) => {
        const [key, ...args] = data;
        const eventLiteral = `stream-${name}/${key}`;
        const proxyCallback = (args) => {
            if (!args || !Array.isArray(args)) {
                throw new Error('Invalid streamer callback');
            }
            callback(...args);
        };
        streamProxy.on(eventLiteral, proxyCallback);
        const stop = () => {
            streamProxy.off(eventLiteral, proxyCallback);
            // If someone is still listening, don't unsubscribe
            if (streamProxy.has(eventLiteral)) {
                return;
            }
            if (stream) {
                stream.stop();
                streams.delete(eventLiteral);
            }
        };
        const stream = streams.get(eventLiteral) || createNewMeteorStream(name, key, args);
        stream.unsubList.add(stop);
        if (!streams.has(eventLiteral)) {
            streams.set(eventLiteral, stream);
        }
        stream.error(() => {
            stream.unsubList.forEach((stop) => stop());
        });
        return {
            id: '',
            name,
            params: data,
            stop,
            ready: stream.ready,
            onChange: stream.onChange,
            isReady: stream.isReady,
        };
    };
    const stopAll = (streamName, key) => {
        const stream = streams.get(`stream-${streamName}/${key}`);
        if (stream) {
            stream.unsubList.forEach((stop) => stop());
        }
    };
    return { stream, stopAll };
};
const createSDK = (rest) => {
    const { stream, stopAll } = createStreamManager();
    const publish = (name, args) => {
        meteor_1.Meteor.call(`stream-${name}`, ...args);
    };
    const call = (method, ...args) => {
        return meteor_1.Meteor.callAsync(method, ...args);
    };
    return {
        rest,
        stop: stopAll,
        stream,
        publish,
        call,
    };
};
exports.createSDK = createSDK;
exports.sdk = (0, exports.createSDK)(RestApiClient_1.APIClient);
