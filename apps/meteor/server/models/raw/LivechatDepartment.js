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
exports.LivechatDepartmentRaw = void 0;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("./BaseRaw");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
class LivechatDepartmentRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_department', trash);
    }
    unfilteredFind(_query, _options) {
        throw new Error('Method not implemented.');
    }
    unfilteredFindOne(_query, _options) {
        throw new Error('Method not implemented.');
    }
    unfilteredUpdate(_query, _update, _options) {
        throw new Error('Method not implemented.');
    }
    unfilteredRemove(_query) {
        throw new Error('Method not implemented.');
    }
    removeParentAndAncestorById(_id) {
        throw new Error('Method not implemented.');
    }
    modelIndexes() {
        return [
            {
                key: {
                    name: 1,
                },
            },
            {
                key: {
                    businessHourId: 1,
                },
                sparse: true,
            },
            {
                key: {
                    type: 1,
                },
                sparse: true,
            },
            {
                key: {
                    numAgents: 1,
                    enabled: 1,
                },
            },
            {
                key: {
                    parentId: 1,
                },
                sparse: true,
            },
            {
                key: {
                    ancestors: 1,
                },
                sparse: true,
            },
            {
                key: {
                    archived: 1,
                },
                sparse: true,
            },
        ];
    }
    countTotal() {
        return this.col.countDocuments();
    }
    findInIds(departmentsIds, options) {
        const query = { _id: { $in: departmentsIds } };
        return this.find(query, options);
    }
    findByNameRegexWithExceptionsAndConditions(searchTerm, exceptions = [], conditions = {}, options = {}) {
        if (!Array.isArray(exceptions)) {
            exceptions = [exceptions];
        }
        const nameRegex = new RegExp(`^${(0, string_helpers_1.escapeRegExp)(searchTerm).trim()}`, 'i');
        const query = Object.assign({ name: nameRegex, _id: {
                $nin: exceptions,
            } }, conditions);
        return this.find(query, options);
    }
    findByBusinessHourId(businessHourId, options) {
        const query = { businessHourId };
        return this.find(query, options);
    }
    countByBusinessHourIdExcludingDepartmentId(businessHourId, departmentId) {
        const query = { businessHourId, _id: { $ne: departmentId } };
        return this.col.countDocuments(query);
    }
    findEnabledByBusinessHourId(businessHourId, options) {
        const query = { businessHourId, enabled: true };
        return this.find(query, options);
    }
    findActiveDepartmentsWithoutBusinessHour(options) {
        const query = {
            enabled: true,
            businessHourId: { $exists: false },
        };
        return this.find(query, options);
    }
    findEnabledByListOfBusinessHourIdsAndDepartmentIds(businessHourIds, departmentIds, options) {
        const query = {
            enabled: true,
            businessHourId: {
                $in: businessHourIds,
            },
            _id: {
                $in: departmentIds,
            },
        };
        return this.find(query, options);
    }
    findEnabledInIds(departmentsIds, options) {
        const query = { _id: { $in: departmentsIds }, enabled: true };
        return this.find(query, options);
    }
    addBusinessHourToDepartmentsByIds(ids = [], businessHourId) {
        const query = {
            _id: { $in: ids },
        };
        const update = {
            $set: {
                businessHourId,
            },
        };
        return this.updateMany(query, update);
    }
    removeBusinessHourFromDepartmentsByIdsAndBusinessHourId(ids = [], businessHourId) {
        const query = {
            _id: { $in: ids },
            businessHourId,
        };
        const update = {
            $unset: {
                businessHourId: 1,
            },
        };
        return this.updateMany(query, update);
    }
    removeBusinessHourFromDepartmentsByBusinessHourId(businessHourId) {
        const query = {
            businessHourId,
        };
        const update = {
            $unset: {
                businessHourId: 1,
            },
        };
        return this.updateMany(query, update);
    }
    unarchiveDepartment(_id) {
        return this.updateOne({ _id }, { $set: { archived: false } });
    }
    archiveDepartment(_id) {
        return this.updateOne({ _id }, { $set: { archived: true, enabled: false } });
    }
    addDepartmentToUnit(_id, unitId, ancestors) {
        return this.updateOne({ _id }, { $set: { parentId: unitId, ancestors } });
    }
    removeDepartmentFromUnit(_id) {
        return this.updateOne({ _id }, { $set: { parentId: null, ancestors: null } });
    }
    createOrUpdateDepartment(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = _id ? yield this.findOneById(_id) : null;
            const record = Object.assign({}, data);
            if (_id) {
                yield this.updateOne({ _id }, { $set: record });
            }
            else {
                _id = (yield this.insertOne(record)).insertedId;
            }
            if ((current === null || current === void 0 ? void 0 : current.enabled) !== data.enabled) {
                yield models_1.LivechatDepartmentAgents.setDepartmentEnabledByDepartmentId(_id, data.enabled);
                void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChangedByDepartmentId)(_id, current ? 'updated' : 'inserted');
            }
            const latestDept = yield this.findOneById(_id);
            if (!latestDept) {
                throw new Error(`Department ${_id} not found`);
            }
            return latestDept;
        });
    }
    unsetFallbackDepartmentByDepartmentId(departmentId) {
        return this.updateMany({ fallbackDepartment: departmentId }, { $unset: { fallbackDepartment: 1 } });
    }
    removeDepartmentFromForwardListById(_departmentId) {
        throw new Error('Method not implemented in Community Edition.');
    }
    updateById(_id, update) {
        return this.updateOne({ _id }, update);
    }
    updateNumAgentsById(_id, numAgents) {
        return this.updateOne({ _id }, { $set: { numAgents } });
    }
    decreaseNumberOfAgentsByIds(_ids) {
        return this.updateMany({ _id: { $in: _ids } }, { $inc: { numAgents: -1 } });
    }
    findEnabledWithAgents(projection = {}) {
        const query = {
            numAgents: { $gt: 0 },
            enabled: true,
        };
        return this.find(query, projection && { projection });
    }
    findEnabledWithAgentsAndBusinessUnit(_1) {
        return __awaiter(this, arguments, void 0, function* (_, projection = {}) {
            const query = {
                numAgents: { $gt: 0 },
                enabled: true,
            };
            return this.find(query, projection && { projection });
        });
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
    findByUnitIds(unitIds, options = {}) {
        const query = {
            parentId: {
                $exists: true,
                $in: unitIds,
            },
        };
        return this.find(query, options);
    }
    countDepartmentsInUnit(unitId) {
        return this.countDocuments({ parentId: unitId });
    }
    findActiveByUnitIds(unitIds, options = {}) {
        const query = {
            enabled: true,
            numAgents: { $gt: 0 },
            parentId: {
                $exists: true,
                $in: unitIds,
            },
        };
        return this.find(query, options);
    }
    findNotArchived(options = {}) {
        const query = { archived: { $ne: false } };
        return this.find(query, options);
    }
    getBusinessHoursWithDepartmentStatuses() {
        return this.col
            .aggregate([
            {
                $match: {
                    businessHourId: {
                        $exists: true,
                    },
                },
            },
            {
                $group: {
                    _id: '$businessHourId',
                    validDepartments: {
                        $push: {
                            $cond: {
                                if: {
                                    $or: [
                                        {
                                            $eq: ['$enabled', true],
                                        },
                                        {
                                            $ne: ['$archived', true],
                                        },
                                    ],
                                },
                                then: '$_id',
                                else: '$$REMOVE',
                            },
                        },
                    },
                    invalidDepartments: {
                        $push: {
                            $cond: {
                                if: {
                                    $or: [{ $eq: ['$enabled', false] }, { $eq: ['$archived', true] }],
                                },
                                then: '$_id',
                                else: '$$REMOVE',
                            },
                        },
                    },
                },
            },
        ])
            .toArray();
    }
    checkIfMonitorIsMonitoringDepartmentById(monitorId, departmentId) {
        const aggregation = [
            {
                $match: {
                    enabled: true,
                    _id: departmentId,
                },
            },
            {
                $lookup: {
                    from: models_1.LivechatUnitMonitors.getCollectionName(),
                    localField: 'parentId',
                    foreignField: 'unitId',
                    as: 'monitors',
                    pipeline: [
                        {
                            $match: {
                                monitorId,
                            },
                        },
                    ],
                },
            },
            {
                $match: {
                    monitors: {
                        $exists: true,
                        $ne: [],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                },
            },
        ];
        return this.col.aggregate(aggregation).hasNext();
    }
    countArchived() {
        return this.col.countDocuments({ archived: true });
    }
    findByParentId(_parentId, _options) {
        throw new Error('Method not implemented in CE');
    }
    findAgentsByBusinessHourId(_businessHourId) {
        throw new Error('Method not implemented in CE');
    }
}
exports.LivechatDepartmentRaw = LivechatDepartmentRaw;
