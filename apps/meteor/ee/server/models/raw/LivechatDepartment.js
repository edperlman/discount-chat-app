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
exports.LivechatDepartmentEE = void 0;
const models_1 = require("@rocket.chat/models");
const LivechatDepartment_1 = require("../../../../server/models/raw/LivechatDepartment");
class LivechatDepartmentEE extends LivechatDepartment_1.LivechatDepartmentRaw {
    constructor(db, trash) {
        super(db, trash);
    }
    removeDepartmentFromForwardListById(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateMany({ departmentsAllowedToForward: departmentId }, { $pull: { departmentsAllowedToForward: departmentId } });
        });
    }
    unfilteredFind(query, options) {
        return this.col.find(query, options);
    }
    unfilteredFindOne(query, options) {
        return this.col.findOne(query, options);
    }
    unfilteredUpdate(query, update, options) {
        return this.col.updateOne(query, update, options);
    }
    unfilteredRemove(query) {
        return this.col.deleteOne(query);
    }
    createOrUpdateDepartment(_id, data) {
        return super.createOrUpdateDepartment(_id, Object.assign(Object.assign({}, data), { type: 'd' }));
    }
    removeParentAndAncestorById(id) {
        return this.updateMany({ parentId: id }, { $unset: { parentId: 1 }, $pull: { ancestors: id } });
    }
    findEnabledWithAgentsAndBusinessUnit(businessUnit, projection) {
        const _super = Object.create(null, {
            findEnabledWithAgents: { get: () => super.findEnabledWithAgents },
            findActiveByUnitIds: { get: () => super.findActiveByUnitIds }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!businessUnit) {
                return _super.findEnabledWithAgents.call(this, projection);
            }
            const unit = yield models_1.LivechatUnit.findOneById(businessUnit, { projection: { _id: 1 } });
            if (!unit) {
                throw new Meteor.Error('error-unit-not-found', `Error! No Active Business Unit found with id: ${businessUnit}`);
            }
            return _super.findActiveByUnitIds.call(this, [businessUnit], { projection });
        });
    }
    findByParentId(parentId, options) {
        return this.col.find({ parentId }, options);
    }
    findAgentsByBusinessHourId(businessHourId) {
        return this.col.aggregate([
            [
                {
                    $match: {
                        businessHourId,
                    },
                },
                {
                    $lookup: {
                        from: 'rocketchat_livechat_department_agents',
                        localField: '_id',
                        foreignField: 'departmentId',
                        as: 'agents',
                    },
                },
                {
                    $unwind: '$agents',
                },
                {
                    $group: {
                        _id: null,
                        agentIds: {
                            $addToSet: '$agents.agentId',
                        },
                    },
                },
            ],
        ]);
    }
}
exports.LivechatDepartmentEE = LivechatDepartmentEE;
