"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedSettings = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const underscore_1 = __importDefault(require("underscore"));
const system_1 = require("../../../server/lib/logger/system");
const warn = process.env.NODE_ENV === 'development' || process.env.TEST_MODE;
/**
 * Class responsible for setting up the settings, cache and propagation changes
 * Should be agnostic to the actual settings implementation, running on meteor or standalone
 *
 * You should not instantiate this class directly, only for testing purposes
 *
 * @extends Emitter
 * @alpha
 */
class CachedSettings extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.ready = false;
        this.store = new Map();
        this.getConfig = (config) => (Object.assign({ debounce: process.env.TEST_MODE ? 0 : 500 }, config));
    }
    /**
     * The settings object as ready
     */
    initialized() {
        if (this.ready) {
            return;
        }
        this.ready = true;
        this.emit('ready');
        system_1.SystemLogger.debug('Settings initialized');
    }
    /**
     * returns if the setting is defined
     * @param _id - The setting id
     * @returns {boolean}
     */
    has(_id) {
        if (!this.ready && warn) {
            system_1.SystemLogger.warn(`Settings not initialized yet. getting: ${_id}`);
        }
        return this.store.has(_id);
    }
    /**
     * Gets the current Object of the setting
     * @param _id - The setting id
     * @returns {ISetting} - The current Object of the setting
     */
    getSetting(_id) {
        if (!this.ready && warn) {
            system_1.SystemLogger.warn(`Settings not initialized yet. getting: ${_id}`);
        }
        return this.store.get(_id);
    }
    /**
     * Gets the current value of the setting
     * - In development mode if you are trying to get the value of a setting that is not defined, it will give an warning, in theory it makes sense, there no reason to do that
     * - The setting's value will be cached in memory so it won't call the DB every time you fetch a particular setting
     * @param _id - The setting id
     * @returns {SettingValue} - The current value of the setting
     */
    get(_id) {
        var _a;
        if (!this.ready && warn) {
            system_1.SystemLogger.warn(`Settings not initialized yet. getting: ${_id}`);
        }
        return (_a = this.store.get(_id)) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * Gets the current value of the setting
     * - In development mode if you are trying to get the value of a setting that is not defined, it will give an warning, in theory it makes sense, there no reason to do that
     * @deprecated
     * @param _id - The setting id
     * @returns {SettingValue} - The current value of the setting
     */
    getByRegexp(_id) {
        if (!this.ready && warn) {
            system_1.SystemLogger.warn(`Settings not initialized yet. getting: ${_id}`);
        }
        return [...this.store.entries()].filter(([key]) => _id.test(key)).map(([key, setting]) => [key, setting.value]);
    }
    /**
     * Get the current value of the settings, and keep track of changes
     * - This callback is debounced
     * - The callback is not fire until the settings got initialized
     * @param _ids - Array of setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    watchMultiple(_id, callback) {
        if (!this.ready) {
            const cancel = new Set();
            cancel.add(this.once('ready', () => {
                cancel.clear();
                cancel.add(this.watchMultiple(_id, callback));
            }));
            return () => {
                cancel.forEach((fn) => fn());
            };
        }
        if (_id.every((id) => this.store.has(id))) {
            const settings = _id.map((id) => { var _a; return (_a = this.store.get(id)) === null || _a === void 0 ? void 0 : _a.value; });
            callback(settings);
        }
        const mergeFunction = underscore_1.default.debounce(() => {
            callback(_id.map((id) => { var _a; return (_a = this.store.get(id)) === null || _a === void 0 ? void 0 : _a.value; }));
        }, 100);
        const fns = _id.map((id) => this.on(id, mergeFunction));
        return () => {
            fns.forEach((fn) => fn());
        };
    }
    /**
     * Get the current value of the setting, and keep track of changes
     * - This callback is debounced
     * - The callback is not fire until the settings got initialized
     * @param _id - The setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    watch(_id, cb, config) {
        var _a;
        if (!this.ready) {
            const cancel = new Set();
            cancel.add(this.once('ready', () => {
                cancel.clear();
                cancel.add(this.watch(_id, cb, config));
            }));
            return () => {
                cancel.forEach((fn) => fn());
            };
        }
        this.store.has(_id) && cb((_a = this.store.get(_id)) === null || _a === void 0 ? void 0 : _a.value);
        return this.change(_id, cb, config);
    }
    /**
     * Get the current value of the setting, or wait until the initialized
     * - This is a one time run
     * - This callback is debounced
     * - The callback is not fire until the settings got initialized
     * @param _id - The setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    watchOnce(_id, cb, config) {
        var _a;
        if (this.store.has(_id)) {
            cb((_a = this.store.get(_id)) === null || _a === void 0 ? void 0 : _a.value);
            return () => undefined;
        }
        return this.changeOnce(_id, cb, config);
    }
    /**
     * Observes the given setting by id and keep track of changes
     * - This callback is debounced
     * - The callback is not fire until the setting is changed
     * - The callback is not fire until all the settings get initialized
     * @param _id - The setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    change(_id, callback, config) {
        const { debounce } = this.getConfig(config);
        return this.on(_id, underscore_1.default.debounce(callback, debounce));
    }
    /**
     * Observes multiple settings and keep track of changes
     * - This callback is debounced
     * - The callback is not fire until the setting is changed
     * - The callback is not fire until all the settings get initialized
     * @param _ids - Array of setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    changeMultiple(_ids, callback, config) {
        const fns = _ids.map((id) => this.change(id, () => {
            callback(_ids.map((id) => { var _a; return (_a = this.store.get(id)) === null || _a === void 0 ? void 0 : _a.value; }));
        }, config));
        return () => {
            fns.forEach((fn) => fn());
        };
    }
    /**
     * Observes the setting and fires only if there is a change. Runs only once
     * - This is a one time run
     * - This callback is debounced
     * - The callback is not fire until the setting is changed
     * - The callback is not fire until all the settings get initialized
     * @param _id - The setting id
     * @param callback - The callback to run
     * @returns {() => void} - A function that can be used to cancel the observe
     */
    changeOnce(_id, callback, config) {
        const { debounce } = this.getConfig(config);
        return this.once(_id, underscore_1.default.debounce(callback, debounce));
    }
    /**
     * Sets the value of the setting
     * - if the value set is the same as the current value, the change will not be fired
     * - if the value is set before the initialization, the emit will be queued and will be fired after initialization
     * @param _id - The setting id
     * @param value - The value to set
     * @returns {void}
     */
    set(record) {
        var _a, _b, _c;
        if (this.store.has(record._id) && ((_a = this.store.get(record._id)) === null || _a === void 0 ? void 0 : _a.value) === record.value) {
            return;
        }
        this.store.set(record._id, record);
        if (!this.ready) {
            this.once('ready', () => {
                var _a, _b;
                this.emit(record._id, (_a = this.store.get(record._id)) === null || _a === void 0 ? void 0 : _a.value);
                this.emit('*', [record._id, (_b = this.store.get(record._id)) === null || _b === void 0 ? void 0 : _b.value]);
            });
            return;
        }
        this.emit(record._id, (_b = this.store.get(record._id)) === null || _b === void 0 ? void 0 : _b.value);
        this.emit('*', [record._id, (_c = this.store.get(record._id)) === null || _c === void 0 ? void 0 : _c.value]);
    }
    /** @deprecated */
    watchByRegex(regex, cb, config) {
        if (!this.ready) {
            const cancel = new Set();
            cancel.add(this.once('ready', () => {
                cancel.clear();
                cancel.add(this.watchByRegex(regex, cb, config));
            }));
            return () => {
                cancel.forEach((fn) => fn());
            };
        }
        [...this.store.entries()].forEach(([key, setting]) => {
            if (regex.test(key)) {
                cb(key, setting.value);
            }
        });
        return this.changeByRegex(regex, cb, config);
    }
    /** @deprecated */
    changeByRegex(regex, callback, config) {
        const store = new Map();
        return this.on('*', ([_id, value]) => {
            if (regex.test(_id)) {
                const { debounce } = this.getConfig(config);
                const cb = store.get(_id) || underscore_1.default.debounce(callback, debounce);
                cb(_id, value);
                store.set(_id, cb);
            }
            regex.lastIndex = 0;
        });
    }
    /**
     * Wait until the settings get ready then run the callback
     */
    onReady(cb) {
        if (this.ready) {
            return cb();
        }
        this.once('ready', cb);
    }
}
exports.CachedSettings = CachedSettings;
