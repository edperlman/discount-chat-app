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
exports.restrictQuery = void 0;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
const logger_1 = require("../lib/logger");
const units_1 = require("../lib/units");
const restrictQuery = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (originalQuery = {}) {
    const query = Object.assign({}, originalQuery);
    const units = yield (0, units_1.getUnitsFromUser)();
    if (!Array.isArray(units)) {
        return query;
    }
    const departments = yield models_1.LivechatDepartment.find({ ancestors: { $in: units } }, { projection: { _id: 1 } }).toArray();
    const expressions = query.$and || [];
    const condition = {
        $or: [{ departmentAncestors: { $in: units } }, { departmentId: { $in: departments.map(({ _id }) => _id) } }],
    };
    query.$and = [condition, ...expressions];
    logger_1.cbLogger.debug({ msg: 'Applying room query restrictions', units });
    return query;
});
exports.restrictQuery = restrictQuery;
callbacks_1.callbacks.add('livechat.applyRoomRestrictions', (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (originalQuery = {}) {
    return (0, exports.restrictQuery)(originalQuery);
}), callbacks_1.callbacks.priority.HIGH, 'livechat-apply-room-restrictions');
