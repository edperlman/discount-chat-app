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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const moment_1 = __importDefault(require("moment"));
const api_data_1 = require("../../../data/api-data");
const custom_fields_1 = require("../../../data/livechat/custom-fields");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const visitor_1 = require("../../../data/livechat/visitor");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const constants_1 = require("../../../e2e/config/constants");
const getLicenseInfo = (loadValues = false) => {
    return api_data_1.request.get((0, api_data_1.api)('licenses.info')).set(api_data_1.credentials).query({ loadValues }).expect(200);
};
(0, mocha_1.describe)('LIVECHAT - visitors', () => {
    let visitor;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
        visitor = yield (0, rooms_1.createVisitor)();
    }));
    (0, mocha_1.describe)('livechat/visitor', () => {
        (0, mocha_1.it)('should fail if no "visitor" key is passed as body parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({});
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if visitor.token is not present', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: {} });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail when token is an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: { token: '' } });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should create a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: { token: 'test' } });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', 'test');
            // Ensure all new visitors are created as online :)
            (0, chai_1.expect)(body.visitor).to.have.property('status', 'online');
        }));
        (0, mocha_1.it)('should create a visitor with provided extra information', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
            const phone = new Date().getTime().toString();
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: { token, phone } });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.have.property('phone');
            (0, chai_1.expect)(body.visitor.phone[0].phoneNumber).to.equal(phone);
        }));
        (0, mocha_1.it)('should save customFields when passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFieldName = `new_custom_field_${Date.now()}`;
            const token = `${new Date().getTime()}-test`;
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: customFieldName,
                label: customFieldName,
                defaultValue: 'test_default_address',
                scope: 'visitor',
                visibility: 'public',
                regexp: '',
            });
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'Not a real address :)', overwrite: true }],
                },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.have.property('livechatData');
            (0, chai_1.expect)(body.visitor.livechatData).to.have.property(customFieldName, 'Not a real address :)');
        }));
        (0, mocha_1.it)('should update a current visitor when phone is same', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
            const token2 = `${new Date().getTime()}-test2`;
            const phone = new Date().getTime().toString();
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: { token, phone } });
            (0, chai_1.expect)(body).to.have.property('success', true);
            const { body: body2 } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token: token2,
                    phone,
                },
            });
            (0, chai_1.expect)(body2).to.have.property('success', true);
            (0, chai_1.expect)(body2).to.have.property('visitor');
            // Same visitor won't update the token
            (0, chai_1.expect)(body2.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body2.visitor).to.have.property('phone');
            (0, chai_1.expect)(body2.visitor.phone[0].phoneNumber).to.equal(phone);
        }));
        (0, mocha_1.it)('should update a visitor custom fields when customFields key is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
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
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'Not a real address :)', overwrite: true }],
                },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.have.property('livechatData');
            (0, chai_1.expect)(body.visitor.livechatData).to.have.property(customFieldName, 'Not a real address :)');
        }));
        (0, mocha_1.it)('should not update a custom field when it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
            const customFieldName = `new_custom_field_${Date.now()}`;
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'Not a real address :)', overwrite: true }],
                },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.not.have.property('livechatData');
        }));
        (0, mocha_1.it)('should not update a custom field when the scope of it is not visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
            const customFieldName = `new_custom_field_${Date.now()}`;
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: customFieldName,
                label: customFieldName,
                defaultValue: 'test_default_address',
                scope: 'room',
                visibility: 'public',
                regexp: '',
            });
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'Not a real address :)', overwrite: true }],
                },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.not.have.property('livechatData');
        }));
        (0, mocha_1.it)('should not update a custom field whe the overwrite flag is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = `${new Date().getTime()}-test`;
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
            yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'Not a real address :)', overwrite: true }],
                },
            });
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({
                visitor: {
                    token,
                    customFields: [{ key: customFieldName, value: 'This should not change!', overwrite: false }],
                },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('visitor');
            (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            (0, chai_1.expect)(body.visitor).to.have.property('livechatData');
            (0, chai_1.expect)(body.visitor.livechatData).to.have.property(customFieldName, 'Not a real address :)');
        }));
        (0, mocha_1.describe)('special cases', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_Allow_collect_and_store_HTTP_header_informations', true);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_Allow_collect_and_store_HTTP_header_informations', false);
            }));
            (0, mocha_1.it)('should allow to create a visitor without passing connectionData when GDPR setting is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
                const token = `${new Date().getTime()}-test`;
                const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor')).send({ visitor: { token } });
                (0, chai_1.expect)(body).to.have.property('success', true);
                (0, chai_1.expect)(body).to.have.property('visitor');
                (0, chai_1.expect)(body.visitor).to.have.property('token', token);
            }));
        });
    });
    (0, mocha_1.describe)('livechat/visitors.info', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.info'))
                .query({ visitorId: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should return an "visitor not found error" when the visitor doe snot exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.info'))
                .query({ visitorId: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('visitor-not-found');
            });
        }));
        (0, mocha_1.it)('should return the visitor info', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.info'))
                .query({ visitorId: visitor._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.visitor._id).to.be.equal(visitor._id);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.pagesVisited', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.pagesVisited/room-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should return an "error" when the roomId param is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.pagesVisited/room-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an array of pages', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            const createdRoom = yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.pagesVisited/${createdRoom._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.pages).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.chatHistory/room/room-id/visitor/visitor-id', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.chatHistory/room/room-id/visitor/visitor-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should return an "error" when the roomId param is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.chatHistory/room/room-id/visitor/visitor-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an array of chat history', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            const createdRoom = yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.chatHistory/room/${createdRoom._id}/visitor/${createdVisitor._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/visitor/:token', () => {
        // get
        (0, mocha_1.it)("should return a 'invalid token' error when visitor with given token does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitor/invalid'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('[invalid-token]');
            });
        }));
        (0, mocha_1.it)('should return an error when the "token" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitor/invalid'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return a visitor when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitor/${visitor.token}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('visitor');
            });
        }));
        // delete
        (0, mocha_1.it)("should return a 'invalid token' error when visitor with given token does not exist ", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/visitor/invalid'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('[invalid-token]');
            });
        }));
        (0, mocha_1.it)('should return an error when the "token" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/visitor/invalid'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)("should return a 'visitor-has-open-rooms' error when there are open rooms", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Allow_collect_and_store_HTTP_header_informations', false);
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/visitor/${createdVisitor.token}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Cannot remove visitors with opened rooms [visitor-has-open-rooms]');
            });
        }));
        (0, mocha_1.it)("should not return a 'visitor-has-open-rooms' when visitor has open rooms but GDPR is enabled", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Allow_collect_and_store_HTTP_header_informations', true);
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/visitor/${createdVisitor.token}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should return a visitor when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/visitor/${createdVisitor.token}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('visitor');
                (0, chai_1.expect)(res.body.visitor).to.have.property('_id');
                (0, chai_1.expect)(res.body.visitor).to.have.property('ts');
                (0, chai_1.expect)(res.body.visitor._id).to.be.equal(createdVisitor._id);
            });
        }));
        (0, mocha_1.it)('should return visitor activity field when visitor was active on month', () => __awaiter(void 0, void 0, void 0, function* () {
            // Activity is determined by a conversation in which an agent has engaged (sent a message)
            // For a visitor to be considered active, they must have had a conversation in the last 30 days
            const period = (0, moment_1.default)().format('YYYY-MM');
            const { visitor, room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            // agent should send a message on the room
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: room._id,
                    msg: 'test',
                },
            });
            const activeVisitor = yield (0, visitor_1.getLivechatVisitorByToken)(visitor.token);
            (0, chai_1.expect)(activeVisitor).to.have.property('activity');
            (0, chai_1.expect)(activeVisitor.activity).to.include(period);
        }));
        (0, mocha_1.it)('should not affect MAC count when a visitor is removed via GDPR', () => __awaiter(void 0, void 0, void 0, function* () {
            const { visitor, room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            // agent should send a message on the room
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: room._id,
                    msg: 'test',
                },
            });
            const { body: currentLicense } = yield getLicenseInfo(true);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/visitor/${visitor.token}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const { body: licenseAfterGdpr } = yield getLicenseInfo(true);
            (0, chai_1.expect)(currentLicense.license).to.have.property('limits');
            (0, chai_1.expect)(currentLicense.license.limits).to.have.property('monthlyActiveContacts');
            (0, chai_1.expect)(currentLicense.license.limits.monthlyActiveContacts).to.have.property('value');
            const currentLimit = currentLicense.license.limits.monthlyActiveContacts.value;
            (0, chai_1.expect)(licenseAfterGdpr.license).to.have.property('limits');
            (0, chai_1.expect)(licenseAfterGdpr.license.limits).to.have.property('monthlyActiveContacts');
            (0, chai_1.expect)(licenseAfterGdpr.license.limits.monthlyActiveContacts).to.have.property('value');
            const limitAfterGdpr = licenseAfterGdpr.license.limits.monthlyActiveContacts.value;
            (0, chai_1.expect)(limitAfterGdpr).to.be.equal(currentLimit);
        }));
        (0, mocha_1.it)("should return a 'error-removing-visitor' error when removeGuest's result is false", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/visitor/123'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.autocomplete', () => {
        (0, mocha_1.it)('should return an error when the user doesnt have the right permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.autocomplete'))
                .set(api_data_1.credentials)
                .query({ selector: 'invalid' })
                .query({ selector: 'xxx' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the "selector" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.autocomplete'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("must have required property 'selector' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should return an error if "selector" param is not JSON serializable', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.autocomplete'))
                .query({ selector: '{invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return a list of visitors when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.autocomplete'))
                .query({ selector: JSON.stringify({ term: createdVisitor.name }) })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('items');
                (0, chai_1.expect)(res.body.items).to.be.an('array');
                (0, chai_1.expect)(res.body.items).to.have.length.of.at.least(1);
                (0, chai_1.expect)(res.body.items[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.items[0]).to.have.property('name');
                const visitor = res.body.items.find((item) => item._id === createdVisitor._id);
                (0, chai_1.expect)(visitor).to.have.property('_id');
                (0, chai_1.expect)(visitor).to.have.property('name');
                (0, chai_1.expect)(visitor._id).to.be.equal(createdVisitor._id);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.searchChats/room/:roomId/visitor/:visitorId', () => {
        (0, mocha_1.it)('should return an error when the user doesnt have the right permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.searchChats/room/123/visitor/123'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should throw an error when the roomId is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.searchChats/room/invalid/visitor/123'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an empty array if the user is not the one serving the chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${room._id}/visitor/123`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history).to.have.lengthOf(0);
            });
        }));
        (0, mocha_1.it)('should return an empty array if the visitorId doesnt correlate to room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            const createdVisitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(createdVisitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${room._id}/visitor/123`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history).to.have.lengthOf(0);
            });
        }));
        (0, mocha_1.it)('should return a list of chats when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent', 'livechat-manager']);
            yield (0, rooms_1.createAgent)();
            const { room: { _id: roomId }, visitor: { _id: visitorId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${roomId}/visitor/${visitorId}?closedChatsOnly=false&servedChatsOnly=true`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history).to.have.length.of.at.least(1);
                (0, chai_1.expect)(res.body.history[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.history[0]).to.have.property('fname');
                (0, chai_1.expect)(res.body.history[0]).to.have.property('v');
            });
        }));
        (0, mocha_1.it)('should return a list of chats when filtered by ', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, visitor: { _id: visitorId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${roomId}/visitor/${visitorId}?source=api&servedChatsOnly=true`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history).to.have.length.of.at.least(1);
                (0, chai_1.expect)(res.body.history[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.history[0]).to.have.property('fname');
                (0, chai_1.expect)(res.body.history[0]).to.have.property('v');
            });
        }));
        (0, mocha_1.it)('should return only closed chats when closedChatsOnly is true', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, visitor: { _id: visitorId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.closeOmnichannelRoom)(roomId);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${roomId}/visitor/${visitorId}?closedChatsOnly=true&servedChatsOnly=false`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history.find((chat) => chat._id === roomId)).to.be.an('object');
            });
        }));
        (0, mocha_1.it)('should return only served chats when servedChatsOnly is true', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${room._id}/visitor/${visitor._id}?closedChatsOnly=false&servedChatsOnly=true`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history.find((chat) => chat._id === room._id)).to.be.undefined;
            });
        }));
        (0, mocha_1.it)('should return closed rooms (served & unserved) when `closedChatsOnly` is true & `servedChatsOnly` is false', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, visitor: { _id: visitorId, token }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.closeOmnichannelRoom)(roomId);
            const room2 = yield (0, rooms_1.createLivechatRoom)(token);
            yield (0, rooms_1.closeOmnichannelRoom)(room2._id);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${roomId}/visitor/${visitorId}?closedChatsOnly=true&servedChatsOnly=false`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('history');
                (0, chai_1.expect)(res.body.history).to.be.an('array');
                (0, chai_1.expect)(res.body.history.find((chat) => chat._id === roomId)).to.be.an('object');
                (0, chai_1.expect)(res.body.history.find((chat) => chat._id === room2._id)).to.be.an('object');
            });
        }));
        (0, mocha_1.it)('should return all chats when both closed & served flags are false', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const room2 = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room2._id);
            yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/visitors.searchChats/room/${room._id}/visitor/${visitor._id}?closedChatsOnly=false&servedChatsOnly=false`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.count).to.be.equal(3);
            (0, chai_1.expect)(body.history.filter((chat) => !!chat.closedAt).length === 2).to.be.true;
            (0, chai_1.expect)(body.history.filter((chat) => !chat.closedAt).length === 1).to.be.true;
            (0, chai_1.expect)(body.total).to.be.equal(3);
        }));
    });
    (0, mocha_1.describe)('livechat/visitor.status', () => {
        (0, mocha_1.it)('should return an error if token is not present as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.status')).set(api_data_1.credentials).expect(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an error if status is not present as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.status')).set(api_data_1.credentials).send({ token: '123' }).expect(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an error if token is not a valid guest token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.status')).set(api_data_1.credentials).send({ token: '123', status: 'online' }).expect(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should update visitor status if all things are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/visitor.status'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, status: 'online' })
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        }));
    });
    (0, mocha_1.describe)('GET [omnichannel/contact.search]', () => {
        (0, mocha_1.it)('should fail if no email|phone|custom params are passed as query', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('omnichannel/contact.search')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('should fail if its trying to find by an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ email: '' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if custom is passed but is not JSON serializable', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: '{a":1}' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if custom is an empty object and no email|phone are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: '{}' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should find a contact by email', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ email: (_a = visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a[0].address })
                .set(api_data_1.credentials)
                .send()
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('contact');
                (0, chai_1.expect)(res.body.contact).to.have.property('_id');
                (0, chai_1.expect)(res.body.contact).to.have.property('name');
                (0, chai_1.expect)(res.body.contact).to.have.property('username');
                (0, chai_1.expect)(res.body.contact).to.have.property('phone');
                (0, chai_1.expect)(res.body.contact).to.have.property('visitorEmails');
                (0, chai_1.expect)(res.body.contact._id).to.be.equal(visitor._id);
                (0, chai_1.expect)(res.body.contact.phone[0].phoneNumber).to.be.equal((_a = visitor.phone) === null || _a === void 0 ? void 0 : _a[0].phoneNumber);
                // done();
            });
        }));
        (0, mocha_1.it)('should find a contact by phone', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ phone: (_a = visitor.phone) === null || _a === void 0 ? void 0 : _a[0].phoneNumber })
                .set(api_data_1.credentials)
                .send()
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('contact');
                (0, chai_1.expect)(res.body.contact).to.have.property('_id');
                (0, chai_1.expect)(res.body.contact).to.have.property('name');
                (0, chai_1.expect)(res.body.contact).to.have.property('username');
                (0, chai_1.expect)(res.body.contact).to.have.property('phone');
                (0, chai_1.expect)(res.body.contact).to.have.property('visitorEmails');
                (0, chai_1.expect)(res.body.contact._id).to.be.equal(visitor._id);
                (0, chai_1.expect)(res.body.contact.phone[0].phoneNumber).to.be.equal((_a = visitor.phone) === null || _a === void 0 ? void 0 : _a[0].phoneNumber);
            });
        }));
        (0, mocha_1.it)('should find a contact by custom field', () => __awaiter(void 0, void 0, void 0, function* () {
            const cfID = 'address';
            const cf = yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: 'address',
                label: 'address',
                defaultValue: 'test_default_address',
                scope: 'visitor',
                visibility: 'public',
                regexp: '',
            });
            if (!cf) {
                throw new Error('Custom field not created');
            }
            yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ address: 'Rocket.Chat' }) })
                .set(api_data_1.credentials)
                .send()
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.contact).to.have.property('name');
                (0, chai_1.expect)(res.body.contact).to.have.property('username');
                (0, chai_1.expect)(res.body.contact).to.have.property('phone');
                (0, chai_1.expect)(res.body.contact).to.have.property('visitorEmails');
                (0, chai_1.expect)(res.body.contact.livechatData).to.have.property('address', 'Rocket.Chat street');
            });
            yield (0, custom_fields_1.deleteCustomField)(cfID);
        }));
        (0, mocha_1.it)('should return null if an invalid set of custom fields is passed and no other params are sent', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ nope: 'nel' }) })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.be.null;
        }));
        (0, mocha_1.it)('should not break if more than 1 custom field are passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ nope: 'nel', another: 'field' }) })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.be.null;
        }));
        (0, mocha_1.it)('should not break if bad things are passed as custom field keys', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ $regex: 'nel' }) })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.be.null;
        }));
        (0, mocha_1.it)('should not break if bad things are passed as custom field keys 2', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ '$regex: { very-bad }': 'nel' }) })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.be.null;
        }));
        (0, mocha_1.it)('should not break if bad things are passed as custom field values', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('omnichannel/contact.search'))
                .query({ custom: JSON.stringify({ nope: '^((ab)*)+$' }) })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.contact).to.be.null;
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.search', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            const res = yield api_data_1.request.get((0, api_data_1.api)('livechat/visitors.search')).query({ text: 'nel' }).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if term is not on query params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            const res = yield api_data_1.request.get((0, api_data_1.api)(`livechat/visitors.search`)).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should not fail when term is an evil regex string', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('livechat/visitors.search')).query({ term: '^((ab)*)+$' }).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return a list of visitors when term is a valid string', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const res = yield api_data_1.request.get((0, api_data_1.api)('livechat/visitors.search')).query({ term: visitor.name }).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.visitors).to.be.an('array');
            (0, chai_1.expect)(res.body.visitors).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('_id', visitor._id);
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('name', visitor.name);
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('username', visitor.username);
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('visitorEmails');
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('phone');
        }));
        (0, mocha_1.it)('should return a list of visitors when term is an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('livechat/visitors.search')).query({ term: '' }).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body.visitors).to.be.an('array');
            (0, chai_1.expect)(res.body.visitors).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('_id');
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('username');
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('name');
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('phone');
            (0, chai_1.expect)(res.body.visitors[0]).to.have.property('visitorEmails');
        }));
    });
    (0, mocha_1.describe)('omnichannel/contact', () => {
        let contact;
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            const res = yield api_data_1.request.get((0, api_data_1.api)('omnichannel/contact')).query({ text: 'nel' }).set(api_data_1.credentials).send();
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should create a new contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, users_1.getRandomVisitorToken)();
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contact')).set(api_data_1.credentials).send({
                name: faker_1.faker.person.fullName(),
                token,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contact');
            (0, chai_1.expect)(res.body.contact).to.be.an('string');
            const contactId = res.body.contact;
            contact = yield (0, visitor_1.getLivechatVisitorByToken)(token);
            (0, chai_1.expect)(contact._id).to.equal(contactId);
        }));
        (0, mocha_1.it)('should update an existing contact', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = faker_1.faker.person.fullName();
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contact')).set(api_data_1.credentials).send({
                name,
                token: contact.token,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contact');
            (0, chai_1.expect)(res.body.contact).to.be.an('string');
            (0, chai_1.expect)(res.body.contact).to.equal(contact._id);
            contact = yield (0, visitor_1.getLivechatVisitorByToken)(contact.token);
            (0, chai_1.expect)(contact.name).to.equal(name);
        }));
        (0, mocha_1.it)('should change the contact name, email and phone', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const name = faker_1.faker.person.fullName();
            const email = faker_1.faker.internet.email().toLowerCase();
            const phone = faker_1.faker.phone.number();
            const res = yield api_data_1.request.post((0, api_data_1.api)('omnichannel/contact')).set(api_data_1.credentials).send({
                name,
                email,
                phone,
                token: contact.token,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contact');
            (0, chai_1.expect)(res.body.contact).to.be.an('string');
            (0, chai_1.expect)(res.body.contact).to.equal(contact._id);
            contact = yield (0, visitor_1.getLivechatVisitorByToken)(contact.token);
            (0, chai_1.expect)(contact.name).to.equal(name);
            (0, chai_1.expect)(contact.visitorEmails).to.be.an('array');
            (0, chai_1.expect)(contact.visitorEmails).to.have.lengthOf(1);
            if ((_a = contact.visitorEmails) === null || _a === void 0 ? void 0 : _a[0]) {
                (0, chai_1.expect)(contact.visitorEmails[0].address).to.equal(email);
            }
            (0, chai_1.expect)(contact.phone).to.be.an('array');
            (0, chai_1.expect)(contact.phone).to.have.lengthOf(1);
            if ((_b = contact.phone) === null || _b === void 0 ? void 0 : _b[0]) {
                (0, chai_1.expect)(contact.phone[0].phoneNumber).to.equal(phone);
            }
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should change the contact manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const managerUsername = user_1.adminUsername;
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contact'))
                .set(api_data_1.credentials)
                .send({
                contactManager: {
                    username: managerUsername,
                },
                token: contact.token,
                name: contact.name,
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contact');
            (0, chai_1.expect)(res.body.contact).to.be.an('string');
            (0, chai_1.expect)(res.body.contact).to.equal(contact._id);
            contact = yield (0, visitor_1.getLivechatVisitorByToken)(contact.token);
            (0, chai_1.expect)(contact.contactManager).to.be.an('object');
            (0, chai_1.expect)(contact.contactManager).to.have.property('username', managerUsername);
        }));
        (0, mocha_1.it)('should change custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const cfName = faker_1.faker.lorem.word();
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: cfName,
                label: cfName,
                scope: 'visitor',
                visibility: 'visible',
                regexp: '',
            });
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('omnichannel/contact'))
                .set(api_data_1.credentials)
                .send({
                token: contact.token,
                name: contact.name,
                customFields: {
                    [cfName]: 'test',
                },
            });
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('contact');
            (0, chai_1.expect)(res.body.contact).to.be.an('string');
            (0, chai_1.expect)(res.body.contact).to.equal(contact._id);
            contact = yield (0, visitor_1.getLivechatVisitorByToken)(contact.token);
            (0, chai_1.expect)(contact).to.have.property('livechatData');
            (0, chai_1.expect)(contact.livechatData).to.have.property(cfName, 'test');
        }));
    });
});
