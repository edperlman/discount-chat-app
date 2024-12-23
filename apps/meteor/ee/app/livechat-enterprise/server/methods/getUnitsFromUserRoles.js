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
exports.getUnitsFromUser = void 0;
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const meteor_1 = require("meteor/meteor");
const hasRole_1 = require("../../../../../app/authorization/server/functions/hasRole");
const logger_1 = require("../lib/logger");
function getUnitsFromUserRoles(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return models_1.LivechatUnit.findByMonitorId(user);
    });
}
function getDepartmentsFromUserRoles(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield models_1.LivechatDepartmentAgents.findByAgentId(user).toArray()).map((department) => department.departmentId);
    });
}
const memoizedGetUnitFromUserRoles = (0, mem_1.default)(getUnitsFromUserRoles, { maxAge: process.env.TEST_MODE ? 1 : 10000 });
const memoizedGetDepartmentsFromUserRoles = (0, mem_1.default)(getDepartmentsFromUserRoles, { maxAge: process.env.TEST_MODE ? 1 : 10000 });
const getUnitsFromUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user || (yield (0, hasRole_1.hasAnyRoleAsync)(user, ['admin', 'livechat-manager']))) {
        return;
    }
    if (!(yield (0, hasRole_1.hasAnyRoleAsync)(user, ['livechat-monitor']))) {
        return;
    }
    const unitsAndDepartments = [...(yield memoizedGetUnitFromUserRoles(user)), ...(yield memoizedGetDepartmentsFromUserRoles(user))];
    logger_1.logger.debug({ msg: 'Calculating units for monitor', user, unitsAndDepartments });
    return unitsAndDepartments;
});
exports.getUnitsFromUser = getUnitsFromUser;
meteor_1.Meteor.methods({
    'livechat:getUnitsFromUser'() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = meteor_1.Meteor.userId();
            if (!user) {
                return;
            }
            return (0, exports.getUnitsFromUser)(user);
        });
    },
});
