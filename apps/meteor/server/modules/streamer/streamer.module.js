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
exports.Streamer = exports.StreamerCentral = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const eventemitter3_1 = require("eventemitter3");
const system_1 = require("../../lib/logger/system");
class StreamerCentralClass extends eventemitter3_1.EventEmitter {
    constructor() {
        super();
        this.instances = {};
    }
}
exports.StreamerCentral = new StreamerCentralClass();
class Streamer extends eventemitter3_1.EventEmitter {
    constructor(name, { retransmit = true, retransmitToSelf = false } = {}) {
        super();
        this.name = name;
        this.subscriptions = new Set();
        this.subscriptionsByEventName = new Map();
        this.retransmit = true;
        this.retransmitToSelf = false;
        this.serverOnly = false;
        this._allowRead = {};
        this._allowWrite = {};
        this._allowEmit = {};
        if (exports.StreamerCentral.instances[name]) {
            console.warn('Streamer instance already exists:', name);
            return exports.StreamerCentral.instances[name];
        }
        exports.StreamerCentral.instances[name] = this;
        this.retransmit = retransmit;
        this.retransmitToSelf = retransmitToSelf;
        this.iniPublication();
        // DDPStreamer doesn't have this
        this.initMethod();
        this.allowRead('none');
        this.allowEmit('all');
        this.allowWrite('none');
    }
    get subscriptionName() {
        return `stream-${this.name}`;
    }
    allow(rules, name) {
        return (eventName, fn) => {
            if (fn === undefined) {
                fn = eventName;
                eventName = '__all__';
            }
            if (typeof eventName !== 'string') {
                return;
            }
            if (typeof fn === 'function') {
                rules[eventName] = fn;
                return;
            }
            if (typeof fn === 'string' && ['all', 'none', 'logged'].indexOf(fn) === -1) {
                system_1.SystemLogger.error(`${name} shortcut '${fn}' is invalid`);
            }
            if (fn === 'all' || fn === true) {
                rules[eventName] = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return true;
                    });
                };
                return;
            }
            if (fn === 'none' || fn === false) {
                rules[eventName] = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return false;
                    });
                };
                return;
            }
            if (fn === 'logged') {
                rules[eventName] = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return Boolean(this.userId);
                    });
                };
            }
        };
    }
    allowRead(eventName, fn) {
        this.allow(this._allowRead, 'allowRead')(eventName, fn);
    }
    allowWrite(eventName, fn) {
        this.allow(this._allowWrite, 'allowWrite')(eventName, fn);
    }
    allowEmit(eventName, fn) {
        this.allow(this._allowEmit, 'allowEmit')(eventName, fn);
    }
    isAllowed(rules) {
        return (scope, eventName, args) => __awaiter(this, void 0, void 0, function* () {
            if (rules[eventName]) {
                return rules[eventName].call(scope, eventName, ...args);
            }
            return rules.__all__.call(scope, eventName, ...args);
        });
    }
    isReadAllowed(scope, eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isAllowed(this._allowRead)(scope, eventName, args);
        });
    }
    isEmitAllowed(scope, eventName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isAllowed(this._allowEmit)(scope, eventName, args);
        });
    }
    isWriteAllowed(scope, eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isAllowed(this._allowWrite)(scope, eventName, args);
        });
    }
    addSubscription(subscription, eventName) {
        this.subscriptions.add(subscription);
        const subByEventName = this.subscriptionsByEventName.get(eventName) || new Set();
        subByEventName.add(subscription);
        this.subscriptionsByEventName.set(eventName, subByEventName);
    }
    removeSubscription(subscription, eventName) {
        this.subscriptions.delete(subscription);
        const subByEventName = this.subscriptionsByEventName.get(eventName);
        if (subByEventName) {
            subByEventName.delete(subscription);
        }
    }
    _publish(publication_1, eventName_1) {
        const _super = Object.create(null, {
            emit: { get: () => super.emit }
        });
        return __awaiter(this, arguments, void 0, function* (publication, eventName, options = false) {
            let useCollection;
            let args = [];
            if (typeof options === 'boolean') {
                useCollection = options;
            }
            else {
                if (options.useCollection) {
                    useCollection = options.useCollection;
                }
                if (options.args) {
                    args = options.args;
                }
            }
            if (eventName.length === 0) {
                throw new core_services_1.MeteorError('invalid-event-name');
            }
            if ((yield this.isReadAllowed(publication, eventName, args)) !== true) {
                throw new core_services_1.MeteorError('not-allowed');
            }
            const subscription = {
                subscription: publication,
                eventName,
            };
            this.addSubscription(subscription, eventName);
            publication.onStop(() => {
                this.removeSubscription(subscription, eventName);
            });
            // DDPStreamer doesn't have this
            if (useCollection === true) {
                // Collection compatibility
                publication._session.sendAdded(this.subscriptionName, 'id', {
                    eventName,
                });
            }
            publication.ready();
            _super.emit.call(this, '_afterPublish', this, publication, eventName, options);
        });
    }
    iniPublication() {
        const _publish = this._publish.bind(this);
        this.registerPublication(this.subscriptionName, function (eventName, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return _publish(this, eventName, options);
            });
        });
    }
    initMethod() {
        const isWriteAllowed = this.isWriteAllowed.bind(this);
        const __emit = this.__emit.bind(this);
        const _emit = this._emit.bind(this);
        const { retransmit } = this;
        const method = {
            [this.subscriptionName](eventName, ...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    if ((yield isWriteAllowed(this, eventName, args)) !== true) {
                        return;
                    }
                    __emit(eventName, ...args);
                    if (retransmit === true) {
                        _emit(eventName, args, this.connection, true);
                    }
                });
            },
        };
        try {
            this.registerMethod(method);
        }
        catch (e) {
            system_1.SystemLogger.error(e);
        }
    }
    _emit(eventName, args, origin, broadcast, transform) {
        if (broadcast === true) {
            exports.StreamerCentral.emit('broadcast', this.name, eventName, args);
        }
        const subscriptions = this.subscriptionsByEventName.get(eventName);
        if (!(subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.size)) {
            return false;
        }
        if (transform) {
            void this.sendToManySubscriptions(subscriptions, origin, eventName, args, transform);
            return true;
        }
        const msg = this.changedPayload(this.subscriptionName, 'id', {
            eventName,
            args,
        });
        if (!msg) {
            return false;
        }
        void this.sendToManySubscriptions(subscriptions, origin, eventName, args, msg);
        return true;
    }
    sendToManySubscriptions(subscriptions, origin, eventName, args, getMsg) {
        return __awaiter(this, void 0, void 0, function* () {
            subscriptions.forEach((subscription) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (this.retransmitToSelf === false && origin && origin === subscription.subscription.connection) {
                    return;
                }
                const allowed = yield this.isEmitAllowed(subscription.subscription, eventName, ...args);
                if (allowed) {
                    const msg = typeof getMsg === 'string' ? getMsg : getMsg(this, subscription, eventName, args, allowed);
                    if (msg) {
                        (_a = subscription.subscription._session.socket) === null || _a === void 0 ? void 0 : _a.send(msg);
                    }
                }
            }));
        });
    }
    emit(eventName, ...args) {
        return this._emit(eventName, args, undefined, true);
    }
    __emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    emitWithoutBroadcast(eventName, ...args) {
        this._emit(eventName, args, undefined, false);
    }
}
exports.Streamer = Streamer;
