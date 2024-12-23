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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLivechatQueueInfo = exports.getLivechatCustomFields = exports.updateSLAInquiries = exports.updateQueueInactivityTimeout = exports.updatePredictedVisitorAbandonment = exports.setPredictedVisitorAbandonmentTime = exports.debouncedDispatchWaitingQueueStatus = exports.dispatchInquiryPosition = exports.getMaxNumberSimultaneousChat = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const QueueInactivityMonitor_1 = require("./QueueInactivityMonitor");
const SlaHelper_1 = require("./SlaHelper");
const debounceByParams_1 = require("./debounceByParams");
const logger_1 = require("./logger");
const settings_1 = require("../../../../../app/livechat/server/lib/settings");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const getMaxNumberSimultaneousChat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ agentId, departmentId }) {
    if (departmentId) {
        const department = yield models_1.LivechatDepartment.findOneById(departmentId);
        const { maxNumberSimultaneousChat = 0 } = department || { maxNumberSimultaneousChat: 0 };
        if (maxNumberSimultaneousChat > 0) {
            return maxNumberSimultaneousChat;
        }
    }
    if (agentId) {
        const user = yield models_1.Users.getAgentInfo(agentId, server_1.settings.get('Livechat_show_agent_info'));
        const { livechat: { maxNumberSimultaneousChat = 0 } = {} } = user || {};
        if (maxNumberSimultaneousChat > 0) {
            return maxNumberSimultaneousChat;
        }
    }
    return server_1.settings.get('Livechat_maximum_chats_per_agent');
});
exports.getMaxNumberSimultaneousChat = getMaxNumberSimultaneousChat;
const getWaitingQueueMessage = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const department = departmentId ? yield models_1.LivechatDepartment.findOneById(departmentId) : null;
    if (department === null || department === void 0 ? void 0 : department.waitingQueueMessage) {
        return department.waitingQueueMessage;
    }
    return server_1.settings.get('Livechat_waiting_queue_message');
});
const getQueueInfo = (department) => __awaiter(void 0, void 0, void 0, function* () {
    const numberMostRecentChats = server_1.settings.get('Livechat_number_most_recent_chats_estimate_wait_time');
    const statistics = yield models_1.Rooms.getMostRecentAverageChatDurationTime(numberMostRecentChats, department);
    const text = yield getWaitingQueueMessage(department);
    const message = {
        text,
        user: { _id: 'rocket.cat', username: 'rocket.cat' },
    };
    return { message, statistics, numberMostRecentChats };
});
const getSpotEstimatedWaitTime = (spot, maxNumberSimultaneousChat, avgChatDuration) => {
    if (!maxNumberSimultaneousChat || !avgChatDuration) {
        return;
    }
    // X = spot
    // N = maxNumberSimultaneousChat
    // Estimated Wait Time = ([(N-1)/X]+1) *Average Chat Time of Most Recent X(Default = 100) Chats
    return ((spot - 1) / maxNumberSimultaneousChat + 1) * avgChatDuration;
};
const normalizeQueueInfo = (_a) => __awaiter(void 0, [_a], void 0, function* ({ position, queueInfo, department, }) {
    if (!queueInfo) {
        queueInfo = yield getQueueInfo(department);
    }
    const { message, numberMostRecentChats, statistics: { avgChatDuration } = {} } = queueInfo;
    const spot = position + 1;
    const estimatedWaitTimeSeconds = getSpotEstimatedWaitTime(spot, numberMostRecentChats, avgChatDuration);
    return { spot, message, estimatedWaitTimeSeconds };
});
const dispatchInquiryPosition = (inquiry, queueInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { position, department } = inquiry;
    // Avoid broadcasting if no position was determined
    if (position === undefined) {
        return;
    }
    const data = yield normalizeQueueInfo({ position, queueInfo, department });
    return setTimeout(() => {
        void core_services_1.api.broadcast('omnichannel.room', inquiry.rid, {
            type: 'queueData',
            data,
        });
    }, 1000);
});
exports.dispatchInquiryPosition = dispatchInquiryPosition;
const dispatchWaitingQueueStatus = (department) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_waiting_queue') && !server_1.settings.get('Omnichannel_calculate_dispatch_service_queue_statistics')) {
        return;
    }
    const queue = yield models_1.LivechatInquiry.getCurrentSortedQueueAsync({
        department,
        queueSortBy: (0, settings_1.getInquirySortMechanismSetting)(),
    });
    if (!queue.length) {
        return;
    }
    const queueInfo = yield getQueueInfo(department);
    queue.forEach((inquiry) => {
        void (0, exports.dispatchInquiryPosition)(inquiry, queueInfo);
    });
});
// When dealing with lots of queued items we need to make sure to notify their position
// but we don't need to notify _each_ change that takes place, just their final position
exports.debouncedDispatchWaitingQueueStatus = (0, debounceByParams_1.memoizeDebounce)(dispatchWaitingQueueStatus, 1200);
const setPredictedVisitorAbandonmentTime = (room, roomUpdater) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = room.responseBy) === null || _a === void 0 ? void 0 : _a.firstResponseTs) ||
        !server_1.settings.get('Livechat_abandoned_rooms_action') ||
        server_1.settings.get('Livechat_abandoned_rooms_action') === 'none') {
        return;
    }
    let secondsToAdd = server_1.settings.get('Livechat_visitor_inactivity_timeout');
    const department = room.departmentId ? yield models_1.LivechatDepartment.findOneById(room.departmentId) : null;
    if (department === null || department === void 0 ? void 0 : department.visitorInactivityTimeoutInSeconds) {
        secondsToAdd = department.visitorInactivityTimeoutInSeconds;
    }
    if (secondsToAdd <= 0) {
        return;
    }
    const willBeAbandonedAt = (0, moment_1.default)(room.responseBy.firstResponseTs).add(Number(secondsToAdd), 'seconds').toDate();
    if (roomUpdater) {
        yield models_1.LivechatRooms.getPredictedVisitorAbandonmentByRoomIdUpdateQuery(willBeAbandonedAt, roomUpdater);
    }
    else {
        yield models_1.LivechatRooms.setPredictedVisitorAbandonmentByRoomId(room._id, willBeAbandonedAt);
    }
});
exports.setPredictedVisitorAbandonmentTime = setPredictedVisitorAbandonmentTime;
const updatePredictedVisitorAbandonment = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_abandoned_rooms_action') || server_1.settings.get('Livechat_abandoned_rooms_action') === 'none') {
        yield models_1.LivechatRooms.unsetAllPredictedVisitorAbandonment();
    }
    else {
        // Eng day: use a promise queue to update the predicted visitor abandonment time instead of all at once
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const promisesArray = [];
        yield models_1.LivechatRooms.findOpen(extraQuery).forEach((room) => {
            promisesArray.push((0, exports.setPredictedVisitorAbandonmentTime)(room));
        });
        yield Promise.all(promisesArray);
    }
});
exports.updatePredictedVisitorAbandonment = updatePredictedVisitorAbandonment;
const updateQueueInactivityTimeout = () => __awaiter(void 0, void 0, void 0, function* () {
    const queueTimeout = server_1.settings.get('Livechat_max_queue_wait_time');
    if (queueTimeout <= 0) {
        yield QueueInactivityMonitor_1.OmnichannelQueueInactivityMonitor.stop();
        return;
    }
    yield models_1.LivechatInquiry.getQueuedInquiries({ projection: { _updatedAt: 1 } }).forEach((inq) => {
        const aggregatedDate = (0, moment_1.default)(inq._updatedAt).add(queueTimeout, 'minutes');
        try {
            void QueueInactivityMonitor_1.OmnichannelQueueInactivityMonitor.scheduleInquiry(inq._id, new Date(aggregatedDate.format()));
        }
        catch (e) {
            // this will usually happen if other instance attempts to re-create a job
            logger_1.logger.error({ err: e });
        }
    });
});
exports.updateQueueInactivityTimeout = updateQueueInactivityTimeout;
const updateSLAInquiries = (sla) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sla) {
        return;
    }
    const { _id: slaId } = sla;
    const promises = [];
    const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
    yield models_1.LivechatRooms.findOpenBySlaId(slaId, {}, extraQuery).forEach((room) => {
        promises.push((0, SlaHelper_1.updateInquiryQueueSla)(room._id, sla));
    });
    yield Promise.allSettled(promises);
});
exports.updateSLAInquiries = updateSLAInquiries;
const getLivechatCustomFields = () => __awaiter(void 0, void 0, void 0, function* () {
    const customFields = yield models_1.LivechatCustomField.find({
        visibility: 'visible',
        scope: 'visitor',
        public: true,
    }).toArray();
    return customFields.map(({ _id, label, regexp, required = false, type, defaultValue = null, options }) => (Object.assign({ _id,
        label,
        regexp,
        required,
        type,
        defaultValue }, (options && options !== '' && { options: options.split(',') }))));
});
exports.getLivechatCustomFields = getLivechatCustomFields;
const getLivechatQueueInfo = (room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!room) {
        return null;
    }
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return null;
    }
    if (!server_1.settings.get('Omnichannel_calculate_dispatch_service_queue_statistics')) {
        return null;
    }
    const { _id: rid, departmentId: department } = room;
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(rid, { projection: { _id: 1, status: 1 } });
    if (!inquiry) {
        return null;
    }
    const { _id, status } = inquiry;
    if (status !== 'queued') {
        return null;
    }
    const [inq] = yield models_1.LivechatInquiry.getCurrentSortedQueueAsync({
        inquiryId: _id,
        department,
        queueSortBy: (0, settings_1.getInquirySortMechanismSetting)(),
    });
    if (!inq) {
        return null;
    }
    return normalizeQueueInfo(inq);
});
exports.getLivechatQueueInfo = getLivechatQueueInfo;
