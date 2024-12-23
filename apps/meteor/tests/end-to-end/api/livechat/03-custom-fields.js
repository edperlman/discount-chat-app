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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const custom_fields_1 = require("../../../data/livechat/custom-fields");
const rooms_1 = require("../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../data/permissions.helper");
(0, mocha_1.describe)('LIVECHAT - custom fields', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('livechat/custom-fields', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/custom-fields')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/custom-fields'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.customFields).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should return an array of custom fields even requested with count and offset params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/custom-fields'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.customFields).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/custom-fields/id', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/custom-fields/invalid-id')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
        }));
    });
    (0, mocha_1.describe)('livechat/custom.field', () => {
        (0, mocha_1.it)('should fail when token is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.field')).expect(400);
        }));
        (0, mocha_1.it)('should fail when key is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.field')).send({ token: 'invalid-token' }).expect(400);
        }));
        (0, mocha_1.it)('should fail when value is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.field')).send({ token: 'invalid-token', key: 'invalid-key' }).expect(400);
        }));
        (0, mocha_1.it)('should fail when overwrite is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.field'))
                .send({ token: 'invalid-token', key: 'invalid-key', value: 'invalid-value' })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail when token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.field'))
                .send({ token: 'invalid-token', key: 'invalid-key', value: 'invalid-value', overwrite: true })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail when key is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.field'))
                .send({ token: visitor.token, key: 'invalid-key', value: 'invalid-value', overwrite: true })
                .expect(400);
        }));
        (0, mocha_1.it)('should save a custom field on visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const customFieldName = `new_custom_field_${Date.now()}`;
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: customFieldName,
                label: customFieldName,
                defaultValue: 'test_default_address',
                scope: 'visitor',
                visibility: 'public',
                regexp: '',
            });
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.field'))
                .send({ token: visitor.token, key: customFieldName, value: 'test_address', overwrite: true })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('field');
            (0, chai_1.expect)(body.field).to.have.property('value', 'test_address');
        }));
    });
    (0, mocha_1.describe)('livechat/custom.fields', () => {
        (0, mocha_1.it)('should fail when token is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.fields')).expect(400);
        }));
        (0, mocha_1.it)('should fail if customFields is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.fields')).send({ token: 'invalid-token' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if customFields is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.fields')).send({ token: 'invalid-token', customFields: 'invalid-custom-fields' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if customFields is an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/custom.fields')).send({ token: 'invalid-token', customFields: [] }).expect(400);
        }));
        (0, mocha_1.it)('should fail if customFields is an array with invalid objects', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.fields'))
                .send({ token: 'invalid-token', customFields: [{}] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if token is not a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.fields'))
                .send({ token: 'invalid-token', customFields: [{ key: 'invalid-key', value: 'invalid-value', overwrite: true }] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail when customFields.key is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.fields'))
                .send({
                token: visitor.token,
                customFields: [{ key: 'invalid-key', value: 'invalid-value', overwrite: true }],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should save a custom field on visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const customFieldName = `new_custom_field_${Date.now()}`;
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: customFieldName,
                label: customFieldName,
                defaultValue: 'test_default_address',
                scope: 'visitor',
                visibility: 'public',
                regexp: '',
            });
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/custom.fields'))
                .send({ token: visitor.token, customFields: [{ key: customFieldName, value: 'test_address', overwrite: true }] })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('fields');
            (0, chai_1.expect)(body.fields).to.be.an('array');
            (0, chai_1.expect)(body.fields).to.have.lengthOf(1);
            (0, chai_1.expect)(body.fields[0]).to.have.property('value', 'test_address');
        }));
    });
});
