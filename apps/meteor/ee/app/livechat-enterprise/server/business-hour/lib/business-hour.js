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
exports.findBusinessHours = findBusinessHours;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const hasPermission_1 = require("../../../../../../app/authorization/server/functions/hasPermission");
function findBusinessHours(userId_1, _a, name_1) {
    return __awaiter(this, arguments, void 0, function* (userId, { offset, count, sort }, name) {
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-livechat-business-hours'))) {
            throw new Error('error-not-authorized');
        }
        const query = {};
        if (name) {
            const filterReg = new RegExp((0, string_helpers_1.escapeRegExp)(name), 'i');
            Object.assign(query, { name: filterReg });
        }
        const { cursor, totalCount } = models_1.LivechatBusinessHours.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [businessHours, total] = yield Promise.all([cursor.toArray(), totalCount]);
        // add departments to businessHours
        const businessHoursWithDepartments = yield Promise.all(businessHours.map((businessHour) => __awaiter(this, void 0, void 0, function* () {
            const currentDepartments = yield models_1.LivechatDepartment.findByBusinessHourId(businessHour._id, {
                projection: { _id: 1 },
            }).toArray();
            if (currentDepartments.length) {
                businessHour.departments = currentDepartments;
            }
            return businessHour;
        })));
        return {
            businessHours: businessHoursWithDepartments,
            count: businessHours.length,
            offset,
            total,
        };
    });
}
