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
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const logger_1 = require("./logger");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const api_1 = require("../../api");
const getPaginationItems_1 = require("../../helpers/getPaginationItems");
function filter(array, { queues, extension, agentId, status }) {
    const defaultFunc = () => true;
    return array.filter((item) => {
        const queuesCond = queues && Array.isArray(queues) ? () => { var _a; return ((_a = item.queues) === null || _a === void 0 ? void 0 : _a.some((q) => queues.includes(q))) || false; } : defaultFunc;
        const extensionCond = (extension === null || extension === void 0 ? void 0 : extension.trim()) ? () => (item === null || item === void 0 ? void 0 : item.extension) === extension : defaultFunc;
        const agentIdCond = (agentId === null || agentId === void 0 ? void 0 : agentId.trim()) ? () => (item === null || item === void 0 ? void 0 : item.userId) === agentId : defaultFunc;
        const statusCond = (status === null || status === void 0 ? void 0 : status.trim()) ? () => (item === null || item === void 0 ? void 0 : item.state) === status : defaultFunc;
        return queuesCond() && extensionCond() && agentIdCond() && statusCond();
    });
}
function paginate(array, count = 10, offset = 0) {
    return array.slice(offset, offset + count);
}
const isUserAndExtensionParams = (p) => p.userId && p.extension;
const isUserIdndTypeParams = (p) => p.userId && p.type;
api_1.API.v1.addRoute('omnichannel/agent/extension', { authRequired: true, permissionsRequired: ['manage-agent-extension-association'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                username: String,
                extension: String,
            }), check_1.Match.ObjectIncluding({
                userId: String,
                extension: String,
            })));
            const { extension } = this.bodyParams;
            let user = null;
            if (!isUserAndExtensionParams(this.bodyParams)) {
                if (!this.bodyParams.username) {
                    return api_1.API.v1.notFound();
                }
                user = yield models_1.Users.findOneByAgentUsername(this.bodyParams.username, {
                    projection: {
                        _id: 1,
                        username: 1,
                    },
                });
            }
            else {
                if (!this.bodyParams.userId) {
                    return api_1.API.v1.notFound();
                }
                user = yield models_1.Users.findOneAgentById(this.bodyParams.userId, {
                    projection: {
                        _id: 1,
                        username: 1,
                    },
                });
            }
            if (!user) {
                return api_1.API.v1.notFound('User not found or does not have livechat-agent role');
            }
            try {
                yield models_1.Users.setExtension(user._id, extension);
                void (0, notifyListener_1.notifyOnUserChange)({
                    clientAction: 'updated',
                    id: user._id,
                    diff: {
                        extension,
                    },
                });
                return api_1.API.v1.success();
            }
            catch (e) {
                logger_1.logger.error({ msg: 'Extension already in use' });
                return api_1.API.v1.failure(`extension already in use ${extension}`);
            }
        });
    },
});
api_1.API.v1.addRoute('omnichannel/agent/extension/:username', {
    authRequired: true,
    permissionsRequired: {
        GET: ['view-agent-extension-association'],
        DELETE: ['manage-agent-extension-association'],
    },
}, {
    // Get the extensions associated with the agent passed as request params.
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, check_1.Match.ObjectIncluding({
                username: String,
            }));
            const { username } = this.urlParams;
            const user = yield models_1.Users.findOneByAgentUsername(username, {
                projection: { _id: 1 },
            });
            if (!user) {
                return api_1.API.v1.notFound('User not found');
            }
            const extension = yield models_1.Users.getVoipExtensionByUserId(user._id, {
                projection: {
                    _id: 1,
                    username: 1,
                    extension: 1,
                },
            });
            if (!extension) {
                return api_1.API.v1.notFound('Extension not found');
            }
            return api_1.API.v1.success({ extension });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, check_1.Match.ObjectIncluding({
                username: String,
            }));
            const { username } = this.urlParams;
            const user = yield models_1.Users.findOneByAgentUsername(username, {
                projection: {
                    _id: 1,
                    username: 1,
                    extension: 1,
                },
            });
            if (!user) {
                return api_1.API.v1.notFound();
            }
            if (!user.extension) {
                return api_1.API.v1.success();
            }
            logger_1.logger.debug(`Removing extension association for user ${user._id} (extension was ${user.extension})`);
            yield models_1.Users.unsetExtension(user._id);
            void (0, notifyListener_1.notifyOnUserChange)({
                clientAction: 'updated',
                id: user._id,
                diff: {
                    extension: null,
                },
            });
            return api_1.API.v1.success();
        });
    },
});
// Get free extensions
api_1.API.v1.addRoute('omnichannel/extension', { authRequired: true, permissionsRequired: ['manage-agent-extension-association'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                type: check_1.Match.OneOf('free', 'allocated', 'available'),
                userId: String,
            }), check_1.Match.ObjectIncluding({
                type: check_1.Match.OneOf('free', 'allocated', 'available'),
                username: String,
            })));
            switch (this.queryParams.type.toLowerCase()) {
                case 'free': {
                    const extensions = yield core_services_1.LivechatVoip.getFreeExtensions();
                    if (!extensions) {
                        return api_1.API.v1.failure('Error in finding free extensons');
                    }
                    return api_1.API.v1.success({ extensions });
                }
                case 'allocated': {
                    const extensions = yield core_services_1.LivechatVoip.getExtensionAllocationDetails();
                    if (!extensions) {
                        return api_1.API.v1.failure('Error in allocated extensions');
                    }
                    return api_1.API.v1.success({ extensions: extensions.map((e) => e.extension) });
                }
                case 'available': {
                    let user = null;
                    if (!isUserIdndTypeParams(this.queryParams)) {
                        user = yield models_1.Users.findOneByAgentUsername(this.queryParams.username, {
                            projection: { _id: 1, extension: 1 },
                        });
                    }
                    else {
                        user = yield models_1.Users.findOneAgentById(this.queryParams.userId, {
                            projection: { _id: 1, extension: 1 },
                        });
                    }
                    const freeExt = yield core_services_1.LivechatVoip.getFreeExtensions();
                    const extensions = (user === null || user === void 0 ? void 0 : user.extension) ? [user.extension, ...freeExt] : freeExt;
                    return api_1.API.v1.success({ extensions });
                }
                default:
                    return api_1.API.v1.notFound(`${this.queryParams.type} not found `);
            }
        });
    },
});
api_1.API.v1.addRoute('omnichannel/extensions', { authRequired: true, permissionsRequired: ['manage-agent-extension-association'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { status, agentId, queues, extension } = this.queryParams;
            (0, check_1.check)(status, check_1.Match.Maybe(String));
            (0, check_1.check)(agentId, check_1.Match.Maybe(String));
            (0, check_1.check)(queues, check_1.Match.Maybe([String]));
            (0, check_1.check)(extension, check_1.Match.Maybe(String));
            const extensions = yield core_services_1.LivechatVoip.getExtensionListWithAgentData();
            const filteredExts = filter(extensions, {
                status: status !== null && status !== void 0 ? status : undefined,
                agentId: agentId !== null && agentId !== void 0 ? agentId : undefined,
                queues: queues !== null && queues !== void 0 ? queues : undefined,
                extension: extension !== null && extension !== void 0 ? extension : undefined,
            });
            // paginating in memory as Asterisk doesn't provide pagination for commands
            return api_1.API.v1.success({
                extensions: paginate(filteredExts, count, offset),
                offset,
                count,
                total: filteredExts.length,
            });
        });
    },
});
api_1.API.v1.addRoute('omnichannel/agents/available', { authRequired: true, permissionsRequired: ['manage-agent-extension-association'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text, includeExtension = '' } = this.queryParams;
            const { agents, total } = yield core_services_1.LivechatVoip.getAvailableAgents(includeExtension, text, count, offset, sort);
            return api_1.API.v1.success({
                agents,
                offset,
                count,
                total,
            });
        });
    },
});
