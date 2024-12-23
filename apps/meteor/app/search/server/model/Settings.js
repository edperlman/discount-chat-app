"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const Setting_1 = require("./Setting");
/**
 * Settings Object allows to manage Setting Objects
 */
class Settings {
    constructor(basekey) {
        this.basekey = basekey;
        this.settings = {};
    }
    add(key, type, defaultValue, options) {
        this.settings[key] = new Setting_1.Setting(this.basekey, key, type, defaultValue, options);
    }
    list() {
        return Object.keys(this.settings).map((key) => this.settings[key]);
    }
    map() {
        return this.settings;
    }
    /**
     * return the value for key
     */
    get(key) {
        if (!this.settings[key]) {
            throw new Error('Setting is not set');
        }
        return this.settings[key].value;
    }
    /**
     * load currently stored values of all settings
     */
    load() {
        Object.keys(this.settings).forEach((key) => {
            this.settings[key].load();
        });
    }
}
exports.Settings = Settings;
