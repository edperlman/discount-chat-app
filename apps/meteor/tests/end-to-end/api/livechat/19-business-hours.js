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
const sleep_1 = require("../../../../lib/utils/sleep");
const api_data_1 = require("../../../data/api-data");
const businessHours_1 = require("../../../data/livechat/businessHours");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - business hours', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_enable_business_hours', true);
        yield (0, rooms_1.createAgent)();
    }));
    let defaultBhId;
    (0, mocha_1.describe)('[CE] livechat/business-hour', () => {
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.saveBusinessHour)(Object.assign(Object.assign({}, defaultBhId), { timezone: {
                    name: 'America/Sao_Paulo',
                    utc: '-03:00',
                }, workHours: (0, businessHours_1.getWorkHours)(true) }));
        }));
        (0, mocha_1.it)('should fail when user doesnt have view-livechat-business-hours permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-business-hours');
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hour')).set(api_data_1.credentials).expect(403);
            (0, chai_1.expect)(response.body.success).to.be.false;
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-business-hours');
        }));
        (0, mocha_1.it)('should fail when business hour type is not a valid BH type', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hour')).set(api_data_1.credentials).query({ type: 'invalid' }).expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            (0, chai_1.expect)(response.body.businessHour).to.be.null;
        }));
        (0, mocha_1.it)('should return a business hour of type default', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hour')).set(api_data_1.credentials).query({ type: 'default' }).expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            (0, chai_1.expect)(response.body.businessHour).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHour._id).to.be.a('string');
            (0, chai_1.expect)(response.body.businessHour.workHours).to.be.an('array');
            (0, chai_1.expect)(response.body.businessHour.workHours[0]).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHour.workHours[0].day)
                .to.be.an('string')
                .that.is.oneOf(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
            (0, chai_1.expect)(response.body.businessHour.workHours[0].start).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHour.workHours[0].finish).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHour.workHours[0].open).to.be.a('boolean');
            (0, chai_1.expect)(response.body.businessHour.timezone).to.be.an('object').that.has.property('name').that.is.an('string');
            defaultBhId = response.body.businessHour;
        }));
        (0, mocha_1.it)('should not allow a user to be available if BH are closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.saveBusinessHour)(Object.assign(Object.assign({}, defaultBhId), { workHours: [
                    {
                        day: 'Monday',
                        open: true,
                        start: '00:00',
                        finish: '00:01',
                    },
                ] }));
            const { body } = yield (0, rooms_1.makeAgentAvailable)(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('success', false);
            (0, chai_1.expect)(body.error).to.be.equal('error-business-hours-are-closed');
        }));
        (0, mocha_1.it)('should allow a user to be available if BH are open', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.saveBusinessHour)(Object.assign(Object.assign({}, defaultBhId), { workHours: (0, businessHours_1.getWorkHours)(true) }));
            const { body } = yield (0, rooms_1.makeAgentAvailable)(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should save a default business hour with proper timezone settings', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.saveBusinessHour)(Object.assign(Object.assign({}, defaultBhId), { timezone: {
                    name: 'Asia/Kolkata',
                    utc: '+05:30',
                }, workHours: (0, businessHours_1.getWorkHours)(true), timezoneName: 'Asia/Kolkata' }));
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/business-hour'))
                .set(api_data_1.credentials)
                .query({ type: core_typings_1.LivechatBusinessHourTypes.DEFAULT })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(body.businessHour).to.be.an('object');
            (0, chai_1.expect)(body.businessHour.timezone).to.be.an('object').that.has.property('name').that.is.equal('Asia/Kolkata');
            (0, chai_1.expect)(body.businessHour.workHours).to.be.an('array').with.lengthOf(7);
            const { workHours } = body.businessHour;
            (0, chai_1.expect)(workHours[0].day).to.be.equal('Sunday');
            (0, chai_1.expect)(workHours[0].start.utc.dayOfWeek).to.be.equal('Saturday');
            (0, chai_1.expect)(workHours[0].finish.utc.dayOfWeek).to.be.equal('Sunday');
        }));
        (0, mocha_1.it)('should allow agents to be available', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield (0, rooms_1.makeAgentAvailable)(api_data_1.credentials);
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] livechat/business-hour', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-livechat-business-hours permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-business-hours');
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hours')).set(api_data_1.credentials).expect(403);
            (0, chai_1.expect)(response.body.success).to.be.false;
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-business-hours');
        }));
        (0, mocha_1.it)('should return a list of business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hours')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            (0, chai_1.expect)(response.body.businessHours).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(response.body.businessHours[0]).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHours[0]._id).to.be.a('string');
            (0, chai_1.expect)(response.body.businessHours[0].workHours).to.be.an('array');
            (0, chai_1.expect)(response.body.businessHours[0].workHours[0]).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHours[0].workHours[0].day)
                .to.be.an('string')
                .that.is.oneOf(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
            (0, chai_1.expect)(response.body.businessHours[0].workHours[0].start).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHours[0].workHours[0].finish).to.be.an('object');
            (0, chai_1.expect)(response.body.businessHours[0].workHours[0].open).to.be.a('boolean');
            (0, chai_1.expect)(response.body.businessHours[0].timezone).to.be.an('object').that.has.property('name').that.is.an('string');
            (0, chai_1.expect)(response.body.businessHours[0].active).to.be.a('boolean');
        }));
        (0, mocha_1.it)('should return a just created custom business hour', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `business-hour-${Date.now()}`;
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            yield (0, businessHours_1.saveBusinessHour)({
                name,
                active: true,
                type: core_typings_1.LivechatBusinessHourTypes.CUSTOM,
                workHours: [
                    {
                        day: 'Monday',
                        open: true,
                        // @ts-expect-error - this is valid for endpoint, actual type converts this into an object
                        start: '08:00',
                        // @ts-expect-error - same as previous one
                        finish: '18:00',
                    },
                ],
                timezone: {
                    name: 'America/Sao_Paulo',
                    utc: '-03:00',
                },
                departmentsToApplyBusinessHour: '',
                timezoneName: 'America/Sao_Paulo',
            });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/business-hours')).set(api_data_1.credentials).query({ name }).expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(body.businessHours).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body.businessHours[0]).to.be.an('object');
            (0, chai_1.expect)(body.businessHours[0]._id).to.be.a('string');
            (0, chai_1.expect)(body.businessHours[0]).to.have.property('name', name);
            (0, chai_1.expect)(body.businessHours[0]).to.have.property('active', true);
            (0, chai_1.expect)(body.businessHours[0]).to.have.property('type', core_typings_1.LivechatBusinessHourTypes.CUSTOM);
            (0, chai_1.expect)(body.businessHours[0]).to.have.property('workHours').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body.businessHours[0].workHours[0]).to.be.an('object').with.property('day', 'Monday');
            (0, chai_1.expect)(body.businessHours[0].workHours[0]).to.have.property('start').that.is.an('object');
            (0, chai_1.expect)(body.businessHours[0].workHours[0]).to.have.property('finish').that.is.an('object');
            (0, chai_1.expect)(body.businessHours[0]).to.have.property('timezone').that.is.an('object').with.property('name', 'America/Sao_Paulo');
        }));
        (0, mocha_1.it)('should fail if start and finish time are the same', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `business-hour-${Date.now()}`;
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            const result = yield (0, businessHours_1.saveBusinessHour)({
                name,
                active: true,
                type: core_typings_1.LivechatBusinessHourTypes.CUSTOM,
                workHours: [
                    {
                        day: 'Monday',
                        open: true,
                        // @ts-expect-error - this is valid for endpoint, actual type converts this into an object
                        start: '08:00',
                        // @ts-expect-error - same as previous one
                        finish: '08:00',
                    },
                ],
                timezone: {
                    name: 'America/Sao_Paulo',
                    utc: '-03:00',
                },
                departmentsToApplyBusinessHour: '',
                timezoneName: 'America/Sao_Paulo',
            });
            (0, chai_1.expect)(result).to.have.property('error');
        }));
        (0, mocha_1.it)('should fail if finish is before start time', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `business-hour-${Date.now()}`;
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            const result = yield (0, businessHours_1.saveBusinessHour)({
                name,
                active: true,
                type: core_typings_1.LivechatBusinessHourTypes.CUSTOM,
                workHours: [
                    {
                        day: 'Monday',
                        open: true,
                        // @ts-expect-error - this is valid for endpoint, actual type converts this into an object
                        start: '10:00',
                        // @ts-expect-error - same as previous one
                        finish: '08:00',
                    },
                ],
                timezone: {
                    name: 'America/Sao_Paulo',
                    utc: '-03:00',
                },
                departmentsToApplyBusinessHour: '',
                timezoneName: 'America/Sao_Paulo',
            });
            (0, chai_1.expect)(result).to.have.property('error');
        }));
        (0, mocha_1.it)('should fail if data is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `business-hour-${Date.now()}`;
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            const result = yield (0, businessHours_1.saveBusinessHour)({
                name,
                active: true,
                type: core_typings_1.LivechatBusinessHourTypes.CUSTOM,
                workHours: [
                    {
                        day: 'Monday',
                        open: true,
                        // @ts-expect-error - this is valid for endpoint, actual type converts this into an object
                        start: '20000',
                        // @ts-expect-error - same as previous one
                        finish: 'xxxxx',
                    },
                ],
                timezone: {
                    name: 'America/Sao_Paulo',
                    utc: '-03:00',
                },
                departmentsToApplyBusinessHour: '',
                timezoneName: 'America/Sao_Paulo',
            });
            (0, chai_1.expect)(result).to.have.property('error');
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE][BH] On Business Hour created', () => {
        let defaultBusinessHour;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            // wait for the callbacks to be registered
            yield (0, sleep_1.sleep)(1000);
            // cleanup any existing business hours
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            // get default business hour
            defaultBusinessHour = yield (0, businessHours_1.getDefaultBusinessHour)();
            // close default business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, true);
        }));
        (0, mocha_1.it)('should create a custom business hour which is closed by default', () => __awaiter(void 0, void 0, void 0, function* () {
            // create custom business hour and link it to a department
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.createCustomBusinessHour)([department._id], false);
            const latestAgent = yield (0, users_helper_1.getMe)(agent.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(0);
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
        }));
        (0, mocha_1.it)('should create a custom business hour which is closed by default, but a bot agent shouldnt be affected', () => __awaiter(void 0, void 0, void 0, function* () {
            const bot = yield (0, users_helper_1.createUser)({ roles: ['bot', 'livechat-agent'] });
            const creds = yield (0, users_helper_1.login)(bot.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(creds);
            const { department } = yield (0, department_1.createDepartmentWithAgent)({ user: bot, credentials: creds });
            yield (0, businessHours_1.createCustomBusinessHour)([department._id], false);
            const latestAgent = yield (0, users_helper_1.getMe)(creds);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(0);
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.AVAILABLE);
        }));
    });
    // Scenario: Assume we have a BH linked to a department, and we archive the department
    // Expected result:
    // 1) If BH is open and only linked to that department, it should be closed
    // 2) If BH is open and linked to other departments, it should remain open
    // 3) Agents within the archived department should be assigned to default BH
    // 3.1) We'll also need to handle the case where if an agent is assigned to "dep1"
    //  and "dep2" and both these depts are connected to same BH, then in this case after
    //  archiving "dep1", we'd still need to BH within this user's cache since he's part of
    //  "dep2" which is linked to BH
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE][BH] On Department archived', () => {
        let defaultBusinessHour;
        let customBusinessHour;
        let deptLinkedToCustomBH;
        let agentLinkedToDept;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            // wait for the callbacks to be registered
            yield (0, sleep_1.sleep)(1000);
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // cleanup any existing business hours
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            // get default business hour
            defaultBusinessHour = yield (0, businessHours_1.getDefaultBusinessHour)();
            // close default business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, false);
            // create custom business hour and link it to a department
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([department._id]);
            agentLinkedToDept = agent;
            deptLinkedToCustomBH = department;
            // open custom business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(customBusinessHour, true);
        }));
        (0, mocha_1.it)('upon archiving a department, if BH is open and only linked to that department, it should be closed', () => __awaiter(void 0, void 0, void 0, function* () {
            // archive department
            yield (0, department_1.archiveDepartment)(deptLinkedToCustomBH._id);
            // verify if department is archived and BH link is removed
            const department = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(department).to.be.an('object');
            (0, chai_1.expect)(department).to.have.property('archived', true);
            (0, chai_1.expect)(department.businessHourId).to.be.undefined;
            // verify if BH is closed
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', false);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').that.is.empty;
        }));
        (0, mocha_1.it)('upon archiving a department, if BH is open and linked to other departments, it should remain open', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            // archive department
            yield (0, department_1.archiveDepartment)(deptLinkedToCustomBH._id);
            // verify if department is archived and BH link is removed
            const archivedDepartment = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(archivedDepartment).to.be.an('object');
            (0, chai_1.expect)(archivedDepartment).to.have.property('archived', true);
            (0, chai_1.expect)(archivedDepartment.businessHourId).to.be.undefined;
            // verify if other department is not archived and BH link is not removed
            const otherDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(otherDepartment).to.be.an('object');
            (0, chai_1.expect)(otherDepartment.businessHourId).to.be.equal(customBusinessHour._id);
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(department._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        (0, mocha_1.it)('upon archiving a department, agents within the archived department should be assigned to default BH', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, true);
            // archive department
            yield (0, department_1.archiveDepartment)(deptLinkedToCustomBH._id);
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBusinessHour._id);
        }));
        (0, mocha_1.it)('upon archiving a department, overlapping agents should still have BH within their cache', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            // create overlapping agent by adding previous agent to newly created department
            yield (0, department_1.addOrRemoveAgentFromDepartment)(department._id, {
                agentId: agentLinkedToDept.user._id,
                username: agentLinkedToDept.user.username || '',
            }, true);
            // archive department
            yield (0, department_1.archiveDepartment)(deptLinkedToCustomBH._id);
            // verify if department is archived and BH link is removed
            const archivedDepartment = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(archivedDepartment).to.be.an('object');
            (0, chai_1.expect)(archivedDepartment).to.have.property('archived', true);
            (0, chai_1.expect)(archivedDepartment.businessHourId).to.be.undefined;
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_b = (_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b._id).to.be.equal(department._id);
            // verify if overlapping agent still has BH within his cache
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_c = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _c === void 0 ? void 0 : _c[0]).to.be.equal(customBusinessHour._id);
            // verify if other agent still has BH within his cache
            const otherAgent = yield (0, users_helper_1.getMe)(agent.credentials);
            (0, chai_1.expect)(otherAgent).to.be.an('object');
            (0, chai_1.expect)(otherAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_d = otherAgent === null || otherAgent === void 0 ? void 0 : otherAgent.openBusinessHours) === null || _d === void 0 ? void 0 : _d[0]).to.be.equal(customBusinessHour._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            yield (0, users_helper_1.deleteUser)(agentLinkedToDept.user);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE][BH] On Department disabled', () => {
        let defaultBusinessHour;
        let customBusinessHour;
        let deptLinkedToCustomBH;
        let agentLinkedToDept;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            // wait for the callbacks to be registered
            yield (0, sleep_1.sleep)(1000);
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // cleanup any existing business hours
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            // get default business hour
            defaultBusinessHour = yield (0, businessHours_1.getDefaultBusinessHour)();
            // close default business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, false);
            // create custom business hour and link it to a department
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([department._id]);
            agentLinkedToDept = agent;
            deptLinkedToCustomBH = department;
            // open custom business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(customBusinessHour, true);
        }));
        (0, mocha_1.it)('upon disabling a department, if BH is open and only linked to that department, it should be closed', () => __awaiter(void 0, void 0, void 0, function* () {
            // disable department
            yield (0, department_1.disableDepartment)(deptLinkedToCustomBH);
            // verify if BH link is removed
            const department = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(department).to.be.an('object');
            (0, chai_1.expect)(department.businessHourId).to.be.undefined;
            // verify if BH is closed
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH.active).to.be.false;
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').that.is.empty;
        }));
        (0, mocha_1.it)('upon disabling a department, if BH is open and linked to other departments, it should remain open', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            // disable department
            yield (0, department_1.disableDepartment)(deptLinkedToCustomBH);
            // verify if BH link is removed
            const disabledDepartment = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(disabledDepartment).to.be.an('object');
            (0, chai_1.expect)(disabledDepartment.businessHourId).to.be.undefined;
            // verify if other department BH link is not removed
            const otherDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(otherDepartment).to.be.an('object');
            (0, chai_1.expect)(otherDepartment.businessHourId).to.be.equal(customBusinessHour._id);
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(department._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        (0, mocha_1.it)('upon disabling a department, agents within the disabled department should be assigned to default BH', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, true);
            // disable department
            yield (0, department_1.disableDepartment)(deptLinkedToCustomBH);
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBusinessHour._id);
        }));
        (0, mocha_1.it)('upon disabling a department, overlapping agents should still have BH within their cache', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            // create overlapping agent by adding previous agent to newly created department
            yield (0, department_1.addOrRemoveAgentFromDepartment)(department._id, {
                agentId: agentLinkedToDept.user._id,
                username: agentLinkedToDept.user.username || '',
            }, true);
            // disable department
            yield (0, department_1.disableDepartment)(deptLinkedToCustomBH);
            // verify if BH link is removed
            const disabledDepartment = yield (0, department_1.getDepartmentById)(deptLinkedToCustomBH._id);
            (0, chai_1.expect)(disabledDepartment).to.be.an('object');
            (0, chai_1.expect)(disabledDepartment.businessHourId).to.be.undefined;
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_b = (_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b._id).to.be.equal(department._id);
            // verify if overlapping agent still has BH within his cache
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_c = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _c === void 0 ? void 0 : _c[0]).to.be.equal(customBusinessHour._id);
            // verify if other agent still has BH within his cache
            const otherAgent = yield (0, users_helper_1.getMe)(agent.credentials);
            (0, chai_1.expect)(otherAgent).to.be.an('object');
            (0, chai_1.expect)(otherAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_d = otherAgent === null || otherAgent === void 0 ? void 0 : otherAgent.openBusinessHours) === null || _d === void 0 ? void 0 : _d[0]).to.be.equal(customBusinessHour._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            yield (0, users_helper_1.deleteUser)(agentLinkedToDept.user);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE][BH] On Department removed', () => {
        let defaultBusinessHour;
        let customBusinessHour;
        let deptLinkedToCustomBH;
        let agentLinkedToDept;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.MULTIPLE);
            // wait for the callbacks to be registered
            yield (0, sleep_1.sleep)(1000);
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // cleanup any existing business hours
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            // get default business hour
            defaultBusinessHour = yield (0, businessHours_1.getDefaultBusinessHour)();
            // close default business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, false);
            // create custom business hour and link it to a department
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([department._id]);
            agentLinkedToDept = agent;
            deptLinkedToCustomBH = department;
            // open custom business hour
            yield (0, businessHours_1.openOrCloseBusinessHour)(customBusinessHour, true);
        }));
        (0, mocha_1.it)('upon deleting a department, if BH is open and only linked to that department, it should be closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            // verify if BH is closed
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH.active).to.be.false;
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').that.is.empty;
        }));
        (0, mocha_1.it)('upon deleting a department, if BH is open and linked to other departments, it should remain open', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            // verify if other department BH link is not removed
            const otherDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(otherDepartment).to.be.an('object');
            (0, chai_1.expect)(otherDepartment.businessHourId).to.be.equal(customBusinessHour._id);
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(department._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        (0, mocha_1.it)('upon deleting a department, agents within the disabled department should be assigned to default BH', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBusinessHour, true);
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBusinessHour._id);
        }));
        (0, mocha_1.it)('upon deleting a department, overlapping agents should still have BH within their cache', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // create another department and link it to the same BH
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, businessHours_1.removeAllCustomBusinessHours)();
            customBusinessHour = yield (0, businessHours_1.createCustomBusinessHour)([deptLinkedToCustomBH._id, department._id]);
            // create overlapping agent by adding previous agent to newly created department
            yield (0, department_1.addOrRemoveAgentFromDepartment)(department._id, {
                agentId: agentLinkedToDept.user._id,
                username: agentLinkedToDept.user.username || '',
            }, true);
            yield (0, department_1.deleteDepartment)(deptLinkedToCustomBH._id);
            // verify if BH is still open
            const latestCustomBH = yield (0, businessHours_1.getCustomBusinessHourById)(customBusinessHour._id);
            (0, chai_1.expect)(latestCustomBH).to.be.an('object');
            (0, chai_1.expect)(latestCustomBH).to.have.property('active', true);
            (0, chai_1.expect)(latestCustomBH.departments).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_b = (_a = latestCustomBH === null || latestCustomBH === void 0 ? void 0 : latestCustomBH.departments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b._id).to.be.equal(department._id);
            // verify if overlapping agent still has BH within his cache
            const latestAgent = yield (0, users_helper_1.getMe)(agentLinkedToDept.credentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_c = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _c === void 0 ? void 0 : _c[0]).to.be.equal(customBusinessHour._id);
            // verify if other agent still has BH within his cache
            const otherAgent = yield (0, users_helper_1.getMe)(agent.credentials);
            (0, chai_1.expect)(otherAgent).to.be.an('object');
            (0, chai_1.expect)(otherAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_d = otherAgent === null || otherAgent === void 0 ? void 0 : otherAgent.openBusinessHours) === null || _d === void 0 ? void 0 : _d[0]).to.be.equal(customBusinessHour._id);
            // cleanup
            yield (0, department_1.deleteDepartment)(department._id);
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(agentLinkedToDept.user);
        }));
    });
    (0, mocha_1.describe)('[CE][BH] On Agent created/removed', () => {
        let defaultBH;
        let agent;
        let agentCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_business_hours', true);
            yield (0, permissions_helper_1.updateEESetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.SINGLE);
            // wait for callbacks to run
            yield (0, sleep_1.sleep)(2000);
            defaultBH = yield (0, businessHours_1.getDefaultBusinessHour)();
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, true);
            agent = yield (0, users_helper_1.createUser)();
            agentCredentials = yield (0, users_helper_1.login)(agent.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(agent);
        }));
        (0, mocha_1.it)('should create a new agent and verify if it is assigned to the default business hour which is open', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            agent = yield (0, rooms_1.createAgent)(agent.username);
            const latestAgent = yield (0, users_helper_1.getMe)(agentCredentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBH._id);
        }));
        (0, mocha_1.it)('should create a new agent and verify if it is assigned to the default business hour which is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, false);
            const newUser = yield (0, users_helper_1.createUser)();
            const newUserCredentials = yield (0, users_helper_1.login)(newUser.username, user_1.password);
            yield (0, rooms_1.createAgent)(newUser.username);
            const latestAgent = yield (0, users_helper_1.getMe)(newUserCredentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.undefined;
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
            // cleanup
            yield (0, users_helper_1.deleteUser)(newUser);
        }));
        (0, mocha_1.it)('should verify if agent is assigned to BH when it is opened', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // first verify if agent is not assigned to any BH
            let latestAgent = yield (0, users_helper_1.getMe)(agentCredentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(0);
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
            // now open BH
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, true);
            // verify if agent is assigned to BH
            latestAgent = yield (0, users_helper_1.getMe)(agentCredentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
            (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBH._id);
            // verify if agent is able to make themselves available
            yield (0, rooms_1.makeAgentAvailable)(agentCredentials);
        }));
        (0, mocha_1.it)('should verify if BH related props are cleared when an agent is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_1.removeAgent)(agent._id);
            const latestAgent = yield (0, users_helper_1.getMe)(agentCredentials);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.undefined;
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.undefined;
        }));
        (0, mocha_1.describe)('Special Case - Agent created, BH already enabled', () => {
            let newAgent;
            let newAgentCredentials;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                newAgent = yield (0, users_helper_1.createUser)({ roles: ['user', 'livechat-agent'] });
                newAgentCredentials = yield (0, users_helper_1.login)(newAgent.username, user_1.password);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, users_helper_1.deleteUser)(newAgent);
            }));
            (0, mocha_1.it)('should verify a newly created agent to be assigned to the default business hour', () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const latestAgent = yield (0, users_helper_1.getMe)(newAgentCredentials);
                (0, chai_1.expect)(latestAgent).to.be.an('object');
                (0, chai_1.expect)(latestAgent.openBusinessHours).to.be.an('array').of.length(1);
                (0, chai_1.expect)((_a = latestAgent === null || latestAgent === void 0 ? void 0 : latestAgent.openBusinessHours) === null || _a === void 0 ? void 0 : _a[0]).to.be.equal(defaultBH._id);
            }));
        });
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(agent);
        }));
    });
    (0, mocha_1.describe)('[CE][BH] On Agent deactivated/activated', () => {
        let defaultBH;
        let agent;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_business_hours', true);
            yield (0, permissions_helper_1.updateEESetting)('Livechat_business_hour_type', core_typings_1.LivechatBusinessHourBehaviors.SINGLE);
            // wait for callbacks to run
            yield (0, sleep_1.sleep)(2000);
            defaultBH = yield (0, businessHours_1.getDefaultBusinessHour)();
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, true);
            agent = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(agent.username);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(agent);
            yield (0, permissions_helper_1.updateSetting)('Livechat_enable_business_hours', false);
        }));
        (0, mocha_1.it)('should verify if agent becomes unavailable to take chats when user is deactivated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.makeAgentAvailable)(yield (0, users_helper_1.login)(agent.username, user_1.password));
            yield (0, users_helper_1.setUserActiveStatus)(agent._id, false);
            const latestAgent = yield (0, users_helper_1.getUserByUsername)(agent.username);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
        }));
        (0, mocha_1.it)('should verify if agent becomes available to take chats when user is activated, if business hour is active', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, true);
            yield (0, users_helper_1.setUserActiveStatus)(agent._id, true);
            const latestAgent = yield (0, users_helper_1.getUserByUsername)(agent.username);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.AVAILABLE);
        }));
        (0, mocha_1.it)('should verify if agent becomes unavailable to take chats when user is activated, if business hour is inactive', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.openOrCloseBusinessHour)(defaultBH, false);
            yield (0, users_helper_1.setUserActiveStatus)(agent._id, false);
            yield (0, users_helper_1.setUserActiveStatus)(agent._id, true);
            const latestAgent = yield (0, users_helper_1.getUserByUsername)(agent.username);
            (0, chai_1.expect)(latestAgent).to.be.an('object');
            (0, chai_1.expect)(latestAgent.statusLivechat).to.be.equal(core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
        }));
        (0, mocha_1.it)('should verify if managers are not able to make deactivated agents available', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.createManager)();
            yield (0, users_helper_1.setUserActiveStatus)(agent._id, false);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(api_data_1.credentials)
                .send({
                status: 'available',
                agentId: agent._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'error-user-deactivated');
        }));
    });
});
