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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const priorities_1 = require("./lib/priorities");
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
server_1.API.v1.addRoute('livechat/priorities', {
    authRequired: true,
    validateParams: rest_typings_1.isGETLivechatPrioritiesParams,
    permissionsRequired: { GET: { permissions: ['manage-livechat-priorities', 'view-l-room'], operation: 'hasAny' } },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text } = this.queryParams;
            return server_1.API.v1.success(yield (0, priorities_1.findPriority)({
                text,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/priorities/:priorityId', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['manage-livechat-priorities', 'view-l-room'], operation: 'hasAny' },
        PUT: { permissions: ['manage-livechat-priorities'], operation: 'hasAny' },
    },
    validateParams: { PUT: rest_typings_1.isPUTLivechatPriority },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { priorityId } = this.urlParams;
            const priority = yield models_1.LivechatPriority.findOneById(priorityId);
            if (!priority) {
                return server_1.API.v1.notFound(`Priority with id ${priorityId} not found`);
            }
            return server_1.API.v1.success(priority);
        });
    },
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { priorityId } = this.urlParams;
            yield (0, priorities_1.updatePriority)(priorityId, this.bodyParams);
            void (0, notifyListener_1.notifyOnLivechatPriorityChanged)(Object.assign({ _id: priorityId }, this.bodyParams));
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/priorities.reset', {
    authRequired: true,
    permissionsRequired: {
        POST: { permissions: ['manage-livechat-priorities'], operation: 'hasAny' },
        GET: { permissions: ['manage-livechat-priorities'], operation: 'hasAny' },
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield models_1.LivechatPriority.canResetPriorities())) {
                return server_1.API.v1.failure();
            }
            const eligiblePriorities = (yield models_1.LivechatPriority.findByDirty().toArray()).map(({ _id }) => _id);
            yield models_1.LivechatPriority.resetPriorities(eligiblePriorities);
            eligiblePriorities.forEach((_id) => (0, notifyListener_1.notifyOnLivechatPriorityChanged)({ _id, name: undefined }));
            return server_1.API.v1.success();
        });
    },
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return server_1.API.v1.success({ reset: yield models_1.LivechatPriority.canResetPriorities() });
        });
    },
});
