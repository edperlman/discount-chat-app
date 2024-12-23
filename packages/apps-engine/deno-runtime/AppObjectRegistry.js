"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppObjectRegistry = void 0;
exports.AppObjectRegistry = new class {
    constructor() {
        this.registry = {};
    }
    get(key) {
        return this.registry[key];
    }
    set(key, value) {
        this.registry[key] = value;
    }
    has(key) {
        return key in this.registry;
    }
    delete(key) {
        delete this.registry[key];
    }
    clear() {
        this.registry = {};
    }
};
