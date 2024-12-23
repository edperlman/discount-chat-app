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
exports.Callbacks = void 0;
const random_1 = require("@rocket.chat/random");
const comparisons_1 = require("../utils/comparisons");
var CallbackPriority;
(function (CallbackPriority) {
    CallbackPriority[CallbackPriority["HIGH"] = -1000] = "HIGH";
    CallbackPriority[CallbackPriority["MEDIUM"] = 0] = "MEDIUM";
    CallbackPriority[CallbackPriority["LOW"] = 1000] = "LOW";
})(CallbackPriority || (CallbackPriority = {}));
class Callbacks {
    constructor() {
        this.logger = undefined;
        this.trackCallback = undefined;
        this.trackHook = undefined;
        this.callbacks = new Map();
        this.sequentialRunners = new Map();
        this.asyncRunners = new Map();
        this.priority = CallbackPriority;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    setMetricsTrackers({ trackCallback, trackHook }) {
        this.trackCallback = trackCallback;
        this.trackHook = trackHook;
    }
    runOne(callback, item, constant) {
        var _a;
        const stopTracking = (_a = this.trackCallback) === null || _a === void 0 ? void 0 : _a.call(this, callback);
        return Promise.resolve(callback(item, constant)).finally(stopTracking);
    }
    createSequentialRunner(hook, callbacks) {
        const wrapCallback = (callback) => (item, constant) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`Executing callback with id ${callback.id} for hook ${callback.hook}`);
            return (_b = (yield this.runOne(callback, item, constant))) !== null && _b !== void 0 ? _b : item;
        });
        const identity = (item) => Promise.resolve(item);
        const pipe = (curr, next) => (item, constant) => __awaiter(this, void 0, void 0, function* () { return next(yield curr(item, constant), constant); });
        const fn = callbacks.map(wrapCallback).reduce(pipe, identity);
        return (item, constant) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const stopTracking = (_a = this.trackHook) === null || _a === void 0 ? void 0 : _a.call(this, { hook, length: callbacks.length });
            return fn(item, constant).finally(() => stopTracking === null || stopTracking === void 0 ? void 0 : stopTracking());
        });
    }
    createAsyncRunner(_, callbacks) {
        return (item, constant) => {
            if (typeof window !== 'undefined') {
                throw new Error('callbacks.runAsync on client server not allowed');
            }
            for (const callback of callbacks) {
                setTimeout(() => {
                    void this.runOne(callback, item, constant);
                }, 0);
            }
            return item;
        };
    }
    getCallbacks(hook) {
        var _a;
        return (_a = this.callbacks.get(hook)) !== null && _a !== void 0 ? _a : [];
    }
    setCallbacks(hook, callbacks) {
        this.callbacks.set(hook, callbacks);
        this.sequentialRunners.set(hook, this.createSequentialRunner(hook, callbacks));
        this.asyncRunners.set(hook, this.createAsyncRunner(hook, callbacks));
    }
    add(hook, callback, priority = this.priority.MEDIUM, id = random_1.Random.id()) {
        const callbacks = this.getCallbacks(hook);
        if (callbacks.some((cb) => cb.id === id)) {
            return;
        }
        callbacks.push(Object.assign(callback, {
            hook,
            priority,
            id,
            stack: new Error().stack,
        }));
        callbacks.sort((0, comparisons_1.compareByRanking)((callback) => { var _a; return (_a = callback.priority) !== null && _a !== void 0 ? _a : this.priority.MEDIUM; }));
        this.setCallbacks(hook, callbacks);
    }
    /**
     * Remove a callback from a hook
     *
     * @param hook the name of the hook
     * @param id the callback's id
     */
    remove(hook, id) {
        const hooks = this.getCallbacks(hook).filter((callback) => callback.id !== id);
        this.setCallbacks(hook, hooks);
    }
    /**
     * Successively run all of a hook's callbacks on an item
     *
     * @param hook the name of the hook
     * @param item the post, comment, modifier, etc. on which to run the callbacks
     * @param constant an optional constant that will be passed along to each callback
     * @returns returns the item after it's been through all the callbacks for this hook
     */
    run(hook, item, constant) {
        var _a;
        const runner = (_a = this.sequentialRunners.get(hook)) !== null && _a !== void 0 ? _a : ((item, _constant) => __awaiter(this, void 0, void 0, function* () { return item; }));
        return runner(item, constant);
    }
    /**
     * Successively run all of a hook's callbacks on an item, in async mode (only works on server)
     *
     * @param hook the name of the hook
     * @param item the post, comment, modifier, etc. on which to run the callbacks
     * @param constant an optional constant that will be passed along to each callback
     * @returns the post, comment, modifier, etc. on which to run the callbacks
     */
    runAsync(hook, item, constant) {
        var _a;
        const runner = (_a = this.asyncRunners.get(hook)) !== null && _a !== void 0 ? _a : ((item, _constant) => item);
        return runner(item, constant);
    }
    static create(hook) {
        const callbacks = new Callbacks();
        return {
            add: (callback, priority, id) => callbacks.add(hook, callback, priority, id),
            remove: (id) => callbacks.remove(hook, id),
            run: (item, constant) => callbacks.run(hook, item, constant),
        };
    }
}
exports.Callbacks = Callbacks;
