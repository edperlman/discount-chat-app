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
exports.initializeLivechatInquiryStream = void 0;
const queryClient_1 = require("../../../../../client/lib/queryClient");
const callWithErrorHandling_1 = require("../../../../../client/lib/utils/callWithErrorHandling");
const client_1 = require("../../../../settings/client");
const SDKClient_1 = require("../../../../utils/client/lib/SDKClient");
const LivechatInquiry_1 = require("../../collections/LivechatInquiry");
const departments = new Set();
const events = {
    added: (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
        if (!departments.has(inquiry.department)) {
            return;
        }
        LivechatInquiry_1.LivechatInquiry.insert(Object.assign(Object.assign({}, inquiry), { alert: true, _updatedAt: new Date(inquiry._updatedAt) }));
        yield invalidateRoomQueries(inquiry.rid);
    }),
    changed: (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
        if (inquiry.status !== 'queued' || (inquiry.department && !departments.has(inquiry.department))) {
            return removeInquiry(inquiry);
        }
        LivechatInquiry_1.LivechatInquiry.upsert({ _id: inquiry._id }, Object.assign(Object.assign({}, inquiry), { alert: true, _updatedAt: new Date(inquiry._updatedAt) }));
        yield invalidateRoomQueries(inquiry.rid);
    }),
    removed: (inquiry) => removeInquiry(inquiry),
};
const invalidateRoomQueries = (rid) => __awaiter(void 0, void 0, void 0, function* () {
    yield queryClient_1.queryClient.invalidateQueries(['rooms', { reference: rid, type: 'l' }]);
    queryClient_1.queryClient.removeQueries(['rooms', rid]);
    queryClient_1.queryClient.removeQueries(['/v1/rooms.info', rid]);
});
const removeInquiry = (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
    LivechatInquiry_1.LivechatInquiry.remove(inquiry._id);
    return queryClient_1.queryClient.invalidateQueries(['rooms', { reference: inquiry.rid, type: 'l' }]);
});
const getInquiriesFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const count = (_a = client_1.settings.get('Livechat_guest_pool_max_number_incoming_livechats_displayed')) !== null && _a !== void 0 ? _a : 0;
    const { inquiries } = yield SDKClient_1.sdk.rest.get('/v1/livechat/inquiries.queuedForUser', { count });
    return inquiries;
});
const removeListenerOfDepartment = (departmentId) => {
    SDKClient_1.sdk.stop('livechat-inquiry-queue-observer', `department/${departmentId}`);
    departments.delete(departmentId);
};
const appendListenerToDepartment = (departmentId) => {
    departments.add(departmentId);
    SDKClient_1.sdk.stream('livechat-inquiry-queue-observer', [`department/${departmentId}`], (args) => __awaiter(void 0, void 0, void 0, function* () {
        if (!('type' in args)) {
            return;
        }
        const { type } = args, inquiry = __rest(args, ["type"]);
        yield events[args.type](inquiry);
    }));
    return () => removeListenerOfDepartment(departmentId);
};
const addListenerForeachDepartment = (departments = []) => {
    const cleanupFunctions = departments.map((department) => appendListenerToDepartment(department));
    return () => cleanupFunctions.forEach((cleanup) => cleanup());
};
const updateInquiries = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (inquiries = []) { return inquiries.forEach((inquiry) => LivechatInquiry_1.LivechatInquiry.upsert({ _id: inquiry._id }, Object.assign(Object.assign({}, inquiry), { _updatedAt: new Date(inquiry._updatedAt) }))); });
const getAgentsDepartments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { departments } = yield SDKClient_1.sdk.rest.get(`/v1/livechat/agents/${userId}/departments`, { enabledDepartmentsOnly: 'true' });
    return departments;
});
const removeGlobalListener = () => SDKClient_1.sdk.stop('livechat-inquiry-queue-observer', 'public');
const addGlobalListener = () => {
    SDKClient_1.sdk.stream('livechat-inquiry-queue-observer', ['public'], (args) => __awaiter(void 0, void 0, void 0, function* () {
        if (!('type' in args)) {
            return;
        }
        const { type } = args, inquiry = __rest(args, ["type"]);
        yield events[args.type](inquiry);
    }));
    return removeGlobalListener;
};
const subscribe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield (0, callWithErrorHandling_1.callWithErrorHandling)('livechat:getRoutingConfig');
    if (config === null || config === void 0 ? void 0 : config.autoAssignAgent) {
        return;
    }
    const agentDepartments = (yield getAgentsDepartments(userId)).map((department) => department.departmentId);
    // Register to all depts + public queue always to match the inquiry list returned by backend
    const cleanDepartmentListeners = addListenerForeachDepartment(agentDepartments);
    const globalCleanup = addGlobalListener();
    const computation = Tracker.autorun(() => __awaiter(void 0, void 0, void 0, function* () {
        const inquiriesFromAPI = (yield getInquiriesFromAPI());
        yield updateInquiries(inquiriesFromAPI);
    }));
    return () => {
        LivechatInquiry_1.LivechatInquiry.remove({});
        removeGlobalListener();
        cleanDepartmentListeners === null || cleanDepartmentListeners === void 0 ? void 0 : cleanDepartmentListeners();
        globalCleanup === null || globalCleanup === void 0 ? void 0 : globalCleanup();
        departments.clear();
        computation.stop();
    };
});
exports.initializeLivechatInquiryStream = (() => {
    let cleanUp;
    return (...args) => __awaiter(void 0, void 0, void 0, function* () {
        cleanUp === null || cleanUp === void 0 ? void 0 : cleanUp();
        cleanUp = yield subscribe(...args);
    });
})();
