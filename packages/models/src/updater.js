"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdaterImpl = void 0;
class UpdaterImpl {
    constructor() {
        this.dirty = false;
    }
    set(key, value) {
        var _a;
        this._set = (_a = this._set) !== null && _a !== void 0 ? _a : new Map();
        this._set.set(key, value);
        return this;
    }
    unset(key) {
        var _a;
        this._unset = (_a = this._unset) !== null && _a !== void 0 ? _a : new Set();
        this._unset.add(key);
        return this;
    }
    inc(key, value) {
        var _a, _b;
        this._inc = (_a = this._inc) !== null && _a !== void 0 ? _a : new Map();
        const prev = (_b = this._inc.get(key)) !== null && _b !== void 0 ? _b : 0;
        this._inc.set(key, prev + value);
        return this;
    }
    addToSet(key, value) {
        var _a, _b;
        this._addToSet = (_a = this._addToSet) !== null && _a !== void 0 ? _a : new Map();
        const prev = (_b = this._addToSet.get(key)) !== null && _b !== void 0 ? _b : [];
        this._addToSet.set(key, [...prev, value]);
        return this;
    }
    hasChanges() {
        const filter = this._getUpdateFilter();
        return this._hasChanges(filter);
    }
    _hasChanges(filter) {
        return Object.keys(filter).length > 0;
    }
    _getUpdateFilter() {
        return Object.assign(Object.assign(Object.assign(Object.assign({}, (this._set && { $set: Object.fromEntries(this._set) })), (this._unset && { $unset: Object.fromEntries([...this._unset.values()].map((k) => [k, 1])) })), (this._inc && { $inc: Object.fromEntries(this._inc) })), (this._addToSet && { $addToSet: Object.fromEntries([...this._addToSet.entries()].map(([k, v]) => [k, { $each: v }])) }));
    }
    getUpdateFilter() {
        if (this.dirty) {
            throw new Error('Updater is dirty');
        }
        this.dirty = true;
        const filter = this._getUpdateFilter();
        if (!this._hasChanges(filter)) {
            throw new Error('No changes to update');
        }
        return filter;
    }
}
exports.UpdaterImpl = UpdaterImpl;
