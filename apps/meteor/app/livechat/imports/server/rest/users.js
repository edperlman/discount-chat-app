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
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const underscore_1 = __importDefault(require("underscore"));
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const users_1 = require("../../../server/api/lib/users");
const LivechatTyped_1 = require("../../../server/lib/LivechatTyped");
const emptyStringArray = [];
server_1.API.v1.addRoute('livechat/users/:type', {
    authRequired: true,
    permissionsRequired: {
        'POST': ['view-livechat-manager'],
        '*': emptyStringArray,
    },
    validateParams: {
        GET: rest_typings_1.isLivechatUsersManagerGETProps,
        POST: rest_typings_1.isPOSTLivechatUsersTypeProps,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                type: String,
            });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text } = this.queryParams;
            if (this.urlParams.type === 'agent') {
                if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['transfer-livechat-guest', 'edit-omnichannel-contact']))) {
                    return server_1.API.v1.unauthorized();
                }
                const { onlyAvailable, excludeId, showIdleAgents } = this.queryParams;
                return server_1.API.v1.success(yield (0, users_1.findAgents)({
                    text,
                    onlyAvailable,
                    excludeId,
                    showIdleAgents,
                    pagination: {
                        offset,
                        count,
                        sort,
                    },
                }));
            }
            if (this.urlParams.type === 'manager') {
                if (!(yield (0, hasPermission_1.hasAtLeastOnePermissionAsync)(this.userId, ['view-livechat-manager']))) {
                    return server_1.API.v1.unauthorized();
                }
                return server_1.API.v1.success(yield (0, users_1.findManagers)({
                    text,
                    pagination: {
                        offset,
                        count,
                        sort,
                    },
                }));
            }
            throw new Error('Invalid type');
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.urlParams.type === 'agent') {
                const user = yield LivechatTyped_1.Livechat.addAgent(this.bodyParams.username);
                if (user) {
                    return server_1.API.v1.success({ user });
                }
            }
            else if (this.urlParams.type === 'manager') {
                const user = yield LivechatTyped_1.Livechat.addManager(this.bodyParams.username);
                if (user) {
                    return server_1.API.v1.success({ user });
                }
            }
            else {
                throw new Error('Invalid type');
            }
            return server_1.API.v1.failure();
        });
    },
});
server_1.API.v1.addRoute('livechat/users/:type/:_id', { authRequired: true, permissionsRequired: ['view-livechat-manager'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(this.urlParams._id);
            if (!user) {
                return server_1.API.v1.failure('User not found');
            }
            let role;
            if (this.urlParams.type === 'agent') {
                role = 'livechat-agent';
            }
            else if (this.urlParams.type === 'manager') {
                role = 'livechat-manager';
            }
            else {
                throw new Error('Invalid type');
            }
            if (user.roles.indexOf(role) !== -1) {
                return server_1.API.v1.success({
                    user: underscore_1.default.pick(user, '_id', 'username', 'name', 'status', 'statusLivechat', 'emails', 'livechat'),
                });
            }
            return server_1.API.v1.success({
                user: null,
            });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(this.urlParams._id);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                return server_1.API.v1.failure();
            }
            if (this.urlParams.type === 'agent') {
                if (yield LivechatTyped_1.Livechat.removeAgent(user.username)) {
                    return server_1.API.v1.success();
                }
            }
            else if (this.urlParams.type === 'manager') {
                if (yield LivechatTyped_1.Livechat.removeManager(user.username)) {
                    return server_1.API.v1.success();
                }
            }
            else {
                throw new Error('Invalid type');
            }
            return server_1.API.v1.failure();
        });
    },
});
