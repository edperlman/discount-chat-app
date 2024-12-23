"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getSettingDefaults_1 = require("../../../../../../app/settings/server/functions/getSettingDefaults");
const overrideGenerator_1 = require("../../../../../../app/settings/server/functions/overrideGenerator");
describe('overrideGenerator', () => {
    it('should return a new object with the new value', () => {
        const overwrite = (0, overrideGenerator_1.overrideGenerator)(() => 'value');
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: 'test', type: 'string' });
        const overwritten = overwrite(setting);
        (0, chai_1.expect)(overwritten).to.be.an('object');
        (0, chai_1.expect)(overwritten).to.have.property('_id');
        (0, chai_1.expect)(setting).to.be.not.equal(overwritten);
        (0, chai_1.expect)(overwritten).to.have.property('value').that.equals('value');
        (0, chai_1.expect)(overwritten).to.have.property('valueSource').that.equals('processEnvValue');
    });
    it('should return the same object since the value didnt change', () => {
        const overwrite = (0, overrideGenerator_1.overrideGenerator)(() => 'test');
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: 'test', type: 'string' });
        const overwritten = overwrite(setting);
        (0, chai_1.expect)(setting).to.be.equal(overwritten);
    });
});
