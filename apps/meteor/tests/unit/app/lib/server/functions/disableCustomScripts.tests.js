"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
describe('disableCustomScripts', () => {
    let mockLicense;
    let disableCustomScripts;
    let disableCustomScriptsVar;
    beforeEach(() => {
        disableCustomScriptsVar = process.env.DISABLE_CUSTOM_SCRIPTS;
        mockLicense = {
            getLicense: sinon_1.default.stub(),
        };
        disableCustomScripts = (0, proxyquire_1.default)('../../../../../../app/lib/server/functions/disableCustomScripts.ts', {
            '@rocket.chat/license': { License: mockLicense },
        }).disableCustomScripts;
    });
    afterEach(() => {
        process.env.DISABLE_CUSTOM_SCRIPTS = disableCustomScriptsVar;
        sinon_1.default.restore();
    });
    it('should return false when license is missing', () => {
        mockLicense.getLicense.returns(null);
        const result = disableCustomScripts();
        (0, chai_1.expect)(result).to.be.false;
    });
    it('should return false when DISABLE_CUSTOM_SCRIPTS is not true', () => {
        mockLicense.getLicense.returns({
            information: {
                trial: true,
            },
        });
        const result = disableCustomScripts();
        (0, chai_1.expect)(result).to.be.false;
    });
    it('should return false when license is not a trial', () => {
        mockLicense.getLicense.returns({
            information: {
                trial: false,
            },
        });
        process.env.DISABLE_CUSTOM_SCRIPTS = 'true';
        const result = disableCustomScripts();
        (0, chai_1.expect)(result).to.be.false;
    });
    it('should return true when DISABLE_CUSTOM_SCRIPTS is true and license is a trial', () => {
        mockLicense.getLicense.returns({
            information: {
                trial: true,
            },
        });
        process.env.DISABLE_CUSTOM_SCRIPTS = 'true';
        const result = disableCustomScripts();
        (0, chai_1.expect)(result).to.be.true;
    });
});
