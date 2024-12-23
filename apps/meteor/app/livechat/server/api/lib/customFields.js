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
exports.findLivechatCustomFields = findLivechatCustomFields;
exports.findCustomFieldById = findCustomFieldById;
exports.setCustomField = setCustomField;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
function findLivechatCustomFields(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        const query = Object.assign({}, (text && {
            $or: [{ label: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }, { _id: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }],
        }));
        const { cursor, totalCount } = models_1.LivechatCustomField.findPaginated(query, {
            sort: sort || { label: 1 },
            skip: offset,
            limit: count,
        });
        const [customFields, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            customFields,
            count: customFields.length,
            offset,
            total,
        };
    });
}
function findCustomFieldById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ customFieldId, }) {
        return {
            customField: yield models_1.LivechatCustomField.findOneById(customFieldId),
        };
    });
}
function setCustomField(token_1, key_1, value_1) {
    return __awaiter(this, arguments, void 0, function* (token, key, value, overwrite = true) {
        const customField = yield models_1.LivechatCustomField.findOneById(key);
        if (customField) {
            if (customField.scope === 'room') {
                return models_1.LivechatRooms.updateDataByToken(token, key, value, overwrite);
            }
            return models_1.LivechatVisitors.updateLivechatDataByToken(token, key, value, overwrite);
        }
        return true;
    });
}
