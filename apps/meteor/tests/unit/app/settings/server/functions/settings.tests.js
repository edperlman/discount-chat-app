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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const CachedSettings_1 = require("../../../../../../app/settings/server/CachedSettings");
const SettingsRegistry_1 = require("../../../../../../app/settings/server/SettingsRegistry");
const getSettingDefaults_1 = require("../../../../../../app/settings/server/functions/getSettingDefaults");
const settings_mocks_1 = require("../../../../../../app/settings/server/functions/settings.mocks");
const testSetting = (0, getSettingDefaults_1.getSettingDefaults)({
    _id: 'my_dummy_setting',
    type: 'string',
    value: 'dummy',
});
(0, mocha_1.describe)('Settings', () => {
    (0, mocha_1.beforeEach)(() => {
        settings_mocks_1.Settings.insertCalls = 0;
        settings_mocks_1.Settings.upsertCalls = 0;
        process.env = {};
        settings_mocks_1.Settings.setDelay(0);
    });
    (0, mocha_1.it)('should not insert the same setting twice', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', true, {
                            type: 'boolean',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.be.include({
            type: 'boolean',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: true,
            value: true,
            valueSource: 'packageValue',
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting',
            i18nDescription: 'my_setting_Description',
            autocomplete: true,
        });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', true, {
                            type: 'boolean',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' }).value).to.be.equal(true);
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting2', false, {
                            type: 'boolean',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(3);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' }).value).to.be.equal(true);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting2' }).value).to.be.equal(false);
    }));
    (0, mocha_1.it)('should respect override via environment as int', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        process.env.OVERWRITE_SETTING_my_setting = '1';
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', 0, {
                            type: 'int',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        const expectedSetting = {
            value: 1,
            processEnvValue: 1,
            valueSource: 'processEnvValue',
            type: 'int',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: 0,
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting',
            i18nDescription: 'my_setting_Description',
            autocomplete: true,
        };
        (0, chai_1.expect)(settings_mocks_1.Settings).to.have.property('insertCalls').to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings).to.have.property('upsertCalls').to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.include(expectedSetting);
        process.env.OVERWRITE_SETTING_my_setting = '2';
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', 0, {
                            type: 'int',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings).to.have.property('insertCalls').to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings).to.have.property('upsertCalls').to.be.equal(1);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.include(Object.assign(Object.assign({}, expectedSetting), { value: 2, processEnvValue: 2 }));
    }));
    (0, mocha_1.it)('should respect override via environment as boolean', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.OVERWRITE_SETTING_my_setting_bool = 'true';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_bool', false, {
                            type: 'boolean',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        const expectedSetting = {
            value: true,
            processEnvValue: true,
            valueSource: 'processEnvValue',
            type: 'boolean',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: false,
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting_bool',
            i18nDescription: 'my_setting_bool_Description',
            autocomplete: true,
        };
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_bool' })).to.include(expectedSetting);
        process.env.OVERWRITE_SETTING_my_setting_bool = 'false';
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_bool', true, {
                            type: 'boolean',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(1);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_bool' })).to.include({
            value: false,
            processEnvValue: false,
            packageValue: true,
        });
    }));
    (0, mocha_1.it)('should respect override via environment as string', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.OVERWRITE_SETTING_my_setting_str = 'hey';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_str', '', {
                            type: 'string',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        const expectedSetting = {
            value: 'hey',
            processEnvValue: 'hey',
            valueSource: 'processEnvValue',
            type: 'string',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: '',
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting_str',
            i18nDescription: 'my_setting_str_Description',
            autocomplete: true,
        };
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_str' })).to.include(expectedSetting);
        process.env.OVERWRITE_SETTING_my_setting_str = 'hey ho';
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_str', 'hey', {
                            type: 'string',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(1);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_str' })).to.include(Object.assign(Object.assign({}, expectedSetting), { value: 'hey ho', processEnvValue: 'hey ho', packageValue: 'hey' }));
    }));
    (0, mocha_1.it)('should work with a setting type multiSelect with a default value', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_multiselect', ['a'], {
                            type: 'multiSelect',
                            sorter: 0,
                            values: [
                                { key: 'a', i18nLabel: 'a' },
                                { key: 'b', i18nLabel: 'b' },
                                { key: 'c', i18nLabel: 'c' },
                            ],
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).value).to.be.deep.equal(['a']);
    }));
    (0, mocha_1.it)('should respect override via environment as multiSelect', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.OVERWRITE_SETTING_my_setting_multiselect = '["a","b"]';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_multiselect', ['a'], {
                            type: 'multiSelect',
                            sorter: 0,
                            values: [
                                { key: 'a', i18nLabel: 'a' },
                                { key: 'b', i18nLabel: 'b' },
                                { key: 'c', i18nLabel: 'c' },
                            ],
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).value).to.be.deep.equal(['a', 'b']);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).processEnvValue).to.be.deep.equal(['a', 'b']);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).valueSource).to.be.equal('processEnvValue');
    }));
    (0, mocha_1.it)('should ignore override via environment as multiSelect if value is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.OVERWRITE_SETTING_my_setting_multiselect = '[INVALID_ARRAY]';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting_multiselect', ['a'], {
                            type: 'multiSelect',
                            sorter: 0,
                            values: [
                                { key: 'a', i18nLabel: 'a' },
                                { key: 'b', i18nLabel: 'b' },
                                { key: 'c', i18nLabel: 'c' },
                            ],
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).value).to.be.deep.equal(['a']);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).processEnvValue).to.be.equal(undefined);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting_multiselect' }).valueSource).to.be.equal('packageValue');
    }));
    (0, mocha_1.it)('should respect initial value via environment', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.my_setting = '1';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', 0, {
                            type: 'int',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        const expectedSetting = {
            value: 1,
            processEnvValue: 1,
            valueSource: 'processEnvValue',
            type: 'int',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: 0,
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting',
            i18nDescription: 'my_setting_Description',
            autocomplete: true,
        };
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.include(expectedSetting);
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', 0, {
                            type: 'int',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.include(Object.assign({}, expectedSetting));
    }));
    (0, mocha_1.it)('should respect override via environment when changing settings props', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.section('section', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('my_setting', 0, {
                            type: 'int',
                            sorter: 0,
                        });
                    });
                });
            });
        });
        const expectedSetting = {
            value: 0,
            type: 'int',
            sorter: 0,
            group: 'group',
            section: 'section',
            packageValue: 0,
            hidden: false,
            blocked: false,
            secret: false,
            i18nLabel: 'my_setting',
            i18nDescription: 'my_setting_Description',
            autocomplete: true,
        };
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' })).to.include(expectedSetting);
        process.env.OVERWRITE_SETTING_my_setting = '1';
        yield settingsRegistry.addGroup('group', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // removed section
                yield this.add('my_setting', 0, {
                    type: 'int',
                    sorter: 0,
                });
            });
        });
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(2);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(1);
        const { section: _section } = expectedSetting, removedSection = __rest(expectedSetting, ["section"]);
        const settingWithoutSection = Object.assign(Object.assign({}, removedSection), { value: 1, processEnvValue: 1, valueSource: 'processEnvValue' });
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: 'my_setting' }))
            .to.include(Object.assign({}, settingWithoutSection))
            .to.not.have.any.keys('section');
    }));
    (0, mocha_1.it)('should ignore setting object from code if only value changes in code and setting already stored', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(1);
        settings_mocks_1.Settings.insertCalls = 0;
        const settingFromCodeFaked = Object.assign(Object.assign({}, testSetting), { value: Date.now().toString() });
        yield settingsRegistry.add(settingFromCodeFaked._id, settingFromCodeFaked.value, settingFromCodeFaked);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(0);
    }));
    (0, mocha_1.it)('should not update (reset) cached setting with value in code if some prop in code changes (including value)', () => __awaiter(void 0, void 0, void 0, function* () {
        settings_mocks_1.Settings.setDelay(1000);
        const settings = new CachedSettings_1.CachedSettings();
        process.env[`OVERWRITE_SETTING_${testSetting._id}`] = 'false';
        const storedSetting = Object.assign(Object.assign({}, testSetting), { value: true, packageValue: true });
        settings.set(storedSetting);
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        (0, chai_1.expect)(settings.get(storedSetting._id)).to.be.equal(true);
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        const settingFromCodeFaked = Object.assign(Object.assign({}, storedSetting), { value: true, enterprise: true, invalidValue: '' });
        yield settingsRegistry.add(settingFromCodeFaked._id, settingFromCodeFaked.value, settingFromCodeFaked);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(1);
        (0, chai_1.expect)(settings.get(storedSetting._id)).to.be.equal(false);
    }));
    (0, mocha_1.it)('should update cached setting with value from environment if some prop including value in code changes', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(1);
        settings_mocks_1.Settings.insertCalls = 0;
        const settingFromCodeFaked = Object.assign(Object.assign({}, testSetting), { value: Date.now().toString(), enterprise: true, invalidValue: '' });
        process.env[`OVERWRITE_SETTING_${testSetting._id}`] = Date.now().toString();
        yield settingsRegistry.add(settingFromCodeFaked._id, settingFromCodeFaked.value, settingFromCodeFaked);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(0);
        (0, chai_1.expect)(settings_mocks_1.Settings.upsertCalls).to.be.equal(1);
        (0, chai_1.expect)(settings.get(testSetting._id)).to.be.equal(process.env[`OVERWRITE_SETTING_${testSetting._id}`]);
    }));
    (0, mocha_1.it)('should ignore default value from environment if setting is already stored', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        process.env[testSetting._id] = Date.now().toString();
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings_mocks_1.Settings.findOne({ _id: testSetting._id }).value).to.be.equal(testSetting.value);
    }));
    (0, mocha_1.it)('should update setting cache synchronously if overwrite is available in environment', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        settings.set(testSetting);
        process.env[`OVERWRITE_SETTING_${testSetting._id}`] = Date.now().toString();
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings.get(testSetting._id)).to.be.equal(process.env[`OVERWRITE_SETTING_${testSetting._id}`]);
    }));
    (0, mocha_1.it)('should update cached value with OVERWRITE_SETTING value even if both overwrite and default overwrite variables both exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        process.env[`OVERWRITE_SETTING_${testSetting._id}`] = Date.now().toString();
        process.env[testSetting._id] = Date.now().toString();
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings_mocks_1.Settings.insertCalls).to.be.equal(1);
        (0, chai_1.expect)(settings.get(testSetting._id)).to.be.equal(process.env[`OVERWRITE_SETTING_${testSetting._id}`]);
    }));
    (0, mocha_1.it)('should call `settings.get` callback on setting added', () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            const settings = new CachedSettings_1.CachedSettings();
            settings_mocks_1.Settings.settings = settings;
            settings.initialized();
            const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
            const spiedCallback1 = (0, chai_1.spy)();
            const spiedCallback2 = (0, chai_1.spy)();
            yield settingsRegistry.addGroup('group', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.section('section', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.add('setting_callback', 'value1', {
                                type: 'string',
                            });
                        });
                    });
                });
            });
            settings.watch('setting_callback', spiedCallback1, { debounce: 10 });
            settings.watchByRegex(/setting_callback/, spiedCallback2, { debounce: 10 });
            setTimeout(() => {
                (0, chai_1.expect)(spiedCallback1).to.have.been.called.exactly(1);
                (0, chai_1.expect)(spiedCallback2).to.have.been.called.exactly(1);
                (0, chai_1.expect)(spiedCallback1).to.have.been.called.always.with('value1');
                (0, chai_1.expect)(spiedCallback2).to.have.been.called.always.with('setting_callback', 'value1');
                resolve();
            }, settings.getConfig({ debounce: 10 }).debounce);
        }));
    }));
    (0, mocha_1.it)('should call `settings.watch` callback on setting changed registering before initialized', () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            const spiedCallback1 = (0, chai_1.spy)();
            const spiedCallback2 = (0, chai_1.spy)();
            const settings = new CachedSettings_1.CachedSettings();
            settings_mocks_1.Settings.settings = settings;
            const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
            settings.watch('setting_callback', spiedCallback1, { debounce: 1 });
            settings.watchByRegex(/setting_callback/gi, spiedCallback2, { debounce: 1 });
            settings.initialized();
            yield settingsRegistry.addGroup('group', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.section('section', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.add('setting_callback', 'value2', {
                                type: 'string',
                            });
                        });
                    });
                });
            });
            setTimeout(() => {
                settings_mocks_1.Settings.updateValueById('setting_callback', 'value3');
                setTimeout(() => {
                    (0, chai_1.expect)(spiedCallback1).to.have.been.called.exactly(2);
                    (0, chai_1.expect)(spiedCallback2).to.have.been.called.exactly(2);
                    (0, chai_1.expect)(spiedCallback1).to.have.been.called.with('value2');
                    (0, chai_1.expect)(spiedCallback1).to.have.been.called.with('value3');
                    resolve();
                }, settings.getConfig({ debounce: 10 }).debounce);
            }, settings.getConfig({ debounce: 10 }).debounce);
        }));
    }));
    (0, mocha_1.it)('should update the stored value on setting change', () => __awaiter(void 0, void 0, void 0, function* () {
        settings_mocks_1.Settings.setDelay(10);
        process.env[`OVERWRITE_SETTING_${testSetting._id}`] = 'false';
        const settings = new CachedSettings_1.CachedSettings();
        settings_mocks_1.Settings.settings = settings;
        settings.set(testSetting);
        settings.initialized();
        const settingsRegistry = new SettingsRegistry_1.SettingsRegistry({ store: settings, model: settings_mocks_1.Settings });
        yield settingsRegistry.add(testSetting._id, testSetting.value, testSetting);
        (0, chai_1.expect)(settings.get(testSetting._id)).to.be.equal(false);
    }));
});
