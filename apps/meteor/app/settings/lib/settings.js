"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsBase = void 0;
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
class SettingsBase {
    constructor() {
        this.callbacks = new Map();
        this.regexCallbacks = new Map();
    }
    get(_id, callback) {
        var _a;
        if (callback != null) {
            this.onload(_id, callback);
            if (!meteor_1.Meteor.settings) {
                return;
            }
            if (_id === '*') {
                return Object.keys(meteor_1.Meteor.settings).forEach((key) => {
                    const value = meteor_1.Meteor.settings[key];
                    callback(key, value);
                });
            }
            if (underscore_1.default.isRegExp(_id) && meteor_1.Meteor.settings) {
                return Object.keys(meteor_1.Meteor.settings).forEach((key) => {
                    if (!_id.test(key)) {
                        return;
                    }
                    const value = meteor_1.Meteor.settings[key];
                    callback(key, value);
                });
            }
            if (typeof _id === 'string') {
                const value = meteor_1.Meteor.settings[_id];
                if (value != null) {
                    callback(_id, meteor_1.Meteor.settings[_id]);
                }
                return;
            }
        }
        if (!meteor_1.Meteor.settings) {
            return;
        }
        if (underscore_1.default.isRegExp(_id)) {
            return Object.keys(meteor_1.Meteor.settings).reduce((items, key) => {
                const value = meteor_1.Meteor.settings[key];
                if (_id.test(key)) {
                    items.push({
                        key,
                        value,
                    });
                }
                return items;
            }, []);
        }
        return (_a = meteor_1.Meteor.settings) === null || _a === void 0 ? void 0 : _a[_id];
    }
    set(_id, value, callback) {
        SDKClient_1.sdk
            .call('saveSetting', _id, value)
            .then((result) => callback(undefined, result))
            .catch(callback);
    }
    batchSet(settings, callback) {
        SDKClient_1.sdk
            .call('saveSettings', settings)
            .then((result) => callback(undefined, result))
            .catch(callback);
    }
    load(key, value, initialLoad) {
        ['*', key].forEach((item) => {
            const callbacks = this.callbacks.get(item);
            if (callbacks) {
                callbacks.forEach((callback) => callback(key, value, initialLoad));
            }
        });
        this.regexCallbacks.forEach((cbValue) => {
            if (!(cbValue === null || cbValue === void 0 ? void 0 : cbValue.regex.test(key))) {
                return;
            }
            cbValue.callbacks.forEach((callback) => callback(key, value, initialLoad));
        });
    }
    onload(key, callback) {
        // if key is '*'
        // 	for key, value in Meteor.settings
        // 		callback key, value, false
        // else if Meteor.settings?[_id]?
        // 	callback key, Meteor.settings[_id], false
        const keys = Array.isArray(key) ? key : [key];
        keys.forEach((k) => {
            var _a, _b;
            if (underscore_1.default.isRegExp(k)) {
                if (!this.regexCallbacks.has(k.source)) {
                    this.regexCallbacks.set(k.source, {
                        regex: k,
                        callbacks: [],
                    });
                }
                (_a = this.regexCallbacks.get(k.source)) === null || _a === void 0 ? void 0 : _a.callbacks.push(callback);
            }
            else {
                if (!this.callbacks.has(k)) {
                    this.callbacks.set(k, []);
                }
                (_b = this.callbacks.get(k)) === null || _b === void 0 ? void 0 : _b.push(callback);
            }
        });
    }
}
exports.SettingsBase = SettingsBase;
