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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRegistry = exports.compareSettings = exports.SettingsEvents = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const emitter_1 = require("@rocket.chat/emitter");
const underscore_1 = require("underscore");
const getSettingDefaults_1 = require("./functions/getSettingDefaults");
const overrideSetting_1 = require("./functions/overrideSetting");
const overwriteSetting_1 = require("./functions/overwriteSetting");
const validateSetting_1 = require("./functions/validateSetting");
const system_1 = require("../../../server/lib/logger/system");
const blockedSettings = new Set();
const hiddenSettings = new Set();
const wizardRequiredSettings = new Set();
if (process.env.SETTINGS_BLOCKED) {
    process.env.SETTINGS_BLOCKED.split(',').forEach((settingId) => blockedSettings.add(settingId.trim()));
}
if (process.env.SETTINGS_HIDDEN) {
    process.env.SETTINGS_HIDDEN.split(',').forEach((settingId) => hiddenSettings.add(settingId.trim()));
}
if (process.env.SETTINGS_REQUIRED_ON_WIZARD) {
    process.env.SETTINGS_REQUIRED_ON_WIZARD.split(',').forEach((settingId) => wizardRequiredSettings.add(settingId.trim()));
}
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
/*
 * @deprecated
 * please do not use event emitter to mutate values
 */
