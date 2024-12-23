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
exports.LivechatEnterprise = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const Helper_1 = require("./Helper");
const SlaHelper_1 = require("./SlaHelper");
const callbacks_1 = require("../../../../../lib/callbacks");
const addUserRoles_1 = require("../../../../../server/lib/roles/addUserRoles");
const removeUserFromRoles_1 = require("../../../../../server/lib/roles/removeUserFromRoles");
exports.LivechatEnterprise = {
    addMonitor(username) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(username, String);
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1, username: 1 } });
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'livechat:addMonitor',
                });
            }
            if (yield (0, addUserRoles_1.addUserRolesAsync)(user._id, ['livechat-monitor'])) {
                return user;
            }
            return false;
        });
    },
    removeMonitor(username) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(username, String);
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1 } });
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'livechat:removeMonitor',
                });
            }
            const removeRoleResult = yield (0, removeUserFromRoles_1.removeUserFromRolesAsync)(user._id, ['livechat-monitor']);
            if (!removeRoleResult) {
                return false;
            }
            // remove this monitor from any unit it is assigned to
            yield models_1.LivechatUnitMonitors.removeByMonitorId(user._id);
            return true;
        });
    },
    removeUnit(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(_id, String);
            const unit = yield models_1.LivechatUnit.findOneById(_id, { projection: { _id: 1 } });
            if (!unit) {
                throw new meteor_1.Meteor.Error('unit-not-found', 'Unit not found', { method: 'livechat:removeUnit' });
            }
            return models_1.LivechatUnit.removeById(_id);
        });
    },
    saveUnit(_id, unitData, unitMonitors, unitDepartments) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(_id, check_1.Match.Maybe(String));
            (0, check_1.check)(unitData, {
                name: String,
                visibility: String,
                enabled: check_1.Match.Optional(Boolean),
                description: check_1.Match.Optional(String),
                email: check_1.Match.Optional(String),
                showOnOfflineForm: check_1.Match.Optional(Boolean),
            });
            (0, check_1.check)(unitMonitors, [
                check_1.Match.ObjectIncluding({
                    monitorId: String,
                    username: String,
                }),
            ]);
            (0, check_1.check)(unitDepartments, [
                check_1.Match.ObjectIncluding({
                    departmentId: String,
                }),
            ]);
            let ancestors = [];
            if (_id) {
                const unit = yield models_1.LivechatUnit.findOneById(_id);
                if (!unit) {
                    throw new meteor_1.Meteor.Error('error-unit-not-found', 'Unit not found', {
                        method: 'livechat:saveUnit',
                    });
                }
                ancestors = unit.ancestors || [];
            }
            const validUserMonitors = yield models_1.Users.findUsersInRolesWithQuery('livechat-monitor', { _id: { $in: unitMonitors.map(({ monitorId }) => monitorId) } }, { projection: { _id: 1, username: 1 } }).toArray();
            const monitors = validUserMonitors.map(({ _id: monitorId, username }) => ({
                monitorId,
                username,
            }));
            return models_1.LivechatUnit.createOrUpdateUnit(_id, unitData, ancestors, monitors, unitDepartments);
        });
    },
    removeTag(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(_id, String);
            const tag = yield models_1.LivechatTag.findOneById(_id, { projection: { _id: 1, name: 1 } });
            if (!tag) {
                throw new meteor_1.Meteor.Error('tag-not-found', 'Tag not found', { method: 'livechat:removeTag' });
            }
            yield callbacks_1.callbacks.run('livechat.afterTagRemoved', tag);
            return models_1.LivechatTag.removeById(_id);
        });
    },
    saveTag(_id, tagData, tagDepartments) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(_id, check_1.Match.Maybe(String));
            (0, check_1.check)(tagData, {
                name: String,
                description: check_1.Match.Optional(String),
            });
            (0, check_1.check)(tagDepartments, [String]);
            return models_1.LivechatTag.createOrUpdateTag(_id, tagData, tagDepartments);
        });
    },
    saveSLA(_id, slaData) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldSLA = _id && (yield models_1.OmnichannelServiceLevelAgreements.findOneById(_id, { projection: { dueTimeInMinutes: 1 } }));
            const exists = yield models_1.OmnichannelServiceLevelAgreements.findDuplicate(_id, slaData.name, slaData.dueTimeInMinutes);
            if (exists) {
                throw new Error('error-duplicated-sla');
            }
            const sla = yield models_1.OmnichannelServiceLevelAgreements.createOrUpdatePriority(slaData, _id);
            if (!oldSLA) {
                return sla;
            }
            const { dueTimeInMinutes: oldDueTimeInMinutes } = oldSLA;
            const { dueTimeInMinutes } = sla;
            if (oldDueTimeInMinutes !== dueTimeInMinutes) {
                yield (0, Helper_1.updateSLAInquiries)(sla);
            }
            return sla;
        });
    },
    removeSLA(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sla = yield models_1.OmnichannelServiceLevelAgreements.findOneById(_id, { projection: { _id: 1 } });
            if (!sla) {
                throw new Error(`SLA with id ${_id} not found`);
            }
            const removedResult = yield models_1.OmnichannelServiceLevelAgreements.removeById(_id);
            if (!removedResult || removedResult.deletedCount !== 1) {
                throw new Error(`Error removing SLA with id ${_id}`);
            }
            yield (0, SlaHelper_1.removeSLAFromRooms)(_id);
        });
    },
};
