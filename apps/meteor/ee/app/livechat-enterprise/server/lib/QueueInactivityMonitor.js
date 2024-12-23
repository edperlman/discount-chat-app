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
exports.OmnichannelQueueInactivityMonitor = void 0;
const agenda_1 = require("@rocket.chat/agenda");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const logger_1 = require("./logger");
const LivechatTyped_1 = require("../../../../../app/livechat/server/lib/LivechatTyped");
const server_1 = require("../../../../../app/settings/server");
const i18n_1 = require("../../../../../server/lib/i18n");
const SCHEDULER_NAME = 'omnichannel_queue_inactivity_monitor';
class OmnichannelQueueInactivityMonitorClass {
    constructor() {
        this._db = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo.db;
        this.running = false;
        this._name = 'Omnichannel-Queue-Inactivity-Monitor';
        this.logger = logger_1.schedulerLogger.section(this._name);
        this.scheduler = new agenda_1.Agenda({
            mongo: mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo.client.db(),
            db: { collection: SCHEDULER_NAME },
            defaultConcurrency: 1,
            processEvery: process.env.TEST_MODE === 'true' ? '3 seconds' : '1 minute',
        });
        this.createIndex();
        const language = server_1.settings.get('Language') || 'en';
        this.message = i18n_1.i18n.t('Closed_automatically_chat_queued_too_long', { lng: language });
        this.bindedCloseRoom = this.closeRoom.bind(this);
    }
    getRocketCatUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findOneById('rocket.cat');
        });
    }
    getName(inquiryId) {
        return `${this._name}-${inquiryId}`;
    }
    createIndex() {
        void this._db.collection(SCHEDULER_NAME).createIndex({
            'data.inquiryId': 1,
        }, { unique: true });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running) {
                return;
            }
            yield this.scheduler.start();
            this.logger.info('Service started');
            this.running = true;
        });
    }
    scheduleInquiry(inquiryId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopInquiry(inquiryId);
            this.logger.debug(`Scheduling automatic close of inquiry ${inquiryId} at ${time}`);
            const name = this.getName(inquiryId);
            this.scheduler.define(name, this.bindedCloseRoom);
            const job = this.scheduler.create(name, { inquiryId });
            job.schedule(time);
            job.unique({ 'data.inquiryId': inquiryId });
            yield job.save();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running) {
                return;
            }
            yield this.scheduler.cancel({});
        });
    }
    stopInquiry(inquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = this.getName(inquiryId);
            yield this.scheduler.cancel({ name });
        });
    }
    closeRoomAction(room) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = this.message;
            return LivechatTyped_1.Livechat.closeRoom({
                comment,
                room,
                user: yield this.getRocketCatUser(),
            });
        });
    }
    closeRoom() {
        return __awaiter(this, arguments, void 0, function* ({ attrs: { data } } = {}) {
            const { inquiryId } = data;
            const inquiry = yield models_1.LivechatInquiry.findOneById(inquiryId);
            if (!inquiry || inquiry.status !== 'queued') {
                return;
            }
            const room = yield models_1.LivechatRooms.findOneById(inquiry.rid);
            if (!room) {
                this.logger.error(`Unable to find room ${inquiry.rid} for inquiry ${inquiryId} to close in queue inactivity monitor`);
                return;
            }
            yield Promise.all([this.closeRoomAction(room), this.stopInquiry(inquiryId)]);
            this.logger.info(`Closed room ${inquiry.rid} for inquiry ${inquiryId} due to inactivity`);
        });
    }
}
exports.OmnichannelQueueInactivityMonitor = new OmnichannelQueueInactivityMonitorClass();
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    void exports.OmnichannelQueueInactivityMonitor.start();
}));
