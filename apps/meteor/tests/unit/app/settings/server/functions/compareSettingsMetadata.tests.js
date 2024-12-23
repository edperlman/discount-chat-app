"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const SettingsRegistry_1 = require("../../../../../../app/settings/server/SettingsRegistry");
const getSettingDefaults_1 = require("../../../../../../app/settings/server/functions/getSettingDefaults");
const testSetting = (0, getSettingDefaults_1.getSettingDefaults)({
    _id: 'my_dummy_setting',
    type: 'string',
    value: 'dummy',
});
describe('#compareSettings', () => {
    const ignoredKeys = ['value', 'ts', 'createdAt', 'valueSource', 'packageValue', 'processEnvValue', '_updatedAt'];
    ignoredKeys.forEach((key) => it(`should return true if ${key} changes`, () => {
        const copiedSetting = Object.assign({}, testSetting);
        if (['ts', 'createdAt', '_updatedAt'].includes(key)) {
            copiedSetting[key] = new Date();
        }
        else {
            copiedSetting[key] = 'random';
        }
        (0, chai_1.expect)((0, SettingsRegistry_1.compareSettings)(testSetting, copiedSetting)).to.be.true;
    }));
});
