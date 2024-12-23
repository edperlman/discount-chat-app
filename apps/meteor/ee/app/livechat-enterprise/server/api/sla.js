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
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
const LivechatEnterprise_1 = require("../lib/LivechatEnterprise");
const sla_1 = require("./lib/sla");
server_1.API.v1.addRoute('livechat/sla', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['manage-livechat-sla', 'view-l-room'], operation: 'hasAny' },
        POST: { permissions: ['manage-livechat-sla'], operation: 'hasAny' },
    },
    validateParams: {
        GET: rest_typings_1.isLivechatPrioritiesProps,
        POST: rest_typings_1.isCreateOrUpdateLivechatSlaProps,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text } = this.queryParams;
            return server_1.API.v1.success(yield (0, sla_1.findSLA)({
                text,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            }));
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, dueTimeInMinutes } = this.bodyParams;
            const newSla = yield LivechatEnterprise_1.LivechatEnterprise.saveSLA(null, {
                name,
                description,
                dueTimeInMinutes,
            });
            return server_1.API.v1.success({ sla: newSla });
        });
    },
});
server_1.API.v1.addRoute('livechat/sla/:slaId', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['manage-livechat-sla', 'view-l-room'], operation: 'hasAny' },
        DELETE: { permissions: ['manage-livechat-sla'], operation: 'hasAny' },
        PUT: { permissions: ['manage-livechat-sla'], operation: 'hasAny' },
    },
    validateParams: {
        PUT: rest_typings_1.isCreateOrUpdateLivechatSlaProps,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { slaId } = this.urlParams;
            const sla = yield models_1.OmnichannelServiceLevelAgreements.findOneById(slaId);
            if (!sla) {
                return server_1.API.v1.notFound(`SLA with id ${slaId} not found`);
            }
            return server_1.API.v1.success(sla);
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { slaId } = this.urlParams;
            yield LivechatEnterprise_1.LivechatEnterprise.removeSLA(slaId);
            return server_1.API.v1.success();
        });
    },
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, dueTimeInMinutes } = this.bodyParams;
            const { slaId } = this.urlParams;
            const updatedSla = yield LivechatEnterprise_1.LivechatEnterprise.saveSLA(slaId, {
                name,
                description,
                dueTimeInMinutes,
            });
            return server_1.API.v1.success({ sla: updatedSla });
        });
    },
});
