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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const mountQueriesBasedOnPermission_1 = require("../../../integrations/server/lib/mountQueriesBasedOnPermission");
const addIncomingIntegration_1 = require("../../../integrations/server/methods/incoming/addIncomingIntegration");
const deleteIncomingIntegration_1 = require("../../../integrations/server/methods/incoming/deleteIncomingIntegration");
const addOutgoingIntegration_1 = require("../../../integrations/server/methods/outgoing/addOutgoingIntegration");
const deleteOutgoingIntegration_1 = require("../../../integrations/server/methods/outgoing/deleteOutgoingIntegration");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const integrations_1 = require("../lib/integrations");
api_1.API.v1.addRoute('integrations.create', { authRequired: true, validateParams: rest_typings_1.isIntegrationsCreateProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.bodyParams.type) {
                case 'webhook-outgoing':
                    return api_1.API.v1.success({ integration: yield (0, addOutgoingIntegration_1.addOutgoingIntegration)(this.userId, this.bodyParams) });
                case 'webhook-incoming':
                    return api_1.API.v1.success({ integration: yield (0, addIncomingIntegration_1.addIncomingIntegration)(this.userId, this.bodyParams) });
            }
            return api_1.API.v1.failure('Invalid integration type.');
        });
    },
});
api_1.API.v1.addRoute('integrations.history', {
    authRequired: true,
    validateParams: rest_typings_1.isIntegrationsHistoryProps,
    permissionsRequired: {
        GET: { permissions: ['manage-outgoing-integrations', 'manage-own-outgoing-integrations'], operation: 'hasAny' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, queryParams } = this;
            if (!queryParams.id || queryParams.id.trim() === '') {
                return api_1.API.v1.failure('Invalid integration id.');
            }
            const { id } = queryParams;
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields: projection, query } = yield this.parseJsonQuery();
            const ourQuery = Object.assign(yield (0, mountQueriesBasedOnPermission_1.mountIntegrationHistoryQueryBasedOnPermissions)(userId, id), query);
            const { cursor, totalCount } = models_1.IntegrationHistory.findPaginated(ourQuery, {
                sort: sort || { _updatedAt: -1 },
                skip: offset,
                limit: count,
                projection,
            });
            const [history, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                history,
                offset,
                items: history.length,
                count: history.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('integrations.list', {
    authRequired: true,
    validateParams: rest_typings_1.isIntegrationsListProps,
    permissionsRequired: {
        GET: {
            permissions: [
                'manage-outgoing-integrations',
                'manage-own-outgoing-integrations',
                'manage-incoming-integrations',
                'manage-own-incoming-integrations',
            ],
            operation: 'hasAny',
        },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const { name, type } = this.queryParams;
            const filter = Object.assign(Object.assign(Object.assign({}, query), (name ? { name: { $regex: (0, string_helpers_1.escapeRegExp)(name), $options: 'i' } } : {})), (type ? { type } : {}));
            const ourQuery = Object.assign(yield (0, mountQueriesBasedOnPermission_1.mountIntegrationQueryBasedOnPermissions)(this.userId), filter);
            const { cursor, totalCount } = models_1.Integrations.findPaginated(ourQuery, {
                sort: sort || { ts: -1 },
                skip: offset,
                limit: count,
                projection: fields,
            });
            const [integrations, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({
                integrations,
                offset,
                items: integrations.length,
                count: integrations.length,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('integrations.remove', {
    authRequired: true,
    validateParams: rest_typings_1.isIntegrationsRemoveProps,
    permissionsRequired: {
        POST: {
            permissions: [
                'manage-outgoing-integrations',
                'manage-own-outgoing-integrations',
                'manage-incoming-integrations',
                'manage-own-incoming-integrations',
            ],
            operation: 'hasAny',
        },
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            let integration = null;
            switch (bodyParams.type) {
                case 'webhook-outgoing':
                    if (!bodyParams.target_url && !bodyParams.integrationId) {
                        return api_1.API.v1.failure('An integrationId or target_url needs to be provided.');
                    }
                    if (bodyParams.target_url) {
                        integration = yield models_1.Integrations.findOne({ urls: bodyParams.target_url });
                    }
                    else if (bodyParams.integrationId) {
                        integration = yield models_1.Integrations.findOne({ _id: bodyParams.integrationId });
                    }
                    if (!integration) {
                        return api_1.API.v1.failure('No integration found.');
                    }
                    const outgoingId = integration._id;
                    yield (0, deleteOutgoingIntegration_1.deleteOutgoingIntegration)(outgoingId, this.userId);
                    return api_1.API.v1.success({
                        integration,
                    });
                case 'webhook-incoming':
                    (0, check_1.check)(bodyParams, check_1.Match.ObjectIncluding({
                        integrationId: String,
                    }));
                    integration = yield models_1.Integrations.findOne({ _id: bodyParams.integrationId });
                    if (!integration) {
                        return api_1.API.v1.failure('No integration found.');
                    }
                    const incomingId = integration._id;
                    yield (0, deleteIncomingIntegration_1.deleteIncomingIntegration)(incomingId, this.userId);
                    return api_1.API.v1.success({
                        integration,
                    });
                default:
                    return api_1.API.v1.failure('Invalid integration type.');
            }
        });
    },
});
api_1.API.v1.addRoute('integrations.get', { authRequired: true, validateParams: rest_typings_1.isIntegrationsGetProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { integrationId, createdBy } = this.queryParams;
            if (!integrationId) {
                return api_1.API.v1.failure('The query parameter "integrationId" is required.');
            }
            return api_1.API.v1.success({
                integration: yield (0, integrations_1.findOneIntegration)({
                    userId: this.userId,
                    integrationId,
                    createdBy,
                }),
            });
        });
    },
});
api_1.API.v1.addRoute('integrations.update', { authRequired: true, validateParams: rest_typings_1.isIntegrationsUpdateProps }, {
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            let integration;
            switch (bodyParams.type) {
                case 'webhook-outgoing':
                    if (bodyParams.target_url) {
                        integration = yield models_1.Integrations.findOne({ urls: bodyParams.target_url });
                    }
                    else if (bodyParams.integrationId) {
                        integration = yield models_1.Integrations.findOne({ _id: bodyParams.integrationId });
                    }
                    if (!integration) {
                        return api_1.API.v1.failure('No integration found.');
                    }
                    yield meteor_1.Meteor.callAsync('updateOutgoingIntegration', integration._id, bodyParams);
                    return api_1.API.v1.success({
                        integration: yield models_1.Integrations.findOne({ _id: integration._id }),
                    });
                case 'webhook-incoming':
                    integration = yield models_1.Integrations.findOne({ _id: bodyParams.integrationId });
                    if (!integration) {
                        return api_1.API.v1.failure('No integration found.');
                    }
                    yield meteor_1.Meteor.callAsync('updateIncomingIntegration', integration._id, bodyParams);
                    return api_1.API.v1.success({
                        integration: yield models_1.Integrations.findOne({ _id: integration._id }),
                    });
                default:
                    return api_1.API.v1.failure('Invalid integration type.');
            }
        });
    },
});
