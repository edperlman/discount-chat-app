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
exports.manageDepartmentUnit = void 0;
const models_1 = require("@rocket.chat/models");
const hasRole_1 = require("../../../../../app/authorization/server/functions/hasRole");
const callbacks_1 = require("../../../../../lib/callbacks");
const getUnitsFromUserRoles_1 = require("../methods/getUnitsFromUserRoles");
const manageDepartmentUnit = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, departmentId, unitId }) {
    var _b;
    const accessibleUnits = yield (0, getUnitsFromUserRoles_1.getUnitsFromUser)(userId);
    const isLivechatManager = yield (0, hasRole_1.hasAnyRoleAsync)(userId, ['admin', 'livechat-manager']);
    const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
        projection: { ancestors: 1, parentId: 1 },
    });
    const isDepartmentAlreadyInUnit = unitId && ((_b = department === null || department === void 0 ? void 0 : department.ancestors) === null || _b === void 0 ? void 0 : _b.includes(unitId));
    if (!department || isDepartmentAlreadyInUnit) {
        return;
    }
    const currentDepartmentUnitId = department.parentId;
    const canManageNewUnit = !unitId || isLivechatManager || (Array.isArray(accessibleUnits) && accessibleUnits.includes(unitId));
    const canManageCurrentUnit = !currentDepartmentUnitId || isLivechatManager || (Array.isArray(accessibleUnits) && accessibleUnits.includes(currentDepartmentUnitId));
    if (!canManageNewUnit || !canManageCurrentUnit) {
        return;
    }
    if (unitId) {
        const unit = yield models_1.LivechatUnit.findOneById(unitId, {
            projection: { ancestors: 1 },
        });
        if (!unit) {
            return;
        }
        if (currentDepartmentUnitId) {
            yield models_1.LivechatUnit.decrementDepartmentsCount(currentDepartmentUnitId);
        }
        yield models_1.LivechatDepartment.addDepartmentToUnit(departmentId, unitId, [unitId, ...(unit.ancestors || [])]);
        yield models_1.LivechatUnit.incrementDepartmentsCount(unitId);
        return;
    }
    if (currentDepartmentUnitId) {
        yield models_1.LivechatUnit.decrementDepartmentsCount(currentDepartmentUnitId);
    }
    yield models_1.LivechatDepartment.removeDepartmentFromUnit(departmentId);
});
exports.manageDepartmentUnit = manageDepartmentUnit;
callbacks_1.callbacks.add('livechat.manageDepartmentUnit', exports.manageDepartmentUnit, callbacks_1.callbacks.priority.HIGH, 'livechat-manage-department-unit');
