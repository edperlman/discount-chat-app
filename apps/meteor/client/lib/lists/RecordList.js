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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _RecordList_hasChanges, _RecordList_index, _RecordList_phase, _RecordList_items, _RecordList_itemCount, _RecordList_pedingMutation;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordList = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const asyncState_1 = require("../asyncState");
class RecordList extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        _RecordList_hasChanges.set(this, false);
        _RecordList_index.set(this, new Map());
        _RecordList_phase.set(this, asyncState_1.AsyncStatePhase.LOADING);
        _RecordList_items.set(this, undefined);
        _RecordList_itemCount.set(this, undefined);
        _RecordList_pedingMutation.set(this, Promise.resolve());
    }
    filter(_item) {
        return true;
    }
    compare(a, b) {
        var _a, _b;
        const aUpdatedAt = typeof a._updatedAt === 'string' ? new Date(a._updatedAt) : a._updatedAt;
        const bUpdatedAt = typeof b._updatedAt === 'string' ? new Date(b._updatedAt) : b._updatedAt;
        return ((_a = bUpdatedAt === null || bUpdatedAt === void 0 ? void 0 : bUpdatedAt.getTime()) !== null && _a !== void 0 ? _a : -1) - ((_b = aUpdatedAt === null || aUpdatedAt === void 0 ? void 0 : aUpdatedAt.getTime()) !== null && _b !== void 0 ? _b : -1);
    }
    get phase() {
        return __classPrivateFieldGet(this, _RecordList_phase, "f");
    }
    get items() {
        if (!__classPrivateFieldGet(this, _RecordList_items, "f")) {
            __classPrivateFieldSet(this, _RecordList_items, Array.from(__classPrivateFieldGet(this, _RecordList_index, "f").values()).sort(this.compare), "f");
        }
        return __classPrivateFieldGet(this, _RecordList_items, "f");
    }
    get itemCount() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _RecordList_itemCount, "f")) !== null && _a !== void 0 ? _a : __classPrivateFieldGet(this, _RecordList_index, "f").size;
    }
    insert(item) {
        var _a;
        __classPrivateFieldGet(this, _RecordList_index, "f").set(item._id, item);
        this.emit(`${item._id}/inserted`, item);
        if (typeof __classPrivateFieldGet(this, _RecordList_itemCount, "f") === 'number') {
            __classPrivateFieldSet(this, _RecordList_itemCount, (_a = __classPrivateFieldGet(this, _RecordList_itemCount, "f"), _a++, _a), "f");
        }
        __classPrivateFieldSet(this, _RecordList_hasChanges, true, "f");
    }
    update(item) {
        __classPrivateFieldGet(this, _RecordList_index, "f").set(item._id, item);
        this.emit(`${item._id}/updated`, item);
        __classPrivateFieldSet(this, _RecordList_hasChanges, true, "f");
    }
    delete(_id) {
        var _a;
        __classPrivateFieldGet(this, _RecordList_index, "f").delete(_id);
        this.emit(`${_id}/deleted`);
        if (typeof __classPrivateFieldGet(this, _RecordList_itemCount, "f") === 'number') {
            __classPrivateFieldSet(this, _RecordList_itemCount, (_a = __classPrivateFieldGet(this, _RecordList_itemCount, "f"), _a--, _a), "f");
        }
        __classPrivateFieldSet(this, _RecordList_hasChanges, true, "f");
    }
    push(item) {
        const exists = __classPrivateFieldGet(this, _RecordList_index, "f").has(item._id);
        const valid = this.filter(item);
        if (exists && !valid) {
            this.delete(item._id);
            return;
        }
        if (exists && valid) {
            this.update(item);
            return;
        }
        if (!exists && valid) {
            this.insert(item);
        }
    }
    mutate(mutation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (__classPrivateFieldGet(this, _RecordList_phase, "f") === asyncState_1.AsyncStatePhase.RESOLVED) {
                    __classPrivateFieldSet(this, _RecordList_phase, asyncState_1.AsyncStatePhase.UPDATING, "f");
                    this.emit('mutating');
                }
                __classPrivateFieldSet(this, _RecordList_pedingMutation, __classPrivateFieldGet(this, _RecordList_pedingMutation, "f").then(mutation), "f");
                yield __classPrivateFieldGet(this, _RecordList_pedingMutation, "f");
            }
            catch (error) {
                this.emit('errored', error);
            }
            finally {
                const hasChanged = __classPrivateFieldGet(this, _RecordList_hasChanges, "f");
                __classPrivateFieldSet(this, _RecordList_phase, asyncState_1.AsyncStatePhase.RESOLVED, "f");
                if (hasChanged) {
                    __classPrivateFieldSet(this, _RecordList_items, undefined, "f");
                    __classPrivateFieldSet(this, _RecordList_hasChanges, false, "f");
                }
                this.emit('mutated', hasChanged);
            }
        });
    }
    batchHandle(getInfo) {
        return this.mutate(() => __awaiter(this, void 0, void 0, function* () {
            const info = yield getInfo();
            if (info.items) {
                for (const item of info.items) {
                    this.push(item);
                }
            }
            if (info.itemCount) {
                __classPrivateFieldSet(this, _RecordList_itemCount, info.itemCount, "f");
                __classPrivateFieldSet(this, _RecordList_hasChanges, true, "f");
            }
        }));
    }
    prune(matchCriteria) {
        return this.mutate(() => {
            for (const item of __classPrivateFieldGet(this, _RecordList_index, "f").values()) {
                if (matchCriteria(item)) {
                    this.delete(item._id);
                }
            }
        });
    }
    handle(item) {
        return this.mutate(() => {
            this.push(item);
        });
    }
    remove(_id) {
        return this.mutate(() => {
            if (!__classPrivateFieldGet(this, _RecordList_index, "f").has(_id)) {
                return;
            }
            this.delete(_id);
        });
    }
    clear() {
        return this.mutate(() => {
            if (__classPrivateFieldGet(this, _RecordList_index, "f").size === 0) {
                return;
            }
            __classPrivateFieldGet(this, _RecordList_index, "f").clear();
            __classPrivateFieldSet(this, _RecordList_items, undefined, "f");
            __classPrivateFieldSet(this, _RecordList_itemCount, undefined, "f");
            __classPrivateFieldSet(this, _RecordList_hasChanges, true, "f");
            this.emit('cleared');
        });
    }
}
exports.RecordList = RecordList;
_RecordList_hasChanges = new WeakMap(), _RecordList_index = new WeakMap(), _RecordList_phase = new WeakMap(), _RecordList_items = new WeakMap(), _RecordList_itemCount = new WeakMap(), _RecordList_pedingMutation = new WeakMap();
