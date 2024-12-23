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
exports.SettingsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class SettingsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'settings', trash);
    }
    getValueById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.findOne({ _id }, { projection: { value: 1 } });
            return setting === null || setting === void 0 ? void 0 : setting.value;
        });
    }
    findNotHidden({ updatedAfter } = {}) {
        const query = {
            hidden: { $ne: true },
        };
        if (updatedAfter) {
            query._updatedAt = { $gt: updatedAfter };
        }
        return this.find(query);
    }
    findOneNotHiddenById(_id) {
        const query = {
            _id,
            hidden: { $ne: true },
        };
        return this.findOne(query);
    }
    findByIds(_id = [], options) {
        if (typeof _id === 'string') {
            _id = [_id];
        }
        const query = {
            _id: {
                $in: _id,
            },
        };
        return this.find(query, options);
    }
    updateValueById(_id, value, options) {
        const query = {
            blocked: { $ne: true },
            value: { $ne: value },
            _id,
        };
        const update = {
            $set: {
                value,
            },
        };
        return this.updateOne(query, update, options);
    }
    resetValueById(_id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value == null) {
                const record = yield this.findOneById(_id);
                if (record) {
                    const prop = record.valueSource || 'packageValue';
                    value = record[prop];
                }
            }
            if (value == null) {
                return;
            }
            return this.updateValueById(_id, value);
        });
    }
    incrementValueById(_id, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOneAndUpdate({
                blocked: { $ne: true },
                _id,
            }, {
                $inc: {
                    value: value || 1,
                },
            }, options);
        });
    }
    updateOptionsById(_id, options) {
        const query = {
            blocked: { $ne: true },
            _id,
        };
        const update = { $set: options };
        return this.updateOne(query, update);
    }
    updateValueNotHiddenById(_id, value) {
        const query = {
            _id,
            hidden: { $ne: true },
            blocked: { $ne: true },
        };
        const update = {
            $set: {
                value,
            },
        };
        return this.updateOne(query, update);
    }
    updateValueAndEditorById(_id, value, editor) {
        const query = {
            blocked: { $ne: true },
            value: { $ne: value },
            _id,
        };
        const update = {
            $set: {
                value,
                editor,
            },
        };
        return this.updateOne(query, update);
    }
    findNotHiddenPublic(ids = []) {
        const filter = {
            hidden: { $ne: true },
            public: true,
        };
        if (ids.length > 0) {
            filter._id = { $in: ids };
        }
        return this.find(filter, {
            projection: {
                _id: 1,
                value: 1,
                editor: 1,
                enterprise: 1,
                invalidValue: 1,
                modules: 1,
                requiredOnWizard: 1,
            },
        });
    }
    findSetupWizardSettings() {
        return this.find({ wizard: { $exists: true } });
    }
    addOptionValueById(_id, option) {
        const query = {
            blocked: { $ne: true },
            _id,
        };
        const { key, i18nLabel } = option;
        const update = {
            $addToSet: {
                values: {
                    key,
                    i18nLabel,
                },
            },
        };
        return this.updateOne(query, update);
    }
    findNotHiddenPublicUpdatedAfter(updatedAt) {
        const filter = {
            hidden: { $ne: true },
            public: true,
            _updatedAt: {
                $gt: updatedAt,
            },
        };
        return this.find(filter, {
            projection: {
                _id: 1,
                value: 1,
                editor: 1,
                enterprise: 1,
                invalidValue: 1,
                modules: 1,
                requiredOnWizard: 1,
            },
        });
    }
    findEnterpriseSettings() {
        return this.find({ enterprise: true });
    }
}
exports.SettingsRaw = SettingsRaw;
