"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const meteor_1 = require("meteor/meteor");
const reactive_dict_1 = require("meteor/reactive-dict");
const PublicSettingsCachedCollection_1 = require("../../../../client/lib/settings/PublicSettingsCachedCollection");
const settings_1 = require("../../lib/settings");
class Settings extends settings_1.SettingsBase {
    constructor() {
        super(...arguments);
        this.cachedCollection = PublicSettingsCachedCollection_1.PublicSettingsCachedCollection;
        this.collection = PublicSettingsCachedCollection_1.PublicSettingsCachedCollection.collection;
        this.dict = new reactive_dict_1.ReactiveDict('settings');
    }
    get(_id, ...args) {
        if (_id instanceof RegExp) {
            throw new Error('RegExp Settings.get(RegExp)');
        }
        if (args.length > 0) {
            throw new Error('settings.get(String, callback) only works on backend');
        }
        return this.dict.get(_id);
    }
    _storeSettingValue(record, initialLoad) {
        meteor_1.Meteor.settings[record._id] = record.value;
        this.dict.set(record._id, record.value);
        this.load(record._id, record.value, initialLoad);
    }
    init() {
        let initialLoad = true;
        this.collection.find().observe({
            added: (record) => this._storeSettingValue(record, initialLoad),
            changed: (record) => this._storeSettingValue(record, initialLoad),
            removed: (record) => {
                delete meteor_1.Meteor.settings[record._id];
                this.dict.set(record._id, null);
                this.load(record._id, undefined, initialLoad);
            },
        });
        initialLoad = false;
    }
}
exports.settings = new Settings();
exports.settings.init();
