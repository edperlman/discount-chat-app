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
exports.SingleBusinessHourBehavior = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const AbstractBusinessHour_1 = require("./AbstractBusinessHour");
const Helper_1 = require("./Helper");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const logger_1 = require("../lib/logger");
class SingleBusinessHourBehavior extends AbstractBusinessHour_1.AbstractBusinessHourBehavior {
    openBusinessHoursByDayAndHour() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Helper_1.openBusinessHourDefault)();
        });
    }
    closeBusinessHoursByDayAndHour(day, hour) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHoursIds = (yield this.BusinessHourRepository.findActiveBusinessHoursToClose(day, hour, core_typings_1.LivechatBusinessHourTypes.DEFAULT, {
                projection: { _id: 1 },
            })).map((businessHour) => businessHour._id);
            yield this.UsersRepository.closeAgentsBusinessHoursByBusinessHourIds(businessHoursIds);
            yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
        });
    }
    onStartBusinessHours() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, Helper_1.openBusinessHourDefault)();
        });
    }
    onNewAgentCreated(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultBusinessHour = yield models_1.LivechatBusinessHours.findOneDefaultBusinessHour();
            if (!defaultBusinessHour) {
                logger_1.businessHourLogger.debug('No default business hour found for agentId', {
                    agentId,
                });
                return;
            }
            const businessHourToOpen = yield (0, Helper_1.filterBusinessHoursThatMustBeOpened)([defaultBusinessHour]);
            if (!businessHourToOpen.length) {
                logger_1.businessHourLogger.debug({
                    msg: 'No business hours found. Moving agent to NOT_AVAILABLE status',
                    agentId,
                    newStatus: core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE,
                });
                const { modifiedCount } = yield models_1.Users.setLivechatStatus(agentId, core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
                if (modifiedCount > 0) {
                    void (0, notifyListener_1.notifyOnUserChange)({
                        id: agentId,
                        clientAction: 'updated',
                        diff: {
                            statusLivechat: core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE,
                            livechatStatusSystemModified: false,
                        },
                    });
                }
                return;
            }
            yield models_1.Users.addBusinessHourByAgentIds([agentId], defaultBusinessHour._id);
            logger_1.businessHourLogger.debug({
                msg: 'Business hours found. Moving agent to AVAILABLE status',
                agentId,
                newStatus: core_typings_1.ILivechatAgentStatus.AVAILABLE,
            });
        });
    }
    afterSaveBusinessHours() {
        return (0, Helper_1.openBusinessHourDefault)();
    }
    removeBusinessHourById() {
        return Promise.resolve();
    }
    onAddAgentToDepartment() {
        return Promise.resolve();
    }
    onRemoveAgentFromDepartment() {
        return Promise.resolve();
    }
    onRemoveDepartment() {
        return Promise.resolve();
    }
    onDepartmentDisabled() {
        return Promise.resolve();
    }
    onDepartmentArchived() {
        return Promise.resolve();
    }
}
exports.SingleBusinessHourBehavior = SingleBusinessHourBehavior;
