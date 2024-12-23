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
exports.addQueryRestrictionsToDepartmentsModel = void 0;
const hasRole_1 = require("../../../../../app/authorization/server/functions/hasRole");
const callbacks_1 = require("../../../../../lib/callbacks");
const logger_1 = require("../lib/logger");
const getUnitsFromUserRoles_1 = require("../methods/getUnitsFromUserRoles");
const addQueryRestrictionsToDepartmentsModel = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (originalQuery = {}, userId) {
    const query = Object.assign(Object.assign({}, originalQuery), { type: { $ne: 'u' } });
    const units = yield (0, getUnitsFromUserRoles_1.getUnitsFromUser)(userId);
    if (Array.isArray(units)) {
        query.ancestors = { $in: units };
    }
    logger_1.cbLogger.debug({ msg: 'Applying department query restrictions', userId, units });
    return query;
});
exports.addQueryRestrictionsToDepartmentsModel = addQueryRestrictionsToDepartmentsModel;
callbacks_1.callbacks.add('livechat.applyDepartmentRestrictions', (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (originalQuery = {}, { userId } = { userId: null }) {
    if (!userId || !(yield (0, hasRole_1.hasRoleAsync)(userId, 'livechat-monitor'))) {
        return originalQuery;
    }
    logger_1.cbLogger.debug('Applying department query restrictions');
    return (0, exports.addQueryRestrictionsToDepartmentsModel)(originalQuery, userId);
}), callbacks_1.callbacks.priority.HIGH, 'livechat-apply-department-restrictions');
