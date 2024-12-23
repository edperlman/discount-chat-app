"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const mocks = {
    '../../lib/server/lib/deprecationWarningLogger': {
        apiDeprecationLogger: {
            endpoint: sinon_1.default.stub(),
        },
    },
};
const { checkPermissions } = proxyquire_1.default.noCallThru().load('../../../../../../../app/api/server/api.helpers', mocks);
(0, mocha_1.describe)('checkPermissions', () => {
    (0, mocha_1.it)('should return false when no options.permissionsRequired key is present', () => {
        const options = {};
        (0, chai_1.expect)(checkPermissions(options)).to.be.false;
    });
    (0, mocha_1.it)('should return false when options.permissionsRequired is of an invalid format', () => {
        const options = {
            permissionsRequired: 'invalid',
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.false;
    });
    (0, mocha_1.it)('should return true and modify options.permissionsRequired when permissionsRequired key is an array (of permissions)', () => {
        const options = {
            permissionsRequired: ['invalid', 'invalid2'],
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.true;
        (0, chai_1.expect)(options.permissionsRequired).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('*');
        // @ts-expect-error -for test purposes :)
        (0, chai_1.expect)(options.permissionsRequired['*']).to.be.an('object');
        // @ts-expect-error -for test purposes :)
        (0, chai_1.expect)(options.permissionsRequired['*'].permissions).to.be.an('array').that.includes('invalid');
    });
    (0, mocha_1.it)('should return true and modify options.permissionsRequired when permissionsRequired key is an object (of permissions)', () => {
        const options = {
            permissionsRequired: {
                GET: ['invalid', 'invalid2'],
            },
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.true;
        (0, chai_1.expect)(options.permissionsRequired).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('GET');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('operation', 'hasAll');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('permissions').that.is.an('array').that.includes('invalid');
    });
    (0, mocha_1.it)('should return true and not modify options.permissionsRequired when its of new format', () => {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAll',
                    permissions: ['invalid', 'invalid2'],
                },
            },
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.true;
        (0, chai_1.expect)(options.permissionsRequired).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('GET');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('operation', 'hasAll');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('permissions').that.is.an('array').that.includes('invalid');
    });
    (0, mocha_1.it)('should persist the right operation for method', () => {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAny',
                    permissions: ['invalid', 'invalid2'],
                },
            },
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.true;
        (0, chai_1.expect)(options.permissionsRequired).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('GET');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('operation', 'hasAny');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('permissions').that.is.an('array').that.includes('invalid');
    });
    (0, mocha_1.it)('should persist the right method keys', () => {
        const options = {
            permissionsRequired: {
                GET: {
                    operation: 'hasAll',
                    permissions: ['invalid', 'invalid2'],
                },
                POST: {
                    operation: 'hasAll',
                    permissions: ['invalid', 'invalid2'],
                },
            },
        };
        (0, chai_1.expect)(checkPermissions(options)).to.be.true;
        (0, chai_1.expect)(options.permissionsRequired).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('GET');
        (0, chai_1.expect)(options.permissionsRequired).to.have.property('POST');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.be.an('object');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('operation', 'hasAll');
        (0, chai_1.expect)(options.permissionsRequired.GET).to.have.property('permissions').that.is.an('array').that.includes('invalid');
    });
});
