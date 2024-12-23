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
exports.findUnits = findUnits;
exports.findUnitMonitors = findUnitMonitors;
exports.findUnitById = findUnitById;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
function findUnits(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        const filter = text && new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i');
        const query = Object.assign({}, (text && { $or: [{ name: filter }] }));
        const { cursor, totalCount } = models_1.LivechatUnit.findPaginatedUnits(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [units, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            units,
            count: units.length,
            offset,
            total,
        };
    });
}
function findUnitMonitors(_a) {
    return __awaiter(this, arguments, void 0, function* ({ unitId }) {
        return models_1.LivechatUnitMonitors.find({ unitId }).toArray();
    });
}
function findUnitById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ unitId }) {
        return models_1.LivechatUnit.findOneById(unitId);
    });
}
