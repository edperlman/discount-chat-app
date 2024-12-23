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
exports.ServiceClassInternal = exports.ServiceClass = void 0;
const events_1 = require("events");
const asyncLocalStorage_1 = require("../lib/asyncLocalStorage");
class ServiceClass {
    constructor() {
        this.events = new events_1.EventEmitter();
        this.internal = false;
        this.emit = this.emit.bind(this);
    }
    setApi(api) {
        this.api = api;
    }
    getEvents() {
        return this.events.eventNames().map((eventName) => ({
            eventName: eventName,
            listeners: this.events.rawListeners(eventName),
        }));
    }
    removeAllListeners() {
        this.events.removeAllListeners();
    }
    getName() {
        return this.name;
    }
    isInternal() {
        return this.internal;
    }
    get context() {
        return asyncLocalStorage_1.asyncLocalStorage.getStore();
    }
    onEvent(event, handler) {
        this.events.on(event, handler);
    }
    emit(event, ...args) {
        this.events.emit(event, ...args);
    }
    created() {
        return __awaiter(this, void 0, void 0, function* () {
            // noop
        });
    }
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            // noop
        });
    }
    stopped() {
        return __awaiter(this, void 0, void 0, function* () {
            // noop
        });
    }
}
exports.ServiceClass = ServiceClass;
/**
 * An internal service is a service that is registered only on monolith node.
 * Services that run on their own node should use @ServiceClass instead.
 */
class ServiceClassInternal extends ServiceClass {
    constructor() {
        super(...arguments);
        this.internal = true;
    }
}
exports.ServiceClassInternal = ServiceClassInternal;
