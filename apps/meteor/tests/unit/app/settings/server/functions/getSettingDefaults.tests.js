"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getSettingDefaults_1 = require("../../../../../../app/settings/server/functions/getSettingDefaults");
describe('getSettingDefaults', () => {
    it('should return based on _id type value', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: 'test', type: 'string' });
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('i18nDescription').to.be.equal('test_Description');
        (0, chai_1.expect)(setting).to.have.property('value').to.be.equal('test');
        (0, chai_1.expect)(setting).to.have.property('packageValue').to.be.equal('test');
        (0, chai_1.expect)(setting).to.have.property('type').to.be.equal('string');
        (0, chai_1.expect)(setting).to.have.property('blocked').to.be.equal(false);
        (0, chai_1.expect)(setting).to.not.have.property('multiline');
        (0, chai_1.expect)(setting).to.not.have.property('values');
        (0, chai_1.expect)(setting).to.not.have.property('group');
        (0, chai_1.expect)(setting).to.not.have.property('section');
        (0, chai_1.expect)(setting).to.not.have.property('tab');
    });
    it('should return a sorter value', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: 'test', type: 'string', sorter: 1 });
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('sorter').to.be.equal(1);
    });
    it('should return a private setting', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({
            _id: 'test',
            value: 'test',
            type: 'string',
            public: false,
        });
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('public').to.be.equal(false);
    });
    it('should return a public setting', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({
            _id: 'test',
            value: 'test',
            type: 'string',
            public: true,
        });
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('public').to.be.equal(true);
    });
    it('should return a blocked setting', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({
            _id: 'test',
            value: 'test',
            type: 'string',
            blocked: true,
        });
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('blocked').to.be.equal(true);
    });
    it('should return a blocked setting set by env', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: 'test', type: 'string' }, new Set(['test']));
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('blocked').to.be.equal(true);
    });
    it('should return a package value', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: true, type: 'string' }, new Set(['test']));
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.have.property('blocked').to.be.equal(true);
    });
    it('should not return undefined options', () => {
        const setting = (0, getSettingDefaults_1.getSettingDefaults)({ _id: 'test', value: true, type: 'string', section: undefined, group: undefined }, new Set(['test']));
        (0, chai_1.expect)(setting).to.be.an('object');
        (0, chai_1.expect)(setting).to.have.property('_id');
        (0, chai_1.expect)(setting).to.not.have.property('section');
        (0, chai_1.expect)(setting).to.not.have.property('group');
    });
});
