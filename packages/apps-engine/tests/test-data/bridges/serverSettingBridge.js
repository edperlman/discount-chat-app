"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsServerSettingBridge = void 0;
const settings_1 = require("../../../src/definition/settings");
const bridges_1 = require("../../../src/server/bridges");
class TestsServerSettingBridge extends bridges_1.ServerSettingBridge {
    getAll(appId) {
        throw new Error('Method not implemented.');
    }
    getOneById(id, appId) {
        return Promise.resolve({
            id,
            packageValue: 'packageValue',
            value: 'value',
            i18nLabel: 'i18nLabel',
            i18nDescription: 'i18nDescription',
            required: true,
            public: true,
            type: settings_1.SettingType.STRING,
        });
    }
    hideGroup(name) {
        throw new Error('Method not implemented.');
    }
    hideSetting(id) {
        throw new Error('Method not implemented.');
    }
    isReadableById(id, appId) {
        throw new Error('Method not implemented.');
    }
    updateOne(setting, appId) {
        throw new Error('Method not implemented.');
    }
    incrementValue(id, value, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsServerSettingBridge = TestsServerSettingBridge;
