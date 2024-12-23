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
exports.ClientStreamImpl = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const DDPDispatcher_1 = require("./DDPDispatcher");
class ClientStreamImpl extends emitter_1.Emitter {
    constructor(ddp, dispatcher = new DDPDispatcher_1.DDPDispatcher()) {
        ddp.onConnection(({ msg }) => {
            if (msg === 'connected') {
                this.emit('connected');
            }
        });
        super();
        this.ddp = ddp;
        this.dispatcher = dispatcher;
        this.subscriptions = new Map();
    }
    apply({ payload: ddpCallPayload, options, callback, }) {
        this.dispatcher.dispatch(ddpCallPayload, options);
        this.ddp.onResult(ddpCallPayload.id, (payload) => {
            this.dispatcher.removeItem(ddpCallPayload);
            if (typeof callback === 'function') {
                if ('error' in payload) {
                    callback(payload.error);
                }
                else {
                    callback(null, payload.result);
                }
            }
        });
        return ddpCallPayload.id;
    }
    call(method, ...params) {
        // get the last argument
        return this.callWithOptions(method, {}, ...params);
    }
    callWithOptions(method, options, ...params) {
        // get the last argument
        const callback = params.pop();
        // if it's not a function, then push it back
        if (typeof callback !== 'function') {
            params.push(callback);
        }
        const payload = this.ddp.call(method, params);
        this.apply({ payload, callback, options });
        return payload.id;
    }
    callAsync(method, ...params) {
        return this.callAsyncWithOptions(method, {}, ...params);
    }
    callAsyncWithOptions(method, options, ...params) {
        const payload = this.ddp.call(method, params);
        return Object.assign(new Promise((resolve, reject) => {
            this.apply({
                payload,
                options,
                callback: (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                },
            });
        }), {
            id: payload.id,
        });
    }
    subscribe(name, ...params) {
        const id = this.ddp.subscribe(name, params);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const s = self.ddp.onPublish(id, (payload) => {
            if ('error' in payload) {
                result.error = payload.error;
                this.subscriptions.delete(id);
                return;
            }
            result.isReady = true;
            this.subscriptions.set(id, Object.assign(Object.assign({}, result), { isReady: true }));
        });
        const stop = () => {
            s();
            self.unsubscribe(id);
        };
        const result = {
            id,
            name,
            params,
            ready() {
                return __awaiter(this, void 0, void 0, function* () {
                    const subscription = self.subscriptions.get(id);
                    if (!subscription) {
                        return Promise.reject(result.error);
                    }
                    if (subscription.isReady) {
                        return Promise.resolve();
                    }
                    return new Promise((resolve, reject) => {
                        this.onChange((payload) => {
                            if ('error' in payload) {
                                reject(payload.error);
                                return;
                            }
                            resolve();
                        });
                    });
                });
            },
            isReady: false,
            onChange: (cb) => {
                self.ddp.onPublish(id, cb);
            },
            stop,
        };
        this.subscriptions.set(id, result);
        return result;
    }
    unsubscribe(id) {
        return new Promise((resolve, reject) => {
            this.subscriptions.delete(id);
            this.ddp.unsubscribe(id);
            this.ddp.onNoSub(id, (payload) => {
                if ('error' in payload) {
                    reject(payload.error);
                }
                else {
                    resolve(payload);
                }
            });
        });
    }
    connect() {
        this.ddp.connect();
        return new Promise((resolve, reject) => {
            this.ddp.onConnection((data) => {
                if (data.msg === 'failed')
                    reject(data);
                else
                    resolve(data);
            });
        });
    }
    onCollection(id, callback) {
        return this.ddp.onCollection(id, callback);
    }
}
exports.ClientStreamImpl = ClientStreamImpl;
