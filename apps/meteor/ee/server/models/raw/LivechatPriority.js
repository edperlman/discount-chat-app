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
exports.LivechatPriorityRaw = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
// TODO need to define type for LivechatPriority object
class LivechatPriorityRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'livechat_priority');
    }
    modelIndexes() {
        return [
            {
                key: {
                    name: 1,
                },
                unique: true,
                partialFilterExpression: {
                    $and: [{ name: { $exists: true } }, { name: { $gt: '' } }],
                },
            },
        ];
    }
    findOneByIdOrName(_idOrName, options = {}) {
        const query = {
            $or: [
                {
                    _id: _idOrName,
                },
                {
                    name: _idOrName,
                },
            ],
        };
        return this.findOne(query, options);
    }
    findOneNameUsingRegex(_idOrName, options = {}) {
        const query = {
            name: new RegExp(`^${(0, string_helpers_1.escapeRegExp)(_idOrName.trim())}$`, 'i'),
        };
        return this.findOne(query, options);
    }
    findByDirty() {
        return this.find({ dirty: true }, { projection: { _id: 1 } });
    }
    canResetPriorities() {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.findOne({ dirty: true }, { projection: { _id: 1 } }));
        });
    }
    resetPriorities(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({ _id: { $in: ids } }, [{ $set: { dirty: false } }, { $unset: 'name' }]);
        });
    }
    updatePriority(_id, reset, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                _id,
            };
            const update = Object.assign({}, ((reset && {
                $set: { dirty: false },
                $unset: { name: 1 },
            }) || {
                // Trim value before inserting
                $set: { name: name === null || name === void 0 ? void 0 : name.trim(), dirty: true },
            }));
            return this.findOneAndUpdate(query, update, {
                returnDocument: 'after',
            });
        });
    }
}
exports.LivechatPriorityRaw = LivechatPriorityRaw;
