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
exports.PermissionsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class PermissionsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'permissions', trash);
    }
    modelIndexes() {
        return [
            {
                key: {
                    level: 1,
                    settingId: 1,
                },
            },
        ];
    }
    createOrUpdate(name, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.findOne({
                _id: name,
                roles,
            }, { projection: { _id: 1 } });
            if (exists) {
                return exists._id;
            }
            yield this.updateOne({ _id: name }, { $set: { roles } }, { upsert: true });
            return name;
        });
    }
    create(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.findOneById(id, { projection: { _id: 1 } });
            if (exists) {
                return exists._id;
            }
            yield this.updateOne({ _id: id }, { $set: { roles } }, { upsert: true });
            return id;
        });
    }
    addRole(permission, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: permission, roles: { $ne: role } }, { $addToSet: { roles: role } });
        });
    }
    setRoles(permission, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: permission }, { $set: { roles } });
        });
    }
    removeRole(permission, role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: permission, roles: role }, { $pull: { roles: role } });
        });
    }
    findByLevel(level, settingId) {
        return this.find(Object.assign({ level }, (settingId && { settingId })));
    }
}
exports.PermissionsRaw = PermissionsRaw;
