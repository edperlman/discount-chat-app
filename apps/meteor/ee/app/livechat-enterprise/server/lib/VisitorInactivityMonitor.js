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
exports.VisitorInactivityMonitor = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const logger_1 = require("./logger");
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
const LivechatTyped_1 = require("../../../../../app/livechat/server/lib/LivechatTyped");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
const isPromiseRejectedResult = (result) => result && result.status === 'rejected';
class VisitorInactivityMonitor {
    constructor() {
        this.scheduler = cron_1.cronJobs;
        this._started = false;
        this._name = 'Omnichannel Visitor Inactivity Monitor';
        this.messageCache = new Map();
        this.logger = logger_1.schedulerLogger.section(this._name);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._startMonitoring();
            this._initializeMessageCache();
            const cat = yield models_1.Users.findOneById('rocket.cat');
            if (cat) {
                this.user = cat;
            }
        });
    }
    _startMonitoring() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning()) {
                this.logger.debug('Already running');
                return;
            }
            const everyMinute = '* * * * *';
            yield this.scheduler.add(this._name, everyMinute, () => __awaiter(this, void 0, void 0, function* () { return this.handleAbandonedRooms(); }));
            this._started = true;
            this.logger.info('Service started');
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning()) {
                return;
            }
            yield this.scheduler.remove(this._name);
            this._started = false;
            this.logger.info('Service stopped');
        });
    }
    isRunning() {
        return this._started;
    }
    _initializeMessageCache() {
        this.messageCache.clear();
    }
    _getDepartmentAbandonedCustomMessage(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.messageCache.has(departmentId)) {
                return this.messageCache.get(departmentId);
            }
            const department = yield models_1.LivechatDepartment.findOneById(departmentId, { projection: { _id: 1, abandonedRoomsCloseCustomMessage: 1 } });
            if (!department) {
                this.logger.error(`Department ${departmentId} not found`);
                return;
            }
            this.messageCache.set(department._id, department.abandonedRoomsCloseCustomMessage);
            return department.abandonedRoomsCloseCustomMessage;
        });
    }
    closeRooms(room) {
        return __awaiter(this, void 0, void 0, function* () {
            let comment = yield this.getDefaultAbandonedCustomMessage('close', room.v._id);
            if (room.departmentId) {
                comment = (yield this._getDepartmentAbandonedCustomMessage(room.departmentId)) || comment;
            }
            yield LivechatTyped_1.Livechat.closeRoom({
                comment,
                room,
                user: this.user,
            });
            void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
            this.logger.info(`Room ${room._id} closed`);
        });
    }
    placeRoomOnHold(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.getDefaultAbandonedCustomMessage('on-hold', room.v._id);
            const result = yield Promise.allSettled([
                core_services_1.OmnichannelEEService.placeRoomOnHold(room, comment, this.user),
                models_1.LivechatRooms.unsetPredictedVisitorAbandonmentByRoomId(room._id),
            ]);
            const rejected = result.filter(isPromiseRejectedResult).map((r) => r.reason);
            if (rejected.length) {
                this.logger.error({ msg: 'Error placing room on hold', error: rejected });
                throw new Error('Error placing room on hold. Please check logs for more details.');
            }
            void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
        });
    }
    handleAbandonedRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const action = server_1.settings.get('Livechat_abandoned_rooms_action');
            if (!action || action === 'none') {
                return;
            }
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
            const promises = [];
            yield models_1.LivechatRooms.findAbandonedOpenRooms(new Date(), extraQuery).forEach((room) => {
                switch (action) {
                    case 'close': {
                        this.logger.info(`Closing room ${room._id}`);
                        promises.push(this.closeRooms(room));
                        break;
                    }
                    case 'on-hold': {
                        this.logger.info(`Placing room ${room._id} on hold`);
                        promises.push(this.placeRoomOnHold(room));
                        break;
                    }
                }
            });
            const result = yield Promise.allSettled(promises);
            const errors = result.filter(isPromiseRejectedResult).map((r) => r.reason);
            if (errors.length) {
                this.logger.error({ msg: `Error while removing priority from ${errors.length} rooms`, reason: errors[0] });
            }
            this._initializeMessageCache();
        });
    }
    getDefaultAbandonedCustomMessage(abandonmentAction, visitorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield models_1.LivechatVisitors.findOneEnabledById(visitorId, {
                projection: {
                    name: 1,
                    username: 1,
                },
            });
            if (!visitor) {
                this.logger.error({
                    msg: 'Error getting default abandoned custom message: visitor not found',
                    visitorId,
                });
                throw new Error('error-invalid_visitor');
            }
            const timeout = server_1.settings.get('Livechat_visitor_inactivity_timeout');
            const guest = visitor.name || visitor.username;
            if (abandonmentAction === 'on-hold') {
                return i18n_1.i18n.t('Omnichannel_On_Hold_due_to_inactivity', {
                    guest,
                    timeout,
                });
            }
            return (server_1.settings.get('Livechat_abandoned_rooms_closed_custom_message') ||
                i18n_1.i18n.t('Omnichannel_chat_closed_due_to_inactivity', {
                    guest,
                    timeout,
                }));
        });
    }
}
exports.VisitorInactivityMonitor = VisitorInactivityMonitor;
