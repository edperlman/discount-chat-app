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
const core_typings_1 = require("@rocket.chat/core-typings");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const rooms_1 = require("../../../data/livechat/rooms");
const utils_1 = require("../../../data/livechat/utils");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Omnichannel - Routing', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
    }));
    (0, mocha_1.describe)('Auto-Selection', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
        }));
        let testUser;
        let testUser2;
        let testDepartment;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentUnavailable)(credentials2);
            testUser2 = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testDepartment = yield (0, rooms_1.createDepartment)([{ agentId: testUser.user._id }]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser.user);
            yield (0, users_helper_1.deleteUser)(testUser2.user);
        }));
        (0, mocha_1.it)('should route a room to an available agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser.user._id);
            (0, chai_1.expect)((_b = roomInfo.servedBy) === null || _b === void 0 ? void 0 : _b._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should not route to a not-available agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should fail to start a conversation if there is noone available and Livechat_accept_chats_with_no_agents is false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', false);
            yield (0, rooms_1.makeAgentUnavailable)(testUser.credentials);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token }).expect(400);
            (0, chai_1.expect)(body.error).to.be.equal('Sorry, no online agents [no-agent-online]');
        }));
        (0, mocha_1.it)('should accept a conversation but not route to anyone when Livechat_accept_chats_with_no_agents is true', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', true);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.undefined;
        }));
        (0, mocha_1.it)('should not allow users to take more than Livechat_maximum_chats_per_agent chats', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_maximum_chats_per_agent', 2);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.undefined;
        }));
        (0, mocha_1.it)('should ignore disabled users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_maximum_chats_per_agent', 0);
            yield (0, users_helper_1.setUserActiveStatus)(testUser2.user._id, false);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.undefined;
        }));
        (0, mocha_1.it)('should ignore offline users when Livechat_enabled_when_agent_idle is false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enabled_when_agent_idle', false);
            yield (0, users_helper_1.setUserStatus)(testUser.credentials, core_typings_1.UserStatus.OFFLINE);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.undefined;
        }));
    });
    (0, mocha_1.describe)('Load Balancing', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Load_Balancing');
        }));
        let testUser;
        let testUser2;
        let testDepartment;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentUnavailable)(credentials2);
            testUser2 = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testDepartment = yield (0, rooms_1.createDepartment)([{ agentId: testUser.user._id }, { agentId: testUser2.user._id }]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser.user);
            yield (0, users_helper_1.deleteUser)(testUser2.user);
        }));
        (0, mocha_1.it)('should route a room to an available agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser.user._id);
            (0, chai_1.expect)((_b = roomInfo.servedBy) === null || _b === void 0 ? void 0 : _b._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should not route to a not-available agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should route the chat to the less busy agent when both are available', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, rooms_1.makeAgentAvailable)(testUser2.credentials);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should route again to the less busy agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser2.user._id);
        }));
    });
    (0, mocha_1.describe)('Load Rotation', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Load_Rotation');
        }));
        let testUser;
        let testUser2;
        let testDepartment;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentUnavailable)(credentials2);
            testUser2 = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testDepartment = yield (0, rooms_1.createDepartment)([{ agentId: testUser.user._id }, { agentId: testUser2.user._id }]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser.user);
            yield (0, users_helper_1.deleteUser)(testUser2.user);
        }));
        (0, mocha_1.it)('should route a room to an available agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser.user._id);
            (0, chai_1.expect)((_b = roomInfo.servedBy) === null || _b === void 0 ? void 0 : _b._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should not route chat to an unavailable agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.not.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should route the chat to the agent with the oldest routing time when both are available', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, rooms_1.makeAgentAvailable)(testUser2.credentials);
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser2.user._id);
        }));
        (0, mocha_1.it)('should route again to the agent with the oldest routing time', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const visitor = yield (0, rooms_1.createVisitor)(testDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, utils_1.sleep)(5000);
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo.servedBy).to.be.an('object');
            (0, chai_1.expect)((_a = roomInfo.servedBy) === null || _a === void 0 ? void 0 : _a._id).to.be.equal(testUser.user._id);
        }));
    });
});
