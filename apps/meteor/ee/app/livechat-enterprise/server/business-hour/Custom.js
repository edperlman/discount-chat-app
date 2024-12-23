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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const business_hour_1 = require("../../../../../app/livechat/server/business-hour");
const AbstractBusinessHour_1 = require("../../../../../app/livechat/server/business-hour/AbstractBusinessHour");
const Helper_1 = require("../../../../../app/livechat/server/business-hour/Helper");
const logger_1 = require("../lib/logger");
class CustomBusinessHour extends AbstractBusinessHour_1.AbstractBusinessHourType {
    constructor() {
        super(...arguments);
        this.name = core_typings_1.LivechatBusinessHourTypes.CUSTOM;
    }
    getBusinessHour(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return null;
            }
            const businessHour = yield this.BusinessHourRepository.findOneById(id);
            if (!businessHour) {
                return null;
            }
            businessHour.departments = yield models_1.LivechatDepartment.findByBusinessHourId(businessHour._id, {
                projection: { name: 1 },
            }).toArray();
            return businessHour;
        });
    }
    saveBusinessHour(businessHour) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingBusinessHour = (yield this.BusinessHourRepository.findOne({ name: businessHour.name }, { projection: { _id: 1 } }));
            if (existingBusinessHour && existingBusinessHour._id !== businessHour._id) {
                throw new Error('error-business-hour-name-already-in-use');
            }
            const { timezoneName, departmentsToApplyBusinessHour } = businessHour, businessHourData = __rest(businessHour, ["timezoneName", "departmentsToApplyBusinessHour"]);
            businessHourData.timezone = {
                name: timezoneName,
                utc: this.getUTCFromTimezone(timezoneName),
            };
            const departments = (departmentsToApplyBusinessHour === null || departmentsToApplyBusinessHour === void 0 ? void 0 : departmentsToApplyBusinessHour.split(',').filter(Boolean)) || [];
            const businessHourToReturn = Object.assign(Object.assign({}, businessHourData), { departmentsToApplyBusinessHour });
            delete businessHourData.departments;
            const businessHourId = yield this.baseSaveBusinessHour(businessHourData);
            const currentDepartments = (yield models_1.LivechatDepartment.findByBusinessHourId(businessHourId, {
                projection: { _id: 1 },
            }).toArray()).map((dept) => dept._id);
            const toRemove = [...currentDepartments.filter((dept) => !departments.includes(dept))];
            const toAdd = [...departments.filter((dept) => !currentDepartments.includes(dept))];
            yield this.removeBusinessHourFromDepartmentsIfNeeded(businessHourId, toRemove);
            // Now will check if the department which we're currently adding to BH is not
            // associated with any other BH. If it is, then it will remove the old BH from all user's
            // cache. It will not add the new BH right now as it will be done in afterSaveBusinessHour.
            yield this.removeBHFromPreviouslyConnectedDepartmentAgentsIfRequired(toAdd);
            yield this.addBusinessHourToDepartmentsIfNeeded(businessHourId, toAdd);
            businessHourToReturn._id = businessHourId;
            return businessHourToReturn;
        });
    }
    removeBusinessHourById(businessHourId) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHour = yield this.BusinessHourRepository.findOneById(businessHourId, {});
            if (!businessHour) {
                return;
            }
            yield this.BusinessHourRepository.removeById(businessHourId);
            yield this.removeBusinessHourFromAgents(businessHourId);
            yield models_1.LivechatDepartment.removeBusinessHourFromDepartmentsByBusinessHourId(businessHourId);
            yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
        });
    }
    removeBusinessHourFromAgents(businessHourId) {
        return __awaiter(this, void 0, void 0, function* () {
            const departmentIds = (yield models_1.LivechatDepartment.findByBusinessHourId(businessHourId, {
                projection: { _id: 1 },
            }).toArray()).map((dept) => dept._id);
            const agentIds = (yield models_1.LivechatDepartmentAgents.findByDepartmentIds(departmentIds, {
                projection: { agentId: 1 },
            }).toArray()).map((dept) => dept.agentId);
            this.UsersRepository.removeBusinessHourByAgentIds(agentIds, businessHourId);
        });
    }
    removeBusinessHourFromDepartmentsIfNeeded(businessHourId, departmentsToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!departmentsToRemove.length) {
                return;
            }
            yield models_1.LivechatDepartment.removeBusinessHourFromDepartmentsByIdsAndBusinessHourId(departmentsToRemove, businessHourId);
        });
    }
    removeBHFromPreviouslyConnectedDepartmentAgentsIfRequired(departmentIds) {
        return __awaiter(this, void 0, void 0, function* () {
            // we need to do 2 things here.
            // 1st is to check if any of the departments are associated with any BH. If they are, then we need to remove
            // that BH from all agents of that department.
            // 2nd is to check if any of the departments are not associated with BH, meaning default BH
            // is applied. So if default BH is open, then we need to remove it from all agents of that department.
            const bhIdsConnectedToDepartment = [];
            const departmentsWithoutBH = [];
            const departments = yield models_1.LivechatDepartment.findInIds(departmentIds, {
                projection: {
                    businessHourId: 1,
                },
            }).toArray();
            for (const dept of departments) {
                if (dept === null || dept === void 0 ? void 0 : dept.businessHourId) {
                    bhIdsConnectedToDepartment.push(dept.businessHourId);
                }
                else {
                    departmentsWithoutBH.push(dept._id);
                }
            }
            yield models_1.Users.closeAgentsBusinessHoursByBusinessHourIds(bhIdsConnectedToDepartment);
            // start of step 2
            const defaultBusinessHour = yield this.BusinessHourRepository.findOneDefaultBusinessHour();
            if (!defaultBusinessHour) {
                logger_1.bhLogger.error('No default business hour found');
                return;
            }
            const isDefaultBHActive = (yield (0, Helper_1.filterBusinessHoursThatMustBeOpened)([defaultBusinessHour])).length > 0;
            if (!isDefaultBHActive) {
                logger_1.bhLogger.debug('Default business hour is not active. No need to remove it from agents');
                return;
            }
            const agentsConnectedToDefaultBH = yield (yield models_1.LivechatDepartmentAgents.findByDepartmentIds(departmentIds, {
                projection: { agentId: 1 },
            }).toArray()).map((dept) => dept.agentId);
            yield models_1.Users.removeBusinessHourByAgentIds(agentsConnectedToDefaultBH, defaultBusinessHour._id);
            yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
        });
    }
    addBusinessHourToDepartmentsIfNeeded(businessHourId, departmentsToAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!departmentsToAdd.length) {
                return;
            }
            yield models_1.LivechatDepartment.addBusinessHourToDepartmentsByIds(departmentsToAdd, businessHourId);
        });
    }
}
business_hour_1.businessHourManager.registerBusinessHourType(new CustomBusinessHour());
