"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emitter_1 = require("@rocket.chat/emitter");
function getLocalStorage() {
    try {
        return window.localStorage;
    }
    catch (_) {
        const store = {};
        return {
            getItem(name) {
                var _a;
                return (_a = store[name]) !== null && _a !== void 0 ? _a : null;
            },
            setItem(name, val) {
                store[name] = val;
            },
        };
    }
}
const localStorage = getLocalStorage();
class Store extends emitter_1.Emitter {
    constructor(initialState, { localStorageKey = 'store', dontPersist = [], } = {}) {
        super();
        this.localStorageKey = localStorageKey;
        this.dontPersist = dontPersist;
        let storedState;
        try {
            const stored = localStorage.getItem(this.localStorageKey);
            storedState = stored ? JSON.parse(stored) : {};
        }
        catch (e) {
            storedState = {};
        }
        finally {
            storedState = typeof storedState === 'object' ? storedState : {};
        }
        this._state = Object.assign(Object.assign({}, initialState), storedState);
        window.addEventListener('storage', (e) => {
            // Cross-tab communication
            if (e.key !== this.localStorageKey) {
                return;
            }
            if (!e.newValue) {
                // The localStorage has been removed
                return location.reload();
            }
            const storedState = JSON.parse(e.newValue);
            this.setStoredState(storedState);
            this.emit('storageSynced');
        });
    }
    get state() {
        return this._state;
    }
    persist() {
        const persistable = Object.assign({}, this._state);
        for (const ignoredKey of this.dontPersist) {
            delete persistable[ignoredKey];
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(persistable));
    }
    setState(partialState) {
        const prevState = this._state;
        this._state = Object.assign(Object.assign({}, prevState), partialState);
        this.persist();
        this.emit('change', [this._state, prevState, partialState]);
    }
    unsetSinglePropInStateByName(propName) {
        const prevState = this._state;
        delete prevState[propName];
        this._state = Object.assign({}, prevState);
        this.persist();
        this.emit('change', [this._state, prevState]);
    }
    setStoredState(storedState) {
        const prevState = this._state;
        const nonPeristable = {};
        for (const ignoredKey of this.dontPersist) {
            nonPeristable[ignoredKey] = prevState[ignoredKey];
        }
        this._state = Object.assign(Object.assign({}, storedState), nonPeristable);
        this.emit('change', [this._state, prevState]);
    }
}
exports.default = Store;
