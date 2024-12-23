"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const server_1 = require("../../../settings/server");
/**
 * Setting Object in order to manage settings loading for providers and admin ui display
 */
class Setting {
    constructor(basekey, key, type, defaultValue, options = {}) {
        this._basekey = basekey;
        this.key = key;
        this.type = type;
        this.defaultValue = defaultValue;
        this.options = options;
        this._value = undefined;
    }
    get value() {
        return this._value;
    }
    /**
     * Id is generated based on baseKey and key
     */
    get id() {
        return `Search.${this._basekey}.${this.key}`;
    }
    load() {
        this._value = server_1.settings.get(this.id);
        if (this._value === undefined) {
            this._value = this.defaultValue;
        }
    }
}
exports.Setting = Setting;
