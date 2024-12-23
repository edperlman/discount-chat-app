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
exports.LocalBroker = void 0;
const events_1 = require("events");
const models_1 = require("@rocket.chat/models");
const tracing_1 = require("@rocket.chat/tracing");
const _1 = require(".");
class LocalBroker {
    constructor() {
        this.started = false;
        this.methods = new Map();
        this.events = new events_1.EventEmitter();
        this.services = new Set();
    }
    call(method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, tracing_1.tracerActiveSpan)(`action ${method}`, {}, () => {
                return _1.asyncLocalStorage.run({
                    id: 'ctx.id',
                    nodeID: 'ctx.nodeID',
                    requestID: 'ctx.requestID',
                    broker: this,
                }, () => { var _a; return (_a = this.methods.get(method)) === null || _a === void 0 ? void 0 : _a(...data); });
            }, (0, tracing_1.injectCurrentContext)());
        });
    }
    destroyService(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const namespace = instance.getName();
            instance.getEvents().forEach((event) => event.listeners.forEach((listener) => this.events.removeListener(event.eventName, listener)));
            const methods = ((_a = instance.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Object'
                ? Object.getOwnPropertyNames(instance)
                : Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
            for (const method of methods) {
                if (method === 'constructor') {
                    continue;
                }
                this.methods.delete(`${namespace}.${method}`);
            }
            instance.removeAllListeners();
            yield instance.stopped();
        });
    }
    createService(instance) {
        var _a;
        const namespace = instance.getName();
        this.services.add(instance);
        instance.created();
        instance.getEvents().forEach((event) => event.listeners.forEach((listener) => this.events.on(event.eventName, listener)));
        const methods = ((_a = instance.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Object'
            ? Object.getOwnPropertyNames(instance)
            : Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
        for (const method of methods) {
            if (method === 'constructor') {
                continue;
            }
            const i = instance;
            this.methods.set(`${namespace}.${method}`, i[method].bind(i));
        }
        if (this.started) {
            void instance.started();
        }
    }
    onBroadcast(callback) {
        this.events.on('broadcast', callback);
    }
    broadcast(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.broadcastLocal(event, ...args);
            this.events.emit('broadcast', event, args);
        });
    }
    broadcastLocal(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.events.emit(event, ...args);
        });
    }
    broadcastToServices(_services, event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.events.emit(event, ...args);
        });
    }
    nodeList() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO models should not be called form here. we should create an abstraction to an internal service to perform this query
            const instances = yield models_1.InstanceStatus.find({}, { projection: { _id: 1 } }).toArray();
            return instances.map(({ _id }) => ({ id: _id, available: true }));
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([...this.services].map((service) => service.started()));
            this.started = true;
        });
    }
}
exports.LocalBroker = LocalBroker;
