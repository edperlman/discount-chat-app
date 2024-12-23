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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleBusinessHoursBehavior = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const Helper_1 = require("./Helper");
const business_hour_1 = require("../../../../../app/livechat/server/business-hour");
const AbstractBusinessHour_1 = require("../../../../../app/livechat/server/business-hour/AbstractBusinessHour");
const Helper_2 = require("../../../../../app/livechat/server/business-hour/Helper");
const closeBusinessHour_1 = require("../../../../../app/livechat/server/business-hour/closeBusinessHour");
const server_1 = require("../../../../../app/settings/server");
const isTruthy_1 = require("../../../../../lib/isTruthy");
const logger_1 = require("../lib/logger");
class MultipleBusinessHoursBehavior extends AbstractBusinessHour_1.AbstractBusinessHourBehavior {
    constructor() {
        super();
        this.onAddAgentToDepartment = this.onAddAgentToDepartment.bind(this);
        this.onRemoveAgentFromDepartment = this.onRemoveAgentFromDepartment.bind(this);
        this.onRemoveDepartment = this.onRemoveDepartment.bind(this);
        this.onDepartmentArchived = this.onDepartmentArchived.bind(this);
        this.onDepartmentDisabled = this.onDepartmentDisabled.bind(this);
        this.onNewAgentCreated = this.onNewAgentCreated.bind(this);
    }
    onStartBusinessHours() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UsersRepository.removeBusinessHoursFromAllUsers();
            // TODO is this required? since we're calling `this.openBusinessHour(businessHour)` later on, which will call this again (kinda)
            yield (0, Helper_2.makeAgentsUnavailableBasedOnBusinessHour)();
            const currentTime = moment_1.default.utc((0, moment_1.default)().utc().format('dddd:HH:mm'), 'dddd:HH:mm');
            const day = currentTime.format('dddd');
            const activeBusinessHours = yield this.BusinessHourRepository.findActiveAndOpenBusinessHoursByDay(day, {
                projection: {
                    workHours: 1,
                    timezone: 1,
                    type: 1,
                    active: 1,
                },
            });
            const businessHoursToOpen = yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)(activeBusinessHours);
            logger_1.bhLogger.info({
                msg: 'Starting Multiple Business Hours',
                totalBusinessHoursToOpen: businessHoursToOpen.length,
                top10BusinessHoursToOpen: businessHoursToOpen.slice(0, 10),
            });
            for (const businessHour of businessHoursToOpen) {
                void this.openBusinessHour(businessHour);
            }
        });
    }
    openBusinessHoursByDayAndHour(day, hour) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHours = yield this.BusinessHourRepository.findActiveBusinessHoursToOpen(day, hour, undefined, {
                projection: {
                    _id: 1,
                    type: 1,
                },
            });
            for (const businessHour of businessHours) {
                void this.openBusinessHour(businessHour);
            }
        });
    }
    closeBusinessHoursByDayAndHour(day, hour) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHours = yield this.BusinessHourRepository.findActiveBusinessHoursToClose(day, hour, undefined, {
                projection: {
                    _id: 1,
                    type: 1,
                },
            });
            for (const businessHour of businessHours) {
                void this.closeBusinessHour(businessHour);
            }
        });
    }
    afterSaveBusinessHours(businessHourData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const departments = (_a = businessHourData.departmentsToApplyBusinessHour) === null || _a === void 0 ? void 0 : _a.split(',').filter(Boolean);
            const currentDepartments = (_b = businessHourData.departments) === null || _b === void 0 ? void 0 : _b.map((dept) => dept._id);
            const toRemove = [...(currentDepartments || []).filter((dept) => !departments.includes(dept))];
            yield this.removeBusinessHourFromRemovedDepartmentsUsersIfNeeded(businessHourData._id, toRemove);
            const businessHour = yield this.BusinessHourRepository.findOneById(businessHourData._id);
            if (!businessHour) {
                return;
            }
            const businessHourIdToOpen = (yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)([businessHour])).map((businessHour) => businessHour._id);
            if (!businessHourIdToOpen.length) {
                return (0, closeBusinessHour_1.closeBusinessHour)(businessHour);
            }
            return (0, Helper_1.openBusinessHour)(businessHour);
        });
    }
    onAddAgentToDepartment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId, agentsId } = options;
            const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
                projection: { businessHourId: 1 },
            });
            if (!department || !agentsId.length) {
                return options;
            }
            const defaultBusinessHour = yield this.BusinessHourRepository.findOneDefaultBusinessHour();
            if (!defaultBusinessHour) {
                return options;
            }
            if (!department.businessHourId) {
                // If this department doesn't have a business hour, we need to apply default business hour to these agents
                // And then reset their status based on these BH
                const isDefaultBusinessHourActive = (yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)([defaultBusinessHour])).length > 0;
                if (!isDefaultBusinessHourActive) {
                    logger_1.bhLogger.debug('Default business hour is not active. No need to apply it to agents');
                    return options;
                }
                yield this.UsersRepository.addBusinessHourByAgentIds(agentsId, defaultBusinessHour._id);
                yield (0, Helper_2.makeOnlineAgentsAvailable)(agentsId);
                return options;
            }
            // This department has a business hour, so we need to
            // 1. Remove default business hour from these agents if they have it
            // 2. Add this department's business hour to these agents
            // 3. Update their status based on these BH
            yield (0, Helper_1.removeBusinessHourByAgentIds)(agentsId, defaultBusinessHour._id);
            const businessHour = yield this.BusinessHourRepository.findOneById(department.businessHourId);
            if (!businessHour) {
                return options;
            }
            const businessHourToOpen = yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)([businessHour]);
            if (!businessHourToOpen.length) {
                return options;
            }
            yield this.UsersRepository.addBusinessHourByAgentIds(agentsId, businessHour._id);
            yield (0, Helper_2.makeOnlineAgentsAvailable)(agentsId);
            return options;
        });
    }
    onRemoveAgentFromDepartment() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { departmentId, agentsId } = options;
            const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
                projection: { businessHourId: 1 },
            });
            if (!department || !agentsId.length) {
                return options;
            }
            return this.handleRemoveAgentsFromDepartments(department, agentsId, options);
        });
    }
    onRemoveDepartment(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { department, agentsIds } = options;
            if (!department || !(agentsIds === null || agentsIds === void 0 ? void 0 : agentsIds.length)) {
                return options;
            }
            return this.onDepartmentDisabled(department);
        });
    }
    onDepartmentDisabled(department) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (!department.businessHourId) {
                return;
            }
            // Get business hour
            let businessHour = yield this.BusinessHourRepository.findOneById(department.businessHourId);
            if (!businessHour) {
                logger_1.bhLogger.error({
                    msg: 'onDepartmentDisabled: business hour not found',
                    businessHourId: department.businessHourId,
                });
                return;
            }
            // Unlink business hour from department
            yield models_1.LivechatDepartment.removeBusinessHourFromDepartmentsByIdsAndBusinessHourId([department._id], businessHour._id);
            // cleanup user's cache for default business hour and this business hour
            const defaultBH = yield this.BusinessHourRepository.findOneDefaultBusinessHour();
            if (!defaultBH) {
                throw new Error('Default business hour not found');
            }
            yield this.UsersRepository.closeAgentsBusinessHoursByBusinessHourIds([businessHour._id, defaultBH._id]);
            // If i'm the only one, disable the business hour
            const imTheOnlyOne = !(yield models_1.LivechatDepartment.countByBusinessHourIdExcludingDepartmentId(businessHour._id, department._id));
            if (imTheOnlyOne) {
                logger_1.bhLogger.warn({
                    msg: 'onDepartmentDisabled: department is the only one on business hour, disabling it',
                    departmentId: department._id,
                    businessHourId: businessHour._id,
                });
                yield this.BusinessHourRepository.disableBusinessHour(businessHour._id);
                businessHour = yield this.BusinessHourRepository.findOneById(department.businessHourId);
                if (!businessHour) {
                    throw new Error(`Business hour ${department.businessHourId} not found`);
                }
            }
            // start default business hour and this BH if needed
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return;
            }
            const businessHourToOpen = yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)([businessHour, defaultBH]);
            try {
                for (var _d = true, businessHourToOpen_1 = __asyncValues(businessHourToOpen), businessHourToOpen_1_1; businessHourToOpen_1_1 = yield businessHourToOpen_1.next(), _a = businessHourToOpen_1_1.done, !_a; _d = true) {
                    _c = businessHourToOpen_1_1.value;
                    _d = false;
                    const bh = _c;
                    yield (0, Helper_1.openBusinessHour)(bh, false);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = businessHourToOpen_1.return)) yield _b.call(businessHourToOpen_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield (0, Helper_2.makeAgentsUnavailableBasedOnBusinessHour)();
            yield business_hour_1.businessHourManager.restartCronJobsIfNecessary();
        });
    }
    onDepartmentArchived(department) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.bhLogger.debug('Processing department archived event on multiple business hours', department);
            return this.onDepartmentDisabled(department);
        });
    }
    allowAgentChangeServiceStatus(agentId) {
        return this.UsersRepository.isAgentWithinBusinessHours(agentId);
    }
    onNewAgentCreated(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.applyAnyOpenBusinessHourToAgent(agentId);
            yield (0, Helper_2.makeAgentsUnavailableBasedOnBusinessHour)([agentId]);
        });
    }
    applyAnyOpenBusinessHourToAgent(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = (0, moment_1.default)().utc();
            const day = currentTime.format('dddd');
            const allActiveBusinessHoursForEntireWeek = yield this.BusinessHourRepository.findActiveBusinessHours({
                projection: {
                    workHours: 1,
                    timezone: 1,
                    type: 1,
                    active: 1,
                },
            });
            const openedBusinessHours = yield (0, Helper_2.filterBusinessHoursThatMustBeOpenedByDay)(allActiveBusinessHoursForEntireWeek, day);
            if (!openedBusinessHours.length) {
                logger_1.bhLogger.debug({
                    msg: 'Business hour status check failed for agent. No opened business hour found for the current day',
                    agentId,
                });
                return;
            }
            const agentDepartments = yield models_1.LivechatDepartmentAgents.find({ departmentEnabled: true, agentId }, { projection: { agentId: 1, departmentId: 1 } }).toArray();
            if (!agentDepartments.length) {
                // check if default businessHour is active
                const isDefaultBHActive = openedBusinessHours.find(({ type }) => type === core_typings_1.LivechatBusinessHourTypes.DEFAULT);
                if (isDefaultBHActive === null || isDefaultBHActive === void 0 ? void 0 : isDefaultBHActive._id) {
                    yield models_1.Users.openAgentBusinessHoursByBusinessHourIdsAndAgentId([isDefaultBHActive._id], agentId);
                    return;
                }
                logger_1.bhLogger.debug({
                    msg: 'Business hour status check failed for agent. Found default business hour to be inactive',
                    agentId,
                });
                return;
            }
            // check if any one these departments have a opened business hour linked to it
            const departments = (yield models_1.LivechatDepartment.findInIds(agentDepartments.map(({ departmentId }) => departmentId), { projection: { _id: 1, businessHourId: 1 } }).toArray());
            const departmentsWithActiveBH = departments.filter(({ businessHourId }) => businessHourId && openedBusinessHours.findIndex(({ _id }) => _id === businessHourId) !== -1);
            if (!departmentsWithActiveBH.length) {
                // No opened business hour found for any of the departments connected to the agent
                // check if this agent has any departments that is connected to any non-default business hour
                // if no such departments found then check default BH and if it is active, then allow the agent to change service status
                const hasAtLeastOneDepartmentWithNonDefaultBH = departments.some(({ businessHourId }) => {
                    // check if business hour is active
                    return businessHourId && allActiveBusinessHoursForEntireWeek.findIndex(({ _id }) => _id === businessHourId) !== -1;
                });
                if (!hasAtLeastOneDepartmentWithNonDefaultBH) {
                    const isDefaultBHActive = openedBusinessHours.find(({ type }) => type === core_typings_1.LivechatBusinessHourTypes.DEFAULT);
                    if (isDefaultBHActive === null || isDefaultBHActive === void 0 ? void 0 : isDefaultBHActive._id) {
                        yield models_1.Users.openAgentBusinessHoursByBusinessHourIdsAndAgentId([isDefaultBHActive._id], agentId);
                        return;
                    }
                }
                logger_1.bhLogger.debug({
                    msg: 'Business hour status check failed for agent. No opened business hour found for any of the departments connected to the agent',
                    agentId,
                });
                return;
            }
            const activeBusinessHoursForAgent = departmentsWithActiveBH.map(({ businessHourId }) => businessHourId).filter(isTruthy_1.isTruthy);
            yield models_1.Users.openAgentBusinessHoursByBusinessHourIdsAndAgentId(activeBusinessHoursForAgent, agentId);
            logger_1.bhLogger.debug({
                msg: `Business hour status check passed for agent. Found opened business hour for departments connected to the agent`,
                activeBusinessHoursForAgent,
            });
        });
    }
    handleRemoveAgentsFromDepartments(department, agentsIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const agentIdsWithoutDepartment = [];
            const agentIdsToRemoveCurrentBusinessHour = [];
            const [agentsWithDepartment, [agentsOfDepartment] = []] = yield Promise.all([
                models_1.LivechatDepartmentAgents.findByAgentIds(agentsIds, { projection: { agentId: 1 } }).toArray(),
                models_1.LivechatDepartment.findAgentsByBusinessHourId(department.businessHourId).toArray(),
            ]);
            for (const agentId of agentsIds) {
                if (!agentsWithDepartment.find((agent) => agent.agentId === agentId)) {
                    agentIdsWithoutDepartment.push(agentId);
                }
                if (!((_a = agentsOfDepartment === null || agentsOfDepartment === void 0 ? void 0 : agentsOfDepartment.agentIds) === null || _a === void 0 ? void 0 : _a.find((agent) => agent === agentId))) {
                    agentIdsToRemoveCurrentBusinessHour.push(agentId);
                }
            }
            if (department.businessHourId) {
                yield (0, Helper_1.removeBusinessHourByAgentIds)(agentIdsToRemoveCurrentBusinessHour, department.businessHourId);
            }
            if (!agentIdsWithoutDepartment.length) {
                return options;
            }
            const defaultBusinessHour = yield this.BusinessHourRepository.findOneDefaultBusinessHour();
            if (!defaultBusinessHour) {
                return options;
            }
            const businessHourToOpen = yield (0, Helper_2.filterBusinessHoursThatMustBeOpened)([defaultBusinessHour]);
            if (!businessHourToOpen.length) {
                return options;
            }
            yield this.UsersRepository.addBusinessHourByAgentIds(agentIdsWithoutDepartment, defaultBusinessHour._id);
            return options;
        });
    }
    openBusinessHour(businessHour) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Helper_1.openBusinessHour)(businessHour);
        });
    }
    removeBusinessHourFromRemovedDepartmentsUsersIfNeeded(businessHourId, departmentsToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!departmentsToRemove.length) {
                return;
            }
            const agentIds = (yield models_1.LivechatDepartmentAgents.findByDepartmentIds(departmentsToRemove, { projection: { agentId: 1 } }).toArray()).map((dept) => dept.agentId);
            yield (0, Helper_1.removeBusinessHourByAgentIds)(agentIds, businessHourId);
        });
    }
    closeBusinessHour(businessHour) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, closeBusinessHour_1.closeBusinessHour)(businessHour);
        });
    }
}
exports.MultipleBusinessHoursBehavior = MultipleBusinessHoursBehavior;