exports.SettingsEvents = new emitter_1.Emitter();
const getGroupDefaults = (_id, options = {}) => (Object.assign(Object.assign(Object.assign({ _id, i18nLabel: _id, i18nDescription: `${_id}_Description` }, options), { sorter: options.sorter || 0, blocked: blockedSettings.has(_id), hidden: hiddenSettings.has(_id), type: 'group' }), (options.displayQuery && { displayQuery: JSON.stringify(options.displayQuery) })));
const compareSettingsIgnoringKeys = (keys) => (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .filter((key) => !keys.includes(key))
    .every((key) => (0, underscore_1.isEqual)(a[key], b[key]));
exports.compareSettings = compareSettingsIgnoringKeys([
    'value',
    'ts',
    'createdAt',
    'valueSource',
    'packageValue',
    'processEnvValue',
    '_updatedAt',
]);
class SettingsRegistry {
    constructor({ store, model }) {
        this._sorter = {};
        this.store = store;
        this.model = model;
    }
    /*
     * Add a setting
     */
    add(_id_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (_id, value, _a = {}) {
            var _b, _c;
            var { sorter, section, group } = _a, options = __rest(_a, ["sorter", "section", "group"]);
            if (!_id || value == null) {
                throw new Error('Invalid arguments');
            }
            const sorterKey = group && section ? `${group}_${section}` : group;
            if (sorterKey && this._sorter[sorterKey] == null) {
                if (group && section) {
                    const currentGroupValue = (_b = this._sorter[group]) !== null && _b !== void 0 ? _b : 0;
                    this._sorter[sorterKey] = currentGroupValue * 1000;
                }
            }
            if (sorterKey) {
                this._sorter[sorterKey] = (_c = this._sorter[sorterKey]) !== null && _c !== void 0 ? _c : -1;
            }
            const settingFromCode = (0, getSettingDefaults_1.getSettingDefaults)(Object.assign({ _id, type: 'string', value, sorter: sorter !== null && sorter !== void 0 ? sorter : ((sorterKey === null || sorterKey === void 0 ? void 0 : sorterKey.length) && this._sorter[sorterKey]++), group,
                section }, options), blockedSettings, hiddenSettings, wizardRequiredSettings);
            if ((0, core_typings_1.isSettingEnterprise)(settingFromCode) && !('invalidValue' in settingFromCode)) {
                system_1.SystemLogger.error(`Enterprise setting ${_id} is missing the invalidValue option`);
                throw new Error(`Enterprise setting ${_id} is missing the invalidValue option`);
            }
            const settingFromCodeOverwritten = (0, overwriteSetting_1.overwriteSetting)(settingFromCode);
            const settingStored = this.store.getSetting(_id);
            const settingStoredOverwritten = settingStored && (0, overwriteSetting_1.overwriteSetting)(settingStored);
            try {
                (0, validateSetting_1.validateSetting)(settingFromCode._id, settingFromCode.type, settingFromCode.value);
            }
            catch (e) {
                IS_DEVELOPMENT && system_1.SystemLogger.error(`Invalid setting code ${_id}: ${e.message}`);
            }
            const isOverwritten = settingFromCode !== settingFromCodeOverwritten || (settingStored && settingStored !== settingStoredOverwritten);
            const { _id: _ } = settingFromCodeOverwritten, settingProps = __rest(settingFromCodeOverwritten, ["_id"]);
            if (settingStored && !(0, exports.compareSettings)(settingStored, settingFromCodeOverwritten)) {
                const { value: _value } = settingFromCodeOverwritten, settingOverwrittenProps = __rest(settingFromCodeOverwritten, ["value"]);
                const overwrittenKeys = Object.keys(settingFromCodeOverwritten);
                const removedKeys = Object.keys(settingStored).filter((key) => !['_updatedAt'].includes(key) && !overwrittenKeys.includes(key));
                const updatedProps = (() => {
                    return Object.assign(Object.assign({}, settingOverwrittenProps), (settingStoredOverwritten &&
                        settingStored.value !== settingStoredOverwritten.value && { value: settingStoredOverwritten.value }));
                })();
                yield this.saveUpdatedSetting(_id, updatedProps, removedKeys);
                if ('value' in updatedProps) {
                    this.store.set(updatedProps);
                }
                return;
            }
            if (settingStored && isOverwritten) {
                if (settingStored.value !== settingFromCodeOverwritten.value) {
                    const overwrittenKeys = Object.keys(settingFromCodeOverwritten);
                    const removedKeys = Object.keys(settingStored).filter((key) => !['_updatedAt'].includes(key) && !overwrittenKeys.includes(key));
                    yield this.saveUpdatedSetting(_id, settingProps, removedKeys);
                    this.store.set(settingFromCodeOverwritten);
                }
                return;
            }
            if (settingStored) {
                try {
                    (0, validateSetting_1.validateSetting)(settingFromCode._id, settingFromCode.type, settingStored === null || settingStored === void 0 ? void 0 : settingStored.value);
                }
                catch (e) {
                    IS_DEVELOPMENT && system_1.SystemLogger.error(`Invalid setting stored ${_id}: ${e.message}`);
                }
                return;
            }
            const settingOverwrittenDefault = (0, overrideSetting_1.overrideSetting)(settingFromCode);
            const setting = isOverwritten ? settingFromCodeOverwritten : settingOverwrittenDefault;
            yield this.model.insertOne(setting); // no need to emit unless we remove the oplog
            this.store.set(setting);
        });
    }
    // eslint-disable-next-line no-dupe-class-members
    addGroup(_id_1) {
        return __awaiter(this, arguments, void 0, function* (_id, groupOptions = {}, cb) {
            if (!_id || (groupOptions instanceof Function && cb)) {
                throw new Error('Invalid arguments');
            }
            const callback = groupOptions instanceof Function ? groupOptions : cb;
            const options = groupOptions instanceof Function
                ? getGroupDefaults(_id, { sorter: this._sorter[_id] })
                : getGroupDefaults(_id, Object.assign({ sorter: this._sorter[_id] }, groupOptions));
            if (!this.store.has(_id)) {
                options.ts = new Date();
                yield this.model.insertOne(options);
                this.store.set(options);
            }
            if (!callback) {
                return;
            }
            const addWith = (preset) => (id, value, options = {}) => {
                const mergedOptions = Object.assign(Object.assign({}, preset), options);
                return this.add(id, value, mergedOptions);
            };
            const sectionSetWith = (preset) => (options, cb) => {
                const mergedOptions = Object.assign(Object.assign({}, preset), options);
                return cb.call({
                    add: addWith(mergedOptions),
                    with: sectionSetWith(mergedOptions),
                });
            };
            const sectionWith = (preset) => (section, cb) => {
                const mergedOptions = Object.assign(Object.assign({}, preset), { section });
                return cb.call({
                    add: addWith(mergedOptions),
                    with: sectionSetWith(mergedOptions),
                });
            };
            const groupSetWith = (preset) => (options, cb) => {
                const mergedOptions = Object.assign(Object.assign({}, preset), options);
                return cb.call({
                    add: addWith(mergedOptions),
                    section: sectionWith(mergedOptions),
                    with: groupSetWith(mergedOptions),
                });
            };
            return groupSetWith({ group: _id })({}, callback);
        });
    }
    saveUpdatedSetting(_id, settingProps, removedKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne({ _id }, Object.assign({ $set: settingProps }, ((removedKeys === null || removedKeys === void 0 ? void 0 : removedKeys.length) && {
                $unset: removedKeys.reduce((unset, key) => (Object.assign(Object.assign({}, unset), { [key]: 1 })), {}),
            })), { upsert: true });
        });
    }
}
exports.SettingsRegistry = SettingsRegistry;
