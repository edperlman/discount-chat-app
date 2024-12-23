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
exports.findAllDepartmentsByUnit = exports.findAllDepartmentsAvailable = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const callbacks_1 = require("../../../../../lib/callbacks");
const findAllDepartmentsAvailable = (uid_1, unitId_1, offset_1, count_1, text_1, ...args_1) => __awaiter(void 0, [uid_1, unitId_1, offset_1, count_1, text_1, ...args_1], void 0, function* (uid, unitId, offset, count, text, onlyMyDepartments = false) {
    const filterReg = new RegExp((0, string_helpers_1.escapeRegExp)(text || ''), 'i');
    let query = Object.assign({ type: { $ne: 'u' }, $or: [{ ancestors: { $in: [[unitId], null, []] } }, { ancestors: { $exists: false } }] }, (text && { name: filterReg }));
    if (onlyMyDepartments) {
        query = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', query, { userId: uid });
    }
    const { cursor, totalCount } = models_1.LivechatDepartment.findPaginated(query, { limit: count, offset, sort: { name: 1 } });
    const [departments, total] = yield Promise.all([cursor.toArray(), totalCount]);
    return { departments, total };
});
exports.findAllDepartmentsAvailable = findAllDepartmentsAvailable;
const findAllDepartmentsByUnit = (unitId, offset, count) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, totalCount } = models_1.LivechatDepartment.findPaginated({
        ancestors: { $in: [unitId] },
    }, { limit: count, offset });
    const [departments, total] = yield Promise.all([cursor.toArray(), totalCount]);
    return { departments, total };
});
exports.findAllDepartmentsByUnit = findAllDepartmentsByUnit;
