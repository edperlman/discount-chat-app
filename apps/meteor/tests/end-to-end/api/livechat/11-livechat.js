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
const sleep_1 = require("../../../../lib/utils/sleep");
const api_data_1 = require("../../../data/api-data");
const custom_fields_1 = require("../../../data/livechat/custom-fields");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const permissions_helper_1 = require("../../../data/permissions.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - Utils', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_offline_email', '');
    }));
    (0, mocha_1.describe)('livechat/offline.message', () => {
        (0, mocha_1.it)('should fail if name is not sent as body parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/offline.message')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if email is not sent as body parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/offline.message')).set(api_data_1.credentials).send({ name: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if message is not sent as body parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/offline.message')).set(api_data_1.credentials).send({ name: 'test', email: '' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if setting Livechat_display_offline_form is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_display_offline_form', false);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/offline.message')).set(api_data_1.credentials).send({ name: 'test', email: '', message: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if Livechat_validate_offline_email is enabled and email passed is not resolvable', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_display_offline_form', true);
            yield (0, permissions_helper_1.updateSetting)('Livechat_validate_offline_email', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/offline.message'))
                .set(api_data_1.credentials)
                .send({ name: 'test', email: 'test@fadsjfldasjfd.com', message: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if setting Livechat_offline_email is not setup or is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_validate_offline_email', false);
            yield (0, permissions_helper_1.updateSetting)('Livechat_validate_offline_email', 'afsdxcvxc');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/offline.message'))
                .set(api_data_1.credentials)
                .send({ name: 'test', email: 'test@email.com', message: 'this is a test :)' })
                .expect(400);
        }));
        (0, mocha_1.it)('should send an offline email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_validate_offline_email', false);
            yield (0, permissions_helper_1.updateSetting)('Livechat_offline_email', 'test-email@rocket.chat');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/offline.message'))
                .set(api_data_1.credentials)
                .send({ name: 'test', email: 'test@email.com', message: 'this is a test :)' })
                .expect(200);
        }));
    });
    (0, mocha_1.describe)('livechat/config', () => {
        (0, mocha_1.it)('should return enabled: false if livechat is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', false);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('enabled', false);
        }));
        (0, mocha_1.it)('should return basic livechat config when enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('enabled', true);
            (0, chai_1.expect)(body.config).to.have.property('settings');
            (0, chai_1.expect)(body.config).to.have.property('departments').that.is.an('array');
        }));
        (0, mocha_1.it)('should have custom fields data', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFieldName = `new_custom_field_${Date.now()}`;
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: customFieldName,
                label: customFieldName,
                defaultValue: 'test_default_address',
                scope: 'visitor',
                visibility: 'visible',
                regexp: '',
                public: true,
                required: false,
                options: '',
            });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('customFields').that.is.an('array');
            (0, chai_1.expect)(body.config.customFields).to.have.length.greaterThan(0);
            const customField = body.config.customFields.find((field) => field._id === customFieldName);
            (0, chai_1.expect)(customField).to.be.an('object');
            (0, chai_1.expect)(customField).to.have.property('label', customFieldName);
            yield (0, custom_fields_1.deleteCustomField)(customFieldName);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return online as true if there is at least one agent online', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ department: department._id }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('online', true);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return online as false if there is no agent online', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, rooms_1.makeAgentUnavailable)(agent.credentials);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ department: department._id }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('online', false);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return online as true if bot is online and there is no agent online', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_assign_new_conversation_to_bot', true);
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, rooms_1.makeAgentUnavailable)(agent.credentials);
            const botUser = yield (0, users_1.createBotAgent)();
            yield (0, department_1.addOrRemoveAgentFromDepartment)(department._id, { agentId: botUser.user._id, username: botUser.user.username }, true);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ department: department._id }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            yield (0, permissions_helper_1.updateSetting)('Livechat_assign_new_conversation_to_bot', false);
            yield (0, rooms_1.makeAgentUnavailable)(botUser.credentials);
        }));
        (0, mocha_1.it)('should return a guest if there exists a guest with the same token', () => __awaiter(void 0, void 0, void 0, function* () {
            const guest = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ token: guest.token }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('guest');
            (0, chai_1.expect)(body.config.guest).to.have.property('name', guest.name);
        }));
        (0, mocha_1.it)('should not return a guest if there exists a guest with the same token but the guest is not online', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, users_1.getRandomVisitorToken)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ token }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.not.have.property('guest');
        }));
        (0, mocha_1.it)('should return no online room if visitor is not chatting with an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ token: visitor.token }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.not.have.property('room');
        }));
        (0, mocha_1.it)('should return online room if visitor is already chatting with an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/config')).query({ token: newVisitor.token }).set(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('config');
            (0, chai_1.expect)(body.config).to.have.property('room');
            (0, chai_1.expect)(body.config.room).to.have.property('_id', newRoom._id);
        }));
    });
    (0, mocha_1.describe)('livechat/page.visited', () => {
        (0, mocha_1.it)('should fail if token is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/page.visited')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if rid is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/page.visited')).set(api_data_1.credentials).send({ token: 'test', rid: {} });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if pageInfo is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/page.visited')).set(api_data_1.credentials).send({ token: 'test', rid: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if pageInfo is not of the right format', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/page.visited')).set(api_data_1.credentials).send({ token: 'test', rid: 'test', pageInfo: {} });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return empty if pageInfo.change is not equal to Livechat_history_monitor_type', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/page.visited'))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'test', pageInfo: { change: 'test', title: 'test', location: { href: 'test' } } });
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should store values for 1 month if visitor has no room yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/page.visited'))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'test', pageInfo: { change: 'url', title: 'Rocket.Chat', location: { href: 'https://rocket.chat' } } });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('page');
            (0, chai_1.expect)(body.page).to.have.property('navigation');
            (0, chai_1.expect)(body.page).to.have.property('msg');
        }));
        (0, mocha_1.it)('should store values correctly on visitor room when room is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/page.visited'))
                .set(api_data_1.credentials)
                .send({
                token: visitor.token,
                rid: room._id,
                pageInfo: { change: 'url', title: 'Rocket.Chat', location: { href: 'https://rocket.chat' } },
            });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('page');
            (0, chai_1.expect)(body.page).to.have.property('navigation');
            (0, chai_1.expect)(body.page).to.have.property('msg');
        }));
    });
    (0, mocha_1.describe)('livechat/transcript', () => {
        (0, mocha_1.it)('should fail if token is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if rid is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript')).set(api_data_1.credentials).send({ token: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if email is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript')).set(api_data_1.credentials).send({ token: 'test', rid: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if token is not a valid guest token', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript')).set(api_data_1.credentials).send({ token: 'test', rid: 'test', email: '' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if rid is not a valid room id', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: 'test', email: '' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if requesting a transcript of another visitors room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const visitor2 = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor2.token, rid: room._id, email: '' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if email is not a valid email', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, email: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should send a transcript if all is good', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, email: 'visitor@notadomain.com' });
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should allow a visitor to get a transcript even if token changed by using an old token that matches room.v', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const visitor2 = yield (0, rooms_1.createVisitor)(undefined, undefined, (_a = visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a[0].address);
            const room2 = yield (0, rooms_1.createLivechatRoom)(visitor2.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room2._id);
            (0, chai_1.expect)(visitor.token !== visitor2.token).to.be.true;
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, email: 'visitor@notadomain.com' });
            (0, chai_1.expect)(body).to.have.property('success', true);
            const { body: body2 } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/transcript'))
                .set(api_data_1.credentials)
                .send({ token: visitor2.token, rid: room2._id, email: 'visitor@notadomain.com' });
            (0, chai_1.expect)(body2).to.have.property('success', true);
        }));
    });
    (0, mocha_1.describe)('livechat/transcript/:rid', () => {
        (0, mocha_1.it)('should fail if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/transcript/rid')).send({}).expect(401);
        }));
        (0, mocha_1.it)('should fail if user doesnt have "send-omnichannel-chat-transcript" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('send-omnichannel-chat-transcript');
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({})
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if rid is not a valid room id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('send-omnichannel-chat-transcript');
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/transcript/rid')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is not open', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({})
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if room doesnt have transcript requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({})
                .expect(400);
        }));
        (0, mocha_1.it)('should remove transcript if all good', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(200);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({})
                .expect(200);
        }));
    });
    (0, mocha_1.describe)('POST livechat/transcript/:rid', () => {
        (0, mocha_1.it)('should fail if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript/rid')).send({}).expect(401);
        }));
        (0, mocha_1.it)('should fail if "email" param is not sent', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({})
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if "subject" param is not sent', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.xmz' })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if user doesnt have "send-omnichannel-chat-transcript" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', []);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if rid is not a valid room id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', ['livechat-manager', 'admin']);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/transcript/rid')).set(api_data_1.credentials).send({ email: 'abc@abc.com', subject: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is not open', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if room already has transcript requested', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(200);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should request transcript if all good', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(user.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${room._id}`))
                .set(api_data_1.credentials)
                .send({ email: 'abc@abc.com', subject: 'test' })
                .expect(200);
        }));
    });
    (0, mocha_1.describe)('livechat/visitor.callStatus', () => {
        (0, mocha_1.it)('should fail if token is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.callStatus')).set(api_data_1.credentials).send({});
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if rid is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.callStatus')).set(api_data_1.credentials).send({ token: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if callStatus is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.post((0, api_data_1.api)('livechat/visitor.callStatus')).set(api_data_1.credentials).send({ token: 'test', rid: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if callId is not in body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/visitor.callStatus'))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'test', callStatus: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if token is not a valid guest token', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/visitor.callStatus'))
                .set(api_data_1.credentials)
                .send({ token: new Date().getTime(), rid: 'test', callStatus: 'test', callId: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should try update a call status on room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/visitor.callStatus'))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, callStatus: 'going', callId: 'test' });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('callStatus', 'going');
            (0, chai_1.expect)(body).to.have.property('token', visitor.token);
        }));
    });
    (0, mocha_1.describe)('livechat/visitors.search', () => {
        (0, mocha_1.it)('should bring sorted data by last chat time', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor1 = yield (0, rooms_1.createVisitor)(undefined, 'VisitorInPast');
            const room1 = yield (0, rooms_1.createLivechatRoom)(visitor1.token);
            const visitor2 = yield (0, rooms_1.createVisitor)(undefined, 'VisitorInPresent');
            const room2 = yield (0, rooms_1.createLivechatRoom)(visitor2.token);
            const { body: result1 } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.search'))
                .query({ term: 'VisitorIn', sort: '{"lastChat.ts":1}' })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(result1).to.have.property('visitors').that.is.an('array');
            (0, chai_1.expect)(result1.visitors[0]).to.have.property('name');
            (0, chai_1.expect)(result1.visitors[0].name).to.be.eq('VisitorInPast');
            const { body: result2 } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.search'))
                .query({ term: 'VisitorIn', sort: '{"lastChat.ts":-1}' })
                .set(api_data_1.credentials)
                .send();
            (0, chai_1.expect)(result2).to.have.property('visitors').that.is.an('array');
            (0, chai_1.expect)(result2.visitors[0]).to.have.property('name');
            (0, chai_1.expect)(result2.visitors[0].name).to.be.eq('VisitorInPresent');
            yield (0, rooms_1.closeOmnichannelRoom)(room1._id);
            yield (0, rooms_1.closeOmnichannelRoom)(room2._id);
            yield (0, rooms_1.deleteVisitor)(visitor1.token);
            yield (0, rooms_1.deleteVisitor)(visitor2.token);
        }));
    });
    (0, mocha_1.describe)('livechat/message', () => {
        const visitorTokens = [];
        (0, mocha_1.after)(() => Promise.all(visitorTokens.map((token) => (0, rooms_1.deleteVisitor)(token))));
        (0, mocha_1.it)('should fail if no token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if no rid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if no msg', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: 'test', rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: 'test', rid: 'test', msg: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if rid is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            visitorTokens.push(visitor.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: visitor.token, rid: 'test', msg: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if rid belongs to another visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const visitor2 = yield (0, rooms_1.createVisitor)();
            visitorTokens.push(visitor.token, visitor2.token);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor2.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: visitor.token, rid: room._id, msg: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            visitorTokens.push(visitor.token);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: visitor.token, rid: room._id, msg: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if message is greater than Livechat_enable_message_character_limit setting', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            visitorTokens.push(visitor.token);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', true);
            yield (0, permissions_helper_1.updateSetting)('Livechat_message_character_limit', 1);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: visitor.token, rid: room._id, msg: 'test' }).expect(400);
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_message_character_limit', false);
        }));
        (0, mocha_1.it)('should send a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            visitorTokens.push(visitor.token);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/message')).set(api_data_1.credentials).send({ token: visitor.token, rid: room._id, msg: 'test' }).expect(200);
        }));
    });
    (0, mocha_1.describe)('[GET] livechat/message/:_id', () => {
        (0, mocha_1.it)('should fail if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/rid')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if no rid is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if token points to an invalid visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test', rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room points to an invalid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if _id points to an invalid message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: room._id }).expect(400);
        }));
        (0, mocha_1.it)('should return a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/message/${message._id}`))
                .query({ token: visitor.token, rid: room._id })
                .expect(200);
        }));
    });
    (0, mocha_1.describe)('[PUT] livechat/message/:_id', () => {
        (0, mocha_1.it)('should fail if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.put((0, api_data_1.api)('livechat/message/rid')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if no rid is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.put((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if token points to an invalid visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.put((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test', rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room points to an invalid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.put((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if _id points to an invalid message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.put((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: room._id }).expect(400);
        }));
        (0, mocha_1.it)('should update a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            const { body } = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/${message._id}`))
                .set(api_data_1.credentials)
                .send({ msg: 'test2', token: visitor.token, rid: room._id })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('message');
            (0, chai_1.expect)(body.message).to.have.property('_id', message._id);
            (0, chai_1.expect)(body.message).to.have.property('msg', 'test2');
        }));
    });
    (0, mocha_1.describe)('[DELETE] livechat/message/:_id', () => {
        (0, mocha_1.it)('should fail if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/message/rid')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if no rid is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if token points to an invalid visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/message/mid')).query({ token: 'test', rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room points to an invalid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if _id points to an invalid message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/message/mid')).query({ token: visitor.token, rid: room._id }).expect(400);
        }));
        (0, mocha_1.it)('should delete a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            const { body } = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/message/${message._id}`))
                .send({ token: visitor.token, rid: room._id })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('message');
            (0, chai_1.expect)(body.message).to.have.property('_id', message._id);
        }));
    });
    (0, mocha_1.describe)('livechat/messages.history/:rid', () => {
        (0, mocha_1.it)('should fail if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/messages.history/rid')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if token points to an invalid visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/messages.history/rid')).query({ token: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room points to an invalid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.get((0, api_data_1.api)('livechat/messages.history/rid')).query({ token: visitor.token }).expect(400);
        }));
        (0, mocha_1.it)('should fail if room points to a room of another visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const visitor2 = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor2.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .query({ token: visitor.token })
                .expect(400);
        }));
        (0, mocha_1.it)('should return a list of messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .query({ token: visitor.token })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('messages').that.is.an('array');
            (0, chai_1.expect)(body.messages).to.have.lengthOf(2);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'test');
        }));
        (0, mocha_1.it)('should return a list of messages with offset and count', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test2', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .query({ token: visitor.token, offset: 1, limit: 1 })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('messages').that.is.an('array');
            (0, chai_1.expect)(body.messages).to.have.lengthOf(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'test');
        }));
        (0, mocha_1.it)('should return a list of unseen messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test2', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .query({ token: visitor.token, ls: new Date() })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('messages').that.is.an('array');
            (0, chai_1.expect)(body.messages).to.have.lengthOf(3);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'test2');
        }));
        (0, mocha_1.it)('should return a list of messages up to a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const msg = yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            const tsPlusSomeMillis = new Date(new Date(msg.ts).getTime() + 500);
            yield (0, sleep_1.sleep)(1000);
            yield (0, rooms_1.sendMessage)(room._id, 'test2', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .query({ token: visitor.token, end: tsPlusSomeMillis })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('messages').that.is.an('array');
            (0, chai_1.expect)(body.messages).to.have.lengthOf(2);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'test');
        }));
        (0, mocha_1.it)('should return message history for a valid room with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .set(api_data_1.credentials)
                .query({ token: visitor.token, limit: 1 })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages').of.length(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'Hello');
        }));
        (0, mocha_1.it)('should return message history for a valid room with pagination and offset', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/messages.history/${room._id}`))
                .set(api_data_1.credentials)
                .query({ token: visitor.token, limit: 1, offset: 1 })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages').of.length(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('t');
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] livechat widget', () => {
        (0, mocha_1.it)('should include additional css when provided via Livechat_WidgetLayoutClasses setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_WidgetLayoutClasses', 'http://my.css.com/my.css');
            const x = yield api_data_1.request.get('/livechat').expect(200);
            (0, chai_1.expect)(x.text.includes('http://my.css.com/my.css')).to.be.true;
        }));
        (0, mocha_1.it)('should remove additional css when setting Livechat_WidgetLayoutClasses is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_WidgetLayoutClasses', '');
            const x = yield api_data_1.request.get('/livechat').expect(200);
            (0, chai_1.expect)(x.text.includes('http://my.css.com/my.css')).to.be.false;
        }));
        (0, mocha_1.it)('should include additional js when provided via Livechat_AdditionalWidgetScripts setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_AdditionalWidgetScripts', 'http://my.js.com/my.js');
            const x = yield api_data_1.request.get('/livechat').expect(200);
            (0, chai_1.expect)(x.text.includes('http://my.js.com/my.js')).to.be.true;
        }));
        (0, mocha_1.it)('should remove additional js when setting Livechat_AdditionalWidgetScripts is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_AdditionalWidgetScripts', '');
            const x = yield api_data_1.request.get('/livechat').expect(200);
            (0, chai_1.expect)(x.text.includes('http://my.js.com/my.js')).to.be.false;
        }));
    });
});
