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
exports.LivechatCustomFieldRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class LivechatCustomFieldRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_custom_field', trash);
    }
    modelIndexes() {
        return [{ key: { scope: 1 } }];
    }
    findByScope(scope, options, includeHidden = true) {
        return this.find(Object.assign({ scope }, (includeHidden === true ? {} : { visibility: { $ne: 'hidden' } })), options);
    }
    findMatchingCustomFields(scope, searchable = true, options) {
        const query = {
            scope,
            searchable,
        };
        return this.find(query, options);
    }
    findMatchingCustomFieldsByIds(ids, scope, searchable = true, options) {
        const query = {
            _id: { $in: ids },
            scope,
            searchable,
        };
        return this.find(query, options);
    }
    createOrUpdateCustomField(_id, field, label, scope, visibility, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = Object.assign({ label,
                scope,
                visibility }, extraData);
            if (_id) {
                yield this.updateOne({ _id }, { $set: record });
            }
            else {
                record._id = field;
                yield this.insertOne(record);
            }
            return record;
        });
    }
    findByIdsAndScope(ids, scope, options) {
        return this.find({ _id: { $in: ids }, scope }, options);
    }
}
exports.LivechatCustomFieldRaw = LivechatCustomFieldRaw;
