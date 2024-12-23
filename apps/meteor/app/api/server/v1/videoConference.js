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
const core_services_1 = require("@rocket.chat/core-services");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const constants_1 = require("../../../../lib/videoConference/constants");
const videoConfProviders_1 = require("../../../../server/lib/videoConfProviders");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
api_1.API.v1.addRoute('video-conference.start', { authRequired: true, validateParams: rest_typings_1.isVideoConfStartProps, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 60000 } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, title, allowRinging: requestRinging } = this.bodyParams;
            const { userId } = this;
            if (!userId || !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, userId))) {
                return api_1.API.v1.failure('invalid-params');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'call-management', roomId))) {
                return api_1.API.v1.unauthorized();
            }
            try {
                const providerName = videoConfProviders_1.videoConfProviders.getActiveProvider();
                if (!providerName) {
                    throw new Error(constants_1.availabilityErrors.NOT_ACTIVE);
                }
                const allowRinging = Boolean(requestRinging) && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'videoconf-ring-users'));
                return api_1.API.v1.success({
                    data: Object.assign(Object.assign({}, (yield core_services_1.VideoConf.start(userId, roomId, { title, allowRinging }))), { providerName }),
                });
            }
            catch (e) {
                return api_1.API.v1.failure(yield core_services_1.VideoConf.diagnoseProvider(userId, roomId));
            }
        });
    },
});
api_1.API.v1.addRoute('video-conference.join', { authOrAnonRequired: true, validateParams: rest_typings_1.isVideoConfJoinProps, rateLimiterOptions: { numRequestsAllowed: 2, intervalTimeInMS: 5000 } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { callId, state } = this.bodyParams;
            const { userId } = this;
            const call = yield core_services_1.VideoConf.get(callId);
            if (!call) {
                return api_1.API.v1.failure('invalid-params');
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(call.rid, userId))) {
                return api_1.API.v1.failure('invalid-params');
            }
            let url;
            try {
                url = yield core_services_1.VideoConf.join(userId, callId, Object.assign(Object.assign({}, ((state === null || state === void 0 ? void 0 : state.cam) !== undefined ? { cam: state.cam } : {})), ((state === null || state === void 0 ? void 0 : state.mic) !== undefined ? { mic: state.mic } : {})));
            }
            catch (e) {
                if (userId) {
                    return api_1.API.v1.failure(yield core_services_1.VideoConf.diagnoseProvider(userId, call.rid, call.providerName));
                }
            }
            if (!url) {
                return api_1.API.v1.failure('failed-to-get-url');
            }
            return api_1.API.v1.success({
                url,
                providerName: call.providerName,
            });
        });
    },
});
api_1.API.v1.addRoute('video-conference.cancel', { authRequired: true, validateParams: rest_typings_1.isVideoConfCancelProps, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 60000 } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { callId } = this.bodyParams;
            const { userId } = this;
            const call = yield core_services_1.VideoConf.get(callId);
            if (!call) {
                return api_1.API.v1.failure('invalid-params');
            }
            if (!userId || !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(call.rid, userId))) {
                return api_1.API.v1.failure('invalid-params');
            }
            yield core_services_1.VideoConf.cancel(userId, callId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('video-conference.info', { authRequired: true, validateParams: rest_typings_1.isVideoConfInfoProps, rateLimiterOptions: { numRequestsAllowed: 15, intervalTimeInMS: 3000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { callId } = this.queryParams;
            const { userId } = this;
            const call = yield core_services_1.VideoConf.get(callId);
            if (!call) {
                return api_1.API.v1.failure('invalid-params');
            }
            if (!userId || !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(call.rid, userId))) {
                return api_1.API.v1.failure('invalid-params');
            }
            const capabilities = yield core_services_1.VideoConf.listProviderCapabilities(call.providerName);
            return api_1.API.v1.success(Object.assign(Object.assign({}, call), { capabilities }));
        });
    },
});
api_1.API.v1.addRoute('video-conference.list', { authRequired: true, validateParams: rest_typings_1.isVideoConfListProps, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 1000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { userId } = this;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            if (!userId || !(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, userId))) {
                return api_1.API.v1.failure('invalid-params');
            }
            const data = yield core_services_1.VideoConf.list(roomId, { offset, count });
            return api_1.API.v1.success(data);
        });
    },
});
api_1.API.v1.addRoute('video-conference.providers', { authRequired: true, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 1000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield core_services_1.VideoConf.listProviders();
            return api_1.API.v1.success({ data });
        });
    },
});
api_1.API.v1.addRoute('video-conference.capabilities', { authRequired: true, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 1000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield core_services_1.VideoConf.listCapabilities();
            return api_1.API.v1.success(data);
        });
    },
});
