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
const api_data_1 = require("../../../../data/api-data");
const businessHours_1 = require("../../../../data/livechat/businessHours");
const rooms_1 = require("../../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../../data/permissions.helper");
const user_1 = require("../../../../data/user");
const users_helper_1 = require("../../../../data/users.helper");
(0, mocha_1.describe)('livechat:changeLivechatStatus', () => {
    let agent;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, rooms_1.createAgent)(user.username);
        agent = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, users_helper_1.deleteUser)(agent.user);
    }));
    (0, mocha_1.describe)('changeLivechatStatus', () => {
        // eslint-disable-next-line no-restricted-properties
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission to change other status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', []);
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: 'not-available', agentId: agent.user._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-not-allowed');
            });
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
        }));
        (0, mocha_1.it)('should return an error if user is not an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(userCredentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: 'available', agentId: user._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-not-allowed');
                (0, chai_1.expect)(parsedBody.error).to.have.property('reason', 'Invalid Agent Id');
            });
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should return an error if status is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(agent.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: 'invalid-status', agentId: agent.user._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-not-allowed');
                (0, chai_1.expect)(parsedBody.error).to.have.property('reason', 'Invalid Status');
            });
        }));
        (0, mocha_1.it)('should return an error if agentId param is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(agent.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: 'available', agentId: 'invalid-agent-id' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-not-allowed');
                (0, chai_1.expect)(parsedBody.error).to.have.property('reason', 'Invalid Agent Id');
            });
        }));
        (0, mocha_1.it)('should change logged in users status', () => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = yield (0, users_helper_1.getMe)(agent.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(agent.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: newStatus, agentId: currentUser._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.not.have.property('error');
            });
        }));
        (0, mocha_1.it)('should allow managers to change other agents status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            const currentUser = yield (0, users_helper_1.getMe)(agent.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: newStatus, agentId: currentUser._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.not.have.property('error');
            });
        }));
        (0, mocha_1.it)('should throw an error if agent tries to make themselves available outside of Business hour', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.makeDefaultBusinessHourActiveAndClosed)();
            const currentUser = yield (0, users_helper_1.getMe)(agent.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(agent.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: newStatus, agentId: currentUser._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-business-hours-are-closed');
            });
        }));
        (0, mocha_1.it)('should allow managers to make other agents available outside business hour', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            const currentUser = yield (0, users_helper_1.getMe)(agent.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:changeLivechatStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:changeLivechatStatus',
                    params: [{ status: newStatus, agentId: currentUser._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.not.have.property('error');
            });
            yield (0, businessHours_1.disableDefaultBusinessHour)();
        }));
    });
});
