"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const copyCustomFieldsLDAP_1 = require("./copyCustomFieldsLDAP");
describe('LDAP copyCustomFieldsLDAP', () => {
    it('should copy custom fields from ldapUser to rcUser', () => {
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: true,
            customFieldsSettings: JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            }),
            customFieldsMap: JSON.stringify({
                givenName: 'mappedGivenName',
            }),
        }, {
            debug: () => undefined,
            error: () => undefined,
        });
        (0, chai_1.expect)(userData).to.have.property('customFields');
        (0, chai_1.expect)(userData.customFields).to.be.eql({ mappedGivenName: 'Test' });
    });
    it('should copy custom fields from ldapUser to rcUser already having other custom fields', () => {
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
            customFields: {
                custom: 'Test',
            },
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: true,
            customFieldsSettings: JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            }),
            customFieldsMap: JSON.stringify({
                givenName: 'mappedGivenName',
            }),
        }, {
            debug: () => undefined,
            error: () => undefined,
        });
        (0, chai_1.expect)(userData).to.have.property('customFields');
        (0, chai_1.expect)(userData.customFields).to.be.eql({ custom: 'Test', mappedGivenName: 'Test' });
    });
    it('should not copy custom fields from ldapUser to rcUser if syncCustomFields is false', () => {
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: false,
            customFieldsSettings: JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            }),
            customFieldsMap: JSON.stringify({
                givenName: 'mappedGivenName',
            }),
        }, {
            debug: () => undefined,
            error: () => undefined,
        });
        (0, chai_1.expect)(userData).to.not.have.property('customFields');
    });
    it('should call logger.error if customFieldsSettings is not a valid JSON', () => {
        const debug = (0, chai_1.spy)();
        const error = (0, chai_1.spy)();
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: true,
            customFieldsSettings: `${JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            })}}`,
            customFieldsMap: JSON.stringify({
                givenName: 'mappedGivenName',
            }),
        }, {
            debug,
            error,
        });
        (0, chai_1.expect)(error).to.have.been.called.exactly(1);
    });
    it('should call logger.error if customFieldsMap is not a valid JSON', () => {
        const debug = (0, chai_1.spy)();
        const error = (0, chai_1.spy)();
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: true,
            customFieldsSettings: JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            }),
            customFieldsMap: `${JSON.stringify({
                givenName: 'mappedGivenName',
            })}}`,
        }, {
            debug,
            error,
        });
        (0, chai_1.expect)(error).to.have.been.called.exactly(1);
    });
    it('should call logger.debug if some custom fields are not mapped but still mapping the other fields', () => {
        const debug = (0, chai_1.spy)();
        const error = (0, chai_1.spy)();
        const ldapUser = {
            mail: 'test@test.com',
            givenName: 'Test',
        };
        const userData = {
            name: 'Test',
            username: 'test',
        };
        (0, copyCustomFieldsLDAP_1.copyCustomFieldsLDAP)({
            ldapUser,
            userData,
            syncCustomFields: true,
            customFieldsSettings: JSON.stringify({
                mappedGivenName: { type: 'text', required: false },
            }),
            customFieldsMap: JSON.stringify({
                givenName: 'mappedGivenName',
                test: 'test',
            }),
        }, {
            debug,
            error,
        });
        (0, chai_1.expect)(debug).to.have.been.called.exactly(1);
        (0, chai_1.expect)(userData).to.have.property('customFields');
        (0, chai_1.expect)(userData.customFields).to.be.eql({ mappedGivenName: 'Test' });
    });
});
