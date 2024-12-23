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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRealLogStorage = void 0;
const storage_1 = require("@rocket.chat/apps-engine/server/storage");
const instance_status_1 = require("@rocket.chat/instance-status");
class AppRealLogStorage extends storage_1.AppLogStorage {
    constructor(db) {
        super('mongodb');
        this.db = db;
    }
    find(query, _a) {
        return __awaiter(this, void 0, void 0, function* () {
            var { fields } = _a, options = __rest(_a, ["fields"]);
            return this.db.findPaginated(query, Object.assign({ projection: fields }, options)).cursor.toArray();
        });
    }
    storeEntries(logEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            logEntry.instanceId = instance_status_1.InstanceStatus.id();
            const id = (yield this.db.insertOne(logEntry)).insertedId;
            return this.db.findOneById(id);
        });
    }
    getEntriesFor(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.find({ appId }).toArray();
        });
    }
    removeEntriesFor(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.deleteOne({ appId });
        });
    }
}
exports.AppRealLogStorage = AppRealLogStorage;
