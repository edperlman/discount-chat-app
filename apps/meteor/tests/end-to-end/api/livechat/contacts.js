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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const custom_fields_1 = require("../../../data/livechat/custom-fields");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const permissions_helper_1 = require("../../../data/permissions.helper");
const users_helper_1 = require("../../../data/users.helper");
const validation_helper_1 = require("../../../data/validation.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - contacts', () => {
    let agentUser;
    let livechatAgent;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        agentUser = yield (0, users_helper_1.createUser)();
        livechatAgent = yield (0, rooms_1.createAgent)(agentUser.username);
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, users_1.removeAgent)(livechatAgent._id);
        yield (0, users_helper_1.deleteUser)(agentUser);
        yield (0, permissions_helper_1.restorePermissionToRoles)('create-livechat-contact');
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('[POST] omnichannel/contacts', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-livechat-contact', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('create-livechat-contact');
        }));
        (0, mocha_1.it)('should be able to create a new contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contactId');
            (0, chai_1.expect)(res.body.contactId).to.be.an('string');
        }));
        (0, mocha_1.it)("should return an error if user doesn't have 'create-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('create-livechat-contact');
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
            });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            yield (0, permissions_helper_1.restorePermissionToRoles)('create-livechat-contact');
        }));
        (0, mocha_1.it)('should return an error if contact manager not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
                contactManager: 'invalid',
            });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-manager-not-found');
        }));
        (0, mocha_1.it)('should return an error if contact manager is not a livechat-agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const normalUser = yield (0, users_helper_1.createUser)();
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
                contactManager: normalUser._id,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-manager-not-found');
            yield (0, users_helper_1.deleteUser)(normalUser);
        }));
        (0, mocha_1.it)('should be able to create a new contact with a contact manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
                contactManager: livechatAgent._id,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contactId');
            (0, chai_1.expect)(res.body.contactId).to.be.an('string');
        }));
        (0, mocha_1.describe)('Custom Fields', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, custom_fields_1.createCustomField)({
                    field: 'cf1',
                    label: 'Custom Field 1',
                    scope: 'visitor',
                    visibility: 'public',
                    type: 'input',
                    required: true,
                    regexp: '^[0-9]+$',
                    searchable: true,
                    public: true,
                });
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, custom_fields_1.deleteCustomField)('cf1');
            }));
            (0, mocha_1.it)('should validate custom fields correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                    customFields: {
                        cf1: '123',
                    },
                });
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('contactId');
                (0, chai_1.expect)(res.body.contactId).to.be.an('string');
            }));
            (0, mocha_1.it)('should return an error for missing required custom field', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                    customFields: {},
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid value for Custom Field 1 field');
            }));
            (0, mocha_1.it)('should return an error for invalid custom field value', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                    customFields: {
                        cf1: 'invalid',
                    },
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid value for Custom Field 1 field');
            }));
        });
        (0, mocha_1.describe)('Fields Validation', () => {
            (0, mocha_1.it)('should return an error if name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'name' [invalid-params]");
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if emails is missing', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    phones: [faker_1.faker.phone.number()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'emails' [invalid-params]");
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if phones is missing', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'phones' [invalid-params]");
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if emails is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: 'invalid',
                    phones: [faker_1.faker.phone.number()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be array [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if emails is not an array of strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [{ invalid: true }],
                    phones: [faker_1.faker.phone.number()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be string [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if phones is not an array of strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [{ invalid: true }],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be string [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if additional fields are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts'))
                    .set(api_data_1.credentials)
                    .send({
                    name: faker_1.faker.person.fullName(),
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                    additional: 'invalid',
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must NOT have additional properties [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
        });
    });
    (0, mocha_1.describe)('[POST] omnichannel/contacts.update', () => {
        let contactId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
            });
            contactId = body.contactId;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('update-livechat-contact');
        }));
        (0, mocha_1.it)('should be able to update a contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = faker_1.faker.person.fullName();
            const emails = [faker_1.faker.internet.email().toLowerCase()];
            const phones = [faker_1.faker.phone.number()];
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId,
                name,
                emails,
                phones,
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contact.name).to.be.equal(name);
            (0, chai_1.expect)(res.body.contact.emails).to.be.deep.equal([
                {
                    address: emails[0],
                },
            ]);
            (0, chai_1.expect)(res.body.contact.phones).to.be.deep.equal([
                {
                    phoneNumber: phones[0],
                },
            ]);
        }));
        (0, mocha_1.it)('should set the unknown field to false when updating a contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId,
                name: faker_1.faker.person.fullName(),
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contact.unknown).to.be.equal(false);
        }));
        (0, mocha_1.it)('should be able to update the contact manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId,
                contactManager: livechatAgent._id,
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contact.contactManager).to.be.equal(livechatAgent._id);
        }));
        (0, mocha_1.it)('should return an error if contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.update'))
                .set(api_data_1.credentials)
                .send({
                contactId: 'invalid',
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
            });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
        (0, mocha_1.it)('should return an error if contact manager not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId,
                contactManager: 'invalid',
            });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-manager-not-found');
        }));
        (0, mocha_1.describe)('Permissions', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.removePermissionFromAllRoles)('update-livechat-contact');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.restorePermissionToRoles)('update-livechat-contact');
            }));
            (0, mocha_1.it)("should return an error if user doesn't have 'update-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                    contactId,
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            }));
        });
        (0, mocha_1.describe)('Custom Fields', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, custom_fields_1.createCustomField)({
                    field: 'cf1',
                    label: 'Custom Field 1',
                    scope: 'visitor',
                    visibility: 'public',
                    type: 'input',
                    required: true,
                    regexp: '^[0-9]+$',
                    searchable: true,
                    public: true,
                });
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, custom_fields_1.deleteCustomField)('cf1');
            }));
            (0, mocha_1.it)('should validate custom fields correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    contactId,
                    customFields: {
                        cf1: '123',
                    },
                });
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            }));
            (0, mocha_1.it)('should return an error for invalid custom field value', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    contactId,
                    customFields: {
                        cf1: 'invalid',
                    },
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid value for Custom Field 1 field');
            }));
            (0, mocha_1.it)('should return an error if additional custom fields are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    contactId,
                    customFields: {
                        cf1: '123',
                        cf2: 'invalid',
                    },
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('Custom field cf2 is not allowed');
            }));
        });
        (0, mocha_1.describe)('Fields Validation', () => {
            (0, mocha_1.it)('should return an error if contactId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    emails: [faker_1.faker.internet.email().toLowerCase()],
                    phones: [faker_1.faker.phone.number()],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'contactId' [invalid-params]");
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if emails is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                    contactId,
                    emails: 'invalid',
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be array [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if emails is not an array of strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    contactId,
                    emails: [{ invalid: true }],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be string [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if phones is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                    contactId,
                    phones: 'invalid',
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be array [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if phones is not an array of strings', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('omnichannel/contacts.update'))
                    .set(api_data_1.credentials)
                    .send({
                    contactId,
                    phones: [{ invalid: true }],
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be string [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
            (0, mocha_1.it)('should return an error if additional fields are provided', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                    contactId,
                    unknown: true,
                });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('must NOT have additional properties [invalid-params]');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
            }));
        });
    });
    (0, mocha_1.describe)('Contact Rooms', () => {
        let agent;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-contact', ['admin']);
            agent = yield (0, users_1.createAnOnlineAgent)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        (0, mocha_1.it)('should create a contact and assign it to the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.have.property('contactId').that.is.a('string');
        }));
        (0, mocha_1.it)('should create a room using the pre-created contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const email = faker_1.faker.internet.email().toLowerCase();
            const phone = faker_1.faker.phone.number();
            const contact = {
                name: 'Contact Name',
                emails: [email],
                phones: [phone],
                contactManager: agentUser === null || agentUser === void 0 ? void 0 : agentUser._id,
            };
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send(Object.assign({}, contact));
            const { contactId } = body;
            const visitor = yield (0, rooms_1.createVisitor)(undefined, 'Visitor Name', email, phone);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.have.property('contactId', contactId);
            (0, chai_1.expect)(room).to.have.property('fname', 'Contact Name');
        }));
        (0, mocha_1.it)('should update room names when a contact name changes', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.have.property('contactId').that.is.a('string');
            (0, chai_1.expect)(room.fname).to.not.be.equal('New Contact Name');
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId: room.contactId,
                name: 'New Contact Name',
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            const sameRoom = yield (0, rooms_1.createLivechatRoom)(visitor.token, { rid: room._id });
            (0, chai_1.expect)(sameRoom._id).to.be.equal(room._id);
            (0, chai_1.expect)(sameRoom.fname).to.be.equal('New Contact Name');
        }));
        (0, mocha_1.it)('should update room subscriptions when a contact name changes', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            const { room, visitor } = response;
            const newName = faker_1.faker.person.fullName();
            (0, chai_1.expect)(room).to.have.property('contactId').that.is.a('string');
            (0, chai_1.expect)(room.fname).to.be.equal(visitor.name);
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId: room.contactId,
                name: newName,
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            const sameRoom = yield (0, rooms_1.createLivechatRoom)(visitor.token, { rid: room._id });
            (0, chai_1.expect)(sameRoom._id).to.be.equal(room._id);
            (0, chai_1.expect)(sameRoom.fname).to.be.equal(newName);
            const subscriptionResponse = yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(agent.credentials)
                .query({ roomId: room._id })
                .expect('Content-Type', 'application/json');
            const { subscription } = subscriptionResponse.body;
            (0, chai_1.expect)(subscription).to.have.property('v').that.is.an('object');
            (0, chai_1.expect)(subscription.v).to.have.property('_id', visitor._id);
            (0, chai_1.expect)(subscription).to.have.property('name', newName);
            (0, chai_1.expect)(subscription).to.have.property('fname', newName);
        }));
        (0, mocha_1.it)('should update inquiry when a contact name changes', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.have.property('contactId').that.is.a('string');
            (0, chai_1.expect)(room.fname).to.not.be.equal('New Contact Name');
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.update')).set(api_data_1.credentials).send({
                contactId: room.contactId,
                name: 'Edited Contact Name Inquiry',
            });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            const roomInquiry = yield (0, rooms_1.fetchInquiry)(room._id);
            (0, chai_1.expect)(roomInquiry).to.have.property('name', 'Edited Contact Name Inquiry');
        }));
    });
    (0, mocha_1.describe)('[GET] omnichannel/contacts.get', () => {
        let contactId;
        let contactId2;
        let association;
        const email = faker_1.faker.internet.email().toLowerCase();
        const phone = faker_1.faker.phone.number();
        const contact = {
            name: faker_1.faker.person.fullName(),
            emails: [email],
            phones: [phone],
            contactManager: agentUser === null || agentUser === void 0 ? void 0 : agentUser._id,
        };
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-contact', ['admin']);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send(Object.assign({}, contact));
            contactId = body.contactId;
            const { body: contact2Body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
                contactManager: agentUser === null || agentUser === void 0 ? void 0 : agentUser._id,
            });
            contactId2 = contact2Body.contactId;
            const visitor = yield (0, rooms_1.createVisitor)(undefined, contact.name, email, phone);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            association = {
                visitorId: visitor._id,
                source: {
                    type: room.source.type,
                    id: room.source.id,
                },
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
        }));
        (0, mocha_1.it)('should be able get a contact by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.have.property('createdAt');
            (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contact.name).to.be.equal(contact.name);
            (0, chai_1.expect)(res.body.contact.emails).to.be.deep.equal([
                {
                    address: contact.emails[0],
                },
            ]);
            (0, chai_1.expect)(res.body.contact.phones).to.be.deep.equal([{ phoneNumber: contact.phones[0] }]);
            (0, chai_1.expect)(res.body.contact.contactManager).to.be.equal(contact.contactManager);
        }));
        (0, mocha_1.it)('should be able get a contact by visitor association', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ visitor: association });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.have.property('createdAt');
            (0, chai_1.expect)(res.body.contact._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contact.name).to.be.equal(contact.name);
            (0, chai_1.expect)(res.body.contact.emails).to.be.deep.equal([
                {
                    address: contact.emails[0],
                },
            ]);
            (0, chai_1.expect)(res.body.contact.phones).to.be.deep.equal([{ phoneNumber: contact.phones[0] }]);
            (0, chai_1.expect)(res.body.contact.contactManager).to.be.equal(contact.contactManager);
        }));
        (0, mocha_1.it)('should return 404 if contact does not exist using contactId', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: 'invalid' });
            (0, chai_1.expect)(res.status).to.be.equal(404);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Resource not found');
        }));
        (0, mocha_1.it)('should return 404 if contact does not exist using visitor association', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)(`omnichannel/contacts.get`))
                .set(api_data_1.credentials)
                .query({ visitor: Object.assign(Object.assign({}, association), { visitorId: 'invalidId' }) });
            (0, chai_1.expect)(res.status).to.be.equal(404);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Resource not found');
        }));
        (0, mocha_1.it)('should return 404 if contact does not exist using visitor source', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)(`omnichannel/contacts.get`))
                .set(api_data_1.credentials)
                .query({ visitor: Object.assign(Object.assign({}, association), { source: { type: 'email' } }) });
            (0, chai_1.expect)(res.status).to.be.equal(404);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Resource not found');
        }));
        (0, mocha_1.it)("should return an error if user doesn't have 'view-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-contact');
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
        }));
        (0, mocha_1.it)('should return an error if contactId and visitor association is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials);
            (0, validation_helper_1.expectInvalidParams)(res, [
                "must have required property 'contactId'",
                "must have required property 'visitor'",
                'must match exactly one schema in oneOf [invalid-params]',
            ]);
        }));
        (0, mocha_1.it)('should return an error if more than one field is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId, visitor: association });
            (0, validation_helper_1.expectInvalidParams)(res, [
                'must NOT have additional properties',
                'must NOT have additional properties',
                'must match exactly one schema in oneOf [invalid-params]',
            ]);
        }));
        (0, mocha_1.describe)('Contact Channels', () => {
            let visitor;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                visitor = yield (0, rooms_1.createVisitor)();
            }));
            afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, rooms_1.deleteVisitor)(visitor.token);
            }));
            (0, mocha_1.it)('should add a channel to a contact when creating a new room', () => __awaiter(void 0, void 0, void 0, function* () {
                const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
                (0, chai_1.expect)(room.contactId).to.be.a('string');
                const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: room.contactId });
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact.channels).to.be.an('array');
                (0, chai_1.expect)(res.body.contact.channels.length).to.be.equal(1);
                (0, chai_1.expect)(res.body.contact.channels[0].name).to.be.equal('api');
                (0, chai_1.expect)(res.body.contact.channels[0].verified).to.be.false;
                (0, chai_1.expect)(res.body.contact.channels[0].blocked).to.be.false;
                (0, chai_1.expect)(res.body.contact.channels[0].visitor)
                    .to.be.an('object')
                    .that.is.deep.equal({
                    visitorId: visitor._id,
                    source: {
                        type: 'api',
                    },
                });
            }));
            (0, mocha_1.it)('should not add a channel if visitor already has one with same type', () => __awaiter(void 0, void 0, void 0, function* () {
                const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
                const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: room.contactId });
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact.channels).to.be.an('array');
                (0, chai_1.expect)(res.body.contact.channels.length).to.be.equal(1);
                yield (0, rooms_1.closeOmnichannelRoom)(room._id);
                yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token });
                const secondResponse = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: room.contactId });
                (0, chai_1.expect)(secondResponse.status).to.be.equal(200);
                (0, chai_1.expect)(secondResponse.body).to.have.property('success', true);
                (0, chai_1.expect)(secondResponse.body.contact.channels).to.be.an('array');
                (0, chai_1.expect)(secondResponse.body.contact.channels.length).to.be.equal(1);
            }));
        });
        (0, mocha_1.describe)('Last Chat', () => {
            let visitor;
            let room;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                visitor = yield (0, rooms_1.createVisitor)();
                room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, rooms_1.closeOmnichannelRoom)(room._id);
                yield (0, rooms_1.deleteVisitor)(visitor._id);
            }));
            (0, mocha_1.it)('should have assigned a contactId to the new room', () => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(room.contactId).to.be.a('string');
            }));
            (0, mocha_1.it)('should return the last chat', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: room.contactId });
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact).to.have.property('lastChat');
                (0, chai_1.expect)(res.body.contact.lastChat).to.have.property('ts');
                (0, chai_1.expect)(res.body.contact.lastChat._id).to.be.equal(room._id);
                (0, chai_1.expect)(res.body.contact.channels[0].lastChat).to.have.property('ts');
                (0, chai_1.expect)(res.body.contact.channels[0].lastChat._id).to.be.equal(room._id);
            }));
            (0, mocha_1.it)('should not return the last chat if contact never chatted', () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.get`)).set(api_data_1.credentials).query({ contactId: contactId2 });
                (0, chai_1.expect)(res.status).to.be.equal(200);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact).to.have.property('_id', contactId2);
                (0, chai_1.expect)(res.body.contact).to.not.have.property('lastChat');
            }));
        });
    });
    (0, mocha_1.describe)('[GET] omnichannel/contacts.search', () => {
        let contactId;
        let visitor;
        let room;
        const contact = {
            name: faker_1.faker.person.fullName(),
            emails: [faker_1.faker.internet.email().toLowerCase()],
            phones: [faker_1.faker.phone.number()],
            contactManager: agentUser === null || agentUser === void 0 ? void 0 : agentUser._id,
        };
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-contact', ['admin']);
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts')).set(api_data_1.credentials).send(contact);
            contactId = body.contactId;
            visitor = yield (0, rooms_1.createVisitor)();
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            yield (0, rooms_1.deleteVisitor)(visitor._id);
        }));
        (0, mocha_1.it)('should be able to list all contacts', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials);
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts.length).to.be.greaterThan(0);
            (0, chai_1.expect)(res.body.count).to.be.an('number');
            (0, chai_1.expect)(res.body.total).to.be.an('number');
            (0, chai_1.expect)(res.body.offset).to.be.an('number');
        }));
        (0, mocha_1.it)('should return only known contacts by default', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials);
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts[0].unknown).to.be.false;
        }));
        (0, mocha_1.it)('should be able to filter contacts by unknown field', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials).query({ unknown: true });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts[0].unknown).to.be.true;
        }));
        (0, mocha_1.it)('should return only contacts that match the searchText using email', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials).query({ searchText: contact.emails[0] });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.total).to.be.equal(1);
            (0, chai_1.expect)(res.body.contacts[0]._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contacts[0].name).to.be.equal(contact.name);
            (0, chai_1.expect)(res.body.contacts[0].emails[0].address).to.be.equal(contact.emails[0]);
        }));
        (0, mocha_1.it)('should return only contacts that match the searchText using phone number', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials).query({ searchText: contact.phones[0] });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.total).to.be.equal(1);
            (0, chai_1.expect)(res.body.contacts[0]._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contacts[0].name).to.be.equal(contact.name);
            (0, chai_1.expect)(res.body.contacts[0].phones[0].phoneNumber).to.be.equal(contact.phones[0]);
        }));
        (0, mocha_1.it)('should return only contacts that match the searchText using name', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials).query({ searchText: contact.name });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.total).to.be.equal(1);
            (0, chai_1.expect)(res.body.contacts[0]._id).to.be.equal(contactId);
            (0, chai_1.expect)(res.body.contacts[0].name).to.be.equal(contact.name);
            (0, chai_1.expect)(res.body.contacts[0].emails[0].address).to.be.equal(contact.emails[0]);
        }));
        (0, mocha_1.it)('should return an empty list if no contacts exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials).query({ searchText: 'invalid' });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contacts).to.be.an('array');
            (0, chai_1.expect)(res.body.contacts.length).to.be.equal(0);
            (0, chai_1.expect)(res.body.total).to.be.equal(0);
        }));
        (0, mocha_1.describe)('Permissions', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-contact');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
            }));
            (0, mocha_1.it)("should return an error if user doesn't have 'view-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.search`)).set(api_data_1.credentials);
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            }));
        });
    });
    (0, mocha_1.describe)('[GET] omnichannel/contacts.history', () => {
        let visitor;
        let room1;
        let room2;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            room1 = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room1._id);
            room2 = yield (0, rooms_1.createLivechatRoomWidget)(visitor.token);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.closeOmnichannelRoom)(room2._id);
            yield (0, rooms_1.deleteVisitor)(visitor._id);
        }));
        (0, mocha_1.it)('should be able to list a contact history', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.history`)).set(api_data_1.credentials).query({ contactId: room1.contactId });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.history).to.be.an('array');
            (0, chai_1.expect)(res.body.history.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.total).to.be.equal(1);
            (0, chai_1.expect)(res.body.count).to.be.an('number');
            (0, chai_1.expect)(res.body.offset).to.be.an('number');
            (0, chai_1.expect)(res.body.history[0]).to.have.property('_id', room1._id);
            (0, chai_1.expect)(res.body.history[0]).to.have.property('closedAt');
            (0, chai_1.expect)(res.body.history[0]).to.have.property('closedBy');
            (0, chai_1.expect)(res.body.history[0]).to.have.property('closer', 'user');
            (0, chai_1.expect)(res.body.history[0].source).to.have.property('type', 'api');
        }));
        (0, mocha_1.it)('should be able to filter a room by the source', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)(`omnichannel/contacts.history`))
                .set(api_data_1.credentials)
                .query({ contactId: room1.contactId, source: 'api' });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.history).to.be.an('array');
            (0, chai_1.expect)(res.body.history.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.total).to.be.equal(1);
            (0, chai_1.expect)(res.body.count).to.be.an('number');
            (0, chai_1.expect)(res.body.offset).to.be.an('number');
            (0, chai_1.expect)(res.body.history[0].source).to.have.property('type', 'api');
        }));
        (0, mocha_1.it)('should return an empty list if contact does not have history', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.person.fullName(),
                emails: [faker_1.faker.internet.email().toLowerCase()],
                phones: [faker_1.faker.phone.number()],
            });
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.history`)).set(api_data_1.credentials).query({ contactId: body.contactId });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.history).to.be.an('array');
            (0, chai_1.expect)(res.body.history.length).to.be.equal(0);
            (0, chai_1.expect)(res.body.total).to.be.equal(0);
        }));
        (0, mocha_1.it)('should return an error if contacts not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.history`)).set(api_data_1.credentials).query({ contactId: 'invalid' });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
    });
    (0, mocha_1.describe)('[GET] omnichannel/contacts.channels', () => {
        let contactId;
        let visitor;
        let room;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-contact', ['admin']);
            visitor = yield (0, rooms_1.createVisitor)();
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            contactId = room.contactId;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.deleteVisitor)(visitor._id);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
        }));
        (0, mocha_1.it)('should be able get the channels of a contact by his id', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.channels`)).set(api_data_1.credentials).query({ contactId });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.channels).to.be.an('array');
            (0, chai_1.expect)(res.body.channels.length).to.be.equal(1);
            (0, chai_1.expect)(res.body.channels[0]).to.have.property('name', 'api');
            (0, chai_1.expect)(res.body.channels[0])
                .to.have.property('visitor')
                .that.is.an('object')
                .and.deep.equal({
                visitorId: visitor._id,
                source: {
                    type: 'api',
                },
            });
            (0, chai_1.expect)(res.body.channels[0]).to.have.property('verified', false);
            (0, chai_1.expect)(res.body.channels[0]).to.have.property('blocked', false);
            (0, chai_1.expect)(res.body.channels[0]).to.have.property('lastChat');
        }));
        (0, mocha_1.it)('should return an empty array if contact does not have channels', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts'))
                .set(api_data_1.credentials)
                .send({ name: faker_1.faker.person.fullName(), emails: [faker_1.faker.internet.email().toLowerCase()], phones: [faker_1.faker.phone.number()] });
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.channels`)).set(api_data_1.credentials).query({ contactId: body.contactId });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.channels).to.be.an('array');
            (0, chai_1.expect)(res.body.channels.length).to.be.equal(0);
        }));
        (0, mocha_1.it)('should return an empty array if contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.channels`)).set(api_data_1.credentials).query({ contactId: 'invalid' });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.channels).to.be.an('array');
            (0, chai_1.expect)(res.body.channels.length).to.be.equal(0);
        }));
        (0, mocha_1.it)("should return an error if user doesn't have 'view-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-contact');
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.channels`)).set(api_data_1.credentials).query({ contactId });
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-contact');
        }));
        (0, mocha_1.it)('should return an error if contactId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)(`omnichannel/contacts.channels`)).set(api_data_1.credentials);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'contactId' [invalid-params]");
            (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[POST] omnichannel/contacts.block', () => __awaiter(void 0, void 0, void 0, function* () {
        let visitor;
        let room;
        let association;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            association = {
                visitorId: visitor._id,
                source: {
                    type: room.source.type,
                    id: room.source.id,
                },
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should be able to block a contact channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({ visitor: association });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('omnichannel/contacts.get')).set(api_data_1.credentials).query({ visitor: association });
            (0, chai_1.expect)(body.contact.channels).to.be.an('array');
            (0, chai_1.expect)(body.contact.channels.length).to.be.equal(1);
            (0, chai_1.expect)(body.contact.channels[0].blocked).to.be.true;
        }));
        (0, mocha_1.it)('should return an error if contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: Object.assign(Object.assign({}, association), { visitorId: 'invalid' }) });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
        (0, mocha_1.it)('should return an error if contact does not exist 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: Object.assign(Object.assign({}, association), { source: { type: 'sms' } }) });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
        (0, mocha_1.it)('should close room when contact is blocked', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({ visitor: association });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const closedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(closedRoom).to.have.property('closedAt');
            (0, chai_1.expect)(closedRoom).to.have.property('closedBy');
            (0, chai_1.expect)((_a = closedRoom.lastMessage) === null || _a === void 0 ? void 0 : _a.msg).to.be.equal('This channel has been blocked');
        }));
        (0, mocha_1.it)('should not be able to open a room when contact is blocked', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({ visitor: association });
            const createRoomResponse = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token }).set(api_data_1.credentials);
            (0, chai_1.expect)(createRoomResponse.status).to.be.equal(400);
            (0, chai_1.expect)(createRoomResponse.body).to.have.property('success', false);
            (0, chai_1.expect)(createRoomResponse.body).to.have.property('error', 'error-contact-channel-blocked');
        }));
        (0, mocha_1.it)('should return an error if visitor is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'visitor' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if visitorId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: { source: association.source } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'visitorId' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if source is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: { visitorId: association.visitorId } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'source' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if source type is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: { visitorId: association.visitorId, source: { id: association.source.id } } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'type' [invalid-params]");
        }));
        (0, mocha_1.describe)('Permissions', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.removePermissionFromAllRoles)('block-livechat-contact');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.restorePermissionToRoles)('block-livechat-contact');
            }));
            (0, mocha_1.it)("should return an error if user doesn't have 'block-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({ visitor: association });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            }));
        });
    }));
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[POST] omnichannel/contacts.unblock', () => __awaiter(void 0, void 0, void 0, function* () {
        let visitor;
        let room;
        let association;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            association = { visitorId: visitor._id, source: { type: room.source.type, id: room.source.id } };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should be able to unblock a contact channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.block')).set(api_data_1.credentials).send({ visitor: association });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('omnichannel/contacts.get')).set(api_data_1.credentials).query({ visitor: association });
            (0, chai_1.expect)(body.contact.channels).to.be.an('array');
            (0, chai_1.expect)(body.contact.channels.length).to.be.equal(1);
            (0, chai_1.expect)(body.contact.channels[0].blocked).to.be.true;
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.unblock')).set(api_data_1.credentials).send({ visitor: association });
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const { body: body2 } = yield api_data_1.request.get((0, api_data_1.api)('omnichannel/contacts.get')).set(api_data_1.credentials).query({ visitor: association });
            (0, chai_1.expect)(body2.contact.channels).to.be.an('array');
            (0, chai_1.expect)(body2.contact.channels.length).to.be.equal(1);
            (0, chai_1.expect)(body2.contact.channels[0].blocked).to.be.false;
        }));
        (0, mocha_1.it)('should return an error if contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: Object.assign(Object.assign({}, association), { visitorId: 'invalid' }) });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
        (0, mocha_1.it)('should return an error if contact does not exist 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.block'))
                .set(api_data_1.credentials)
                .send({ visitor: Object.assign(Object.assign({}, association), { source: { type: 'sms', id: room.source.id } }) });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal('error-contact-not-found');
        }));
        (0, mocha_1.it)('should return an error if visitor is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.unblock')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'visitor' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if visitorId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.unblock'))
                .set(api_data_1.credentials)
                .send({ visitor: { source: association.source } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'visitorId' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if source is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.unblock'))
                .set(api_data_1.credentials)
                .send({ visitor: { visitorId: association.visitorId } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'source' [invalid-params]");
        }));
        (0, mocha_1.it)('should return an error if source type is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contacts.unblock'))
                .set(api_data_1.credentials)
                .send({ visitor: { visitorId: association.visitorId, source: { id: association.source.id } } });
            (0, chai_1.expect)(res.status).to.be.equal(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'type' [invalid-params]");
        }));
        (0, mocha_1.describe)('Permissions', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.removePermissionFromAllRoles)('unblock-livechat-contact');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.restorePermissionToRoles)('unblock-livechat-contact');
            }));
            (0, mocha_1.it)("should return an error if user doesn't have 'unblock-livechat-contact' permission", () => __awaiter(void 0, void 0, void 0, function* () {
                const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contacts.unblock')).set(api_data_1.credentials).send({ visitor: association });
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            }));
        });
    }));
});
