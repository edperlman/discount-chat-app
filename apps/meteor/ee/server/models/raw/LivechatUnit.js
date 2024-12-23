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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatUnitRaw = void 0;
const models_1 = require("@rocket.chat/models");
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
const units_1 = require("../../../app/livechat-enterprise/server/lib/units");
const addQueryRestrictions = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (originalQuery = {}) {
    const query = Object.assign(Object.assign({}, originalQuery), { type: 'u' });
    const units = yield (0, units_1.getUnitsFromUser)();
    if (Array.isArray(units)) {
        const expressions = query.$and || [];
        const condition = { $or: [{ ancestors: { $in: units } }, { _id: { $in: units } }] };
        query.$and = [condition, ...expressions];
    }
    return query;
});
// We don't actually need Units to extends from Departments
class LivechatUnitRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'livechat_department');
    }
    findPaginatedUnits(query, options) {
        return super.findPaginated(Object.assign(Object.assign({}, query), { type: 'u' }), options);
    }
    // @ts-expect-error - Overriding base types :)
    find(originalQuery, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield addQueryRestrictions(originalQuery);
            return this.col.find(query, options);
        });
    }
    // @ts-expect-error - Overriding base types :)
    findOne(originalQuery, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield addQueryRestrictions(originalQuery);
            return this.col.findOne(query, options);
        });
    }
    remove(query) {
        return this.deleteMany(query);
    }
    createOrUpdateUnit(_id_1, _a, ancestors_1, monitors_1, departments_1) {
        return __awaiter(this, arguments, void 0, function* (_id, { name, visibility }, ancestors, monitors, departments) {
            var _b, monitors_2, monitors_2_1;
            var _c, e_1, _d, _e, _f, e_2, _g, _h, _j, e_3, _k, _l, _m, e_4, _o, _p;
            monitors = [].concat(monitors || []);
            ancestors = [].concat(ancestors || []);
            const record = {
                name,
                visibility,
                type: 'u',
                numMonitors: monitors.length,
                numDepartments: departments.length,
            };
            if (_id) {
                yield this.updateOne({ _id }, { $set: record });
            }
            else {
                _id = (yield this.insertOne(record)).insertedId;
            }
            if (!_id) {
                throw new Error('Error creating/updating unit');
            }
            ancestors.splice(0, 0, _id);
            const savedMonitors = (yield models_1.LivechatUnitMonitors.findByUnitId(_id).toArray()).map(({ monitorId }) => monitorId);
            const monitorsToSave = monitors.map(({ monitorId }) => monitorId);
            try {
                // remove other monitors
                for (var _q = true, savedMonitors_1 = __asyncValues(savedMonitors), savedMonitors_1_1; savedMonitors_1_1 = yield savedMonitors_1.next(), _c = savedMonitors_1_1.done, !_c; _q = true) {
                    _e = savedMonitors_1_1.value;
                    _q = false;
                    const monitorId = _e;
                    if (!monitorsToSave.includes(monitorId)) {
                        yield models_1.LivechatUnitMonitors.removeByUnitIdAndMonitorId(_id, monitorId);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_q && !_c && (_d = savedMonitors_1.return)) yield _d.call(savedMonitors_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (_b = true, monitors_2 = __asyncValues(monitors); monitors_2_1 = yield monitors_2.next(), _f = monitors_2_1.done, !_f; _b = true) {
                    _h = monitors_2_1.value;
                    _b = false;
                    const monitor = _h;
                    yield models_1.LivechatUnitMonitors.saveMonitor({
                        monitorId: monitor.monitorId,
                        unitId: _id,
                        username: monitor.username,
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_b && !_f && (_g = monitors_2.return)) yield _g.call(monitors_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            const savedDepartments = (yield models_1.LivechatDepartment.findByParentId(_id, { projection: { _id: 1 } }).toArray()).map(({ _id }) => _id);
            const departmentsToSave = departments.map(({ departmentId }) => departmentId);
            try {
                // remove other departments
                for (var _r = true, savedDepartments_1 = __asyncValues(savedDepartments), savedDepartments_1_1; savedDepartments_1_1 = yield savedDepartments_1.next(), _j = savedDepartments_1_1.done, !_j; _r = true) {
                    _l = savedDepartments_1_1.value;
                    _r = false;
                    const departmentId = _l;
                    if (!departmentsToSave.includes(departmentId)) {
                        yield models_1.LivechatDepartment.removeDepartmentFromUnit(departmentId);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_r && !_j && (_k = savedDepartments_1.return)) yield _k.call(savedDepartments_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _s = true, departmentsToSave_1 = __asyncValues(departmentsToSave), departmentsToSave_1_1; departmentsToSave_1_1 = yield departmentsToSave_1.next(), _m = departmentsToSave_1_1.done, !_m; _s = true) {
                    _p = departmentsToSave_1_1.value;
                    _s = false;
                    const departmentId = _p;
                    yield models_1.LivechatDepartment.addDepartmentToUnit(departmentId, _id, ancestors);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_s && !_m && (_o = departmentsToSave_1.return)) yield _o.call(departmentsToSave_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            yield models_1.LivechatRooms.associateRoomsWithDepartmentToUnit(departmentsToSave, _id);
            return Object.assign(Object.assign({}, record), { _id });
        });
    }
    removeParentAndAncestorById(parentId) {
        const query = {
            parentId,
        };
        const update = {
            $unset: { parentId: 1 },
            $pull: { ancestors: parentId },
        };
        return this.updateMany(query, update);
    }
    incrementDepartmentsCount(_id) {
        return this.updateOne({ _id }, { $inc: { numDepartments: 1 } });
    }
    decrementDepartmentsCount(_id) {
        return this.updateOne({ _id }, { $inc: { numDepartments: -1 } });
    }
    removeById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.LivechatUnitMonitors.removeByUnitId(_id);
            yield this.removeParentAndAncestorById(_id);
            yield models_1.LivechatRooms.removeUnitAssociationFromRooms(_id);
            const query = { _id };
            return this.deleteOne(query);
        });
    }
    findOneByIdOrName(_idOrName, options) {
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
    findByMonitorId(monitorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const monitoredUnits = yield models_1.LivechatUnitMonitors.findByMonitorId(monitorId).toArray();
            if (monitoredUnits.length === 0) {
                return [];
            }
            return monitoredUnits.map((u) => u.unitId);
        });
    }
    findMonitoredDepartmentsByMonitorId(monitorId, includeDisabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const monitoredUnits = yield this.findByMonitorId(monitorId);
            if (includeDisabled) {
                return models_1.LivechatDepartment.findByUnitIds(monitoredUnits, {}).toArray();
            }
            return models_1.LivechatDepartment.findActiveByUnitIds(monitoredUnits, {}).toArray();
        });
    }
    countUnits() {
        return this.col.countDocuments({ type: 'u' });
    }
}
exports.LivechatUnitRaw = LivechatUnitRaw;
