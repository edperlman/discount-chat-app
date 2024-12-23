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
const utils_1 = require("../../../data/livechat/utils");
const permissions_helper_1 = require("../../../data/permissions.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - appearance', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('livechat/appearance', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/appearance')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of settings', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.appearance).to.be.an('array');
            });
        }));
    });
    (0, mocha_1.describe)('POST livechat/appearance', () => {
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/appearance')).send({}).expect(401);
        }));
        (0, mocha_1.it)('should fail if body is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/appearance')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if body is an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/appearance')).set(api_data_1.credentials).send([]).expect(400);
        }));
        (0, mocha_1.it)('should fail if body does not contain value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ name: 'Livechat_title' }])
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if body does not contain name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ value: 'test' }])
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'invalid', value: 'test' }])
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if body contains invalid _id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'invalid', value: 'test' }])
                .expect(400);
        }));
        (0, mocha_1.it)('should update the settings', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_title', value: 'test' }])
                .expect(200);
        }));
        // Test for: https://github.com/ajv-validator/ajv/issues/1140
        (0, mocha_1.it)('should update a boolean setting and keep it as boolean', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_registration_form', value: true }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.registrationForm).to.be.true;
        }));
        (0, mocha_1.it)('should update a boolean setting and keep it as boolean', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_registration_form', value: false }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.registrationForm).to.be.false;
        }));
        (0, mocha_1.it)('should update a number setting and keep it as number', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_message_character_limit', value: 100 }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.limitTextLength).to.be.equal(100);
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', false);
        }));
        (0, mocha_1.it)('should coerce the value of a setting based on its stored datatype (int)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_message_character_limit', value: '100' }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.limitTextLength).to.be.equal(100);
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', false);
        }));
        (0, mocha_1.it)('should coerce the value of a setting based on its stored datatype (boolean)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_registration_form', value: 'true' }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.registrationForm).to.be.true;
        }));
        (0, mocha_1.it)('should coerce an invalid number value to zero', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([
                { _id: 'Livechat_message_character_limit', value: 'xxxx' },
                { _id: 'Livechat_enable_message_character_limit', value: true },
            ])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            // When setting is 0, we default to Message_MaxAllowedSize value
            (0, chai_1.expect)(body.config.settings.limitTextLength).to.be.equal(5000);
        }));
        (0, mocha_1.it)('should coerce a boolean value on an int setting to 0', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([
                { _id: 'Livechat_message_character_limit', value: true },
                { _id: 'Livechat_enable_message_character_limit', value: true },
            ])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.limitTextLength).to.be.equal(5000);
        }));
        (0, mocha_1.it)('should coerce a non boolean value on a boolean setting to false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_enable_message_character_limit', value: 'xxxx' }])
                .expect(200);
            // Just enough to get the stream to update cached settings
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.limitTextLength).to.be.false;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should accept an array setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_hide_system_messages', value: ['livechat-started'] }])
                .expect(200);
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.be.an('array');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('livechat-started');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should accept an array setting with multiple values', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_hide_system_messages', value: ['uj', 'livechat_transfer_history'] }])
                .expect(200);
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.be.an('array');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('uj');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('livechat_transfer_history');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).not.to.include('livechat-started');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should not update an array setting with a value other than array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_hide_system_messages', value: 'uj' }])
                .expect(200);
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.be.an('array');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('uj');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('livechat_transfer_history');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should not update an array setting with values that are not valid setting values', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/appearance'))
                .set(api_data_1.credentials)
                .send([{ _id: 'Livechat_hide_system_messages', value: ['livechat-started', 'invalid'] }])
                .expect(200);
            yield (0, utils_1.sleep)(500);
            // Get data from livechat/config
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.be.an('array');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('uj');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.include('livechat_transfer_history');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.not.include('livechat-started');
            (0, chai_1.expect)(body.config.settings.hiddenSystemMessages).to.not.include('invalid');
        }));
    });
});
