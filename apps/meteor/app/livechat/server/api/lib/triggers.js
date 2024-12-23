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
exports.findTriggers = findTriggers;
exports.findTriggerById = findTriggerById;
exports.deleteTrigger = deleteTrigger;
const models_1 = require("@rocket.chat/models");
function findTriggers(_a) {
    return __awaiter(this, arguments, void 0, function* ({ pagination: { offset, count, sort }, }) {
        const { cursor, totalCount } = models_1.LivechatTrigger.findPaginated({}, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [triggers, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            triggers,
            count: triggers.length,
            offset,
            total,
        };
    });
}
function findTriggerById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ triggerId }) {
        return models_1.LivechatTrigger.findOneById(triggerId);
    });
}
function deleteTrigger(_a) {
    return __awaiter(this, arguments, void 0, function* ({ triggerId }) {
        yield models_1.LivechatTrigger.removeById(triggerId);
    });
}
