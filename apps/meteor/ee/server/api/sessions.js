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
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ajv_1 = __importDefault(require("ajv"));
const api_1 = require("../../../app/api/server/api");
const getPaginationItems_1 = require("../../../app/api/server/helpers/getPaginationItems");
const ajv = new ajv_1.default({ coerceTypes: true });
const isSessionsProps = ajv.compile({
    type: 'object',
    properties: {
        sessionId: {
            type: 'string',
        },
    },
    required: ['sessionId'],
    additionalProperties: false,
});
const isSessionsPaginateProps = ajv.compile({
    type: 'object',
    properties: {
        offset: {
            type: 'number',
        },
        count: {
            type: 'number',
        },
        filter: {
            type: 'string',
        },
        sort: {
            type: 'string',
        },
    },
    required: [],
    additionalProperties: false,
});
const validateSortKeys = (sortKeys) => {
    const validSortKeys = ['loginAt', 'device.name', 'device.os.name', 'device.os.version', '_user.name', '_user.username'];
    return sortKeys.every((s) => validSortKeys.includes(s));
};
api_1.API.v1.addRoute('sessions/list', { authRequired: true, validateParams: isSessionsPaginateProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort = { loginAt: -1 } } = yield this.parseJsonQuery();
            const search = (0, string_helpers_1.escapeRegExp)(((_a = this.queryParams) === null || _a === void 0 ? void 0 : _a.filter) || '');
            if (!validateSortKeys(Object.keys(sort))) {
                return api_1.API.v1.failure('error-invalid-sort-keys');
            }
            const sessions = yield models_1.Sessions.aggregateSessionsByUserId({ uid: this.userId, search, sort, offset, count });
            return api_1.API.v1.success(sessions);
        });
    },
});
api_1.API.v1.addRoute('sessions/info', { authRequired: true, validateParams: isSessionsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const { sessionId } = this.queryParams;
            const sessions = yield models_1.Sessions.findOneBySessionIdAndUserId(sessionId, this.userId);
            if (!sessions) {
                return api_1.API.v1.notFound('Session not found');
            }
            return api_1.API.v1.success(sessions);
        });
    },
});
api_1.API.v1.addRoute('sessions/logout.me', { authRequired: true, validateParams: isSessionsProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const { sessionId } = this.bodyParams;
            const sessionObj = yield models_1.Sessions.findOneBySessionIdAndUserId(sessionId, this.userId);
            if (!(sessionObj === null || sessionObj === void 0 ? void 0 : sessionObj.loginToken)) {
                return api_1.API.v1.notFound('Session not found');
            }
            yield Promise.all([
                models_1.Users.unsetOneLoginToken(this.userId, sessionObj.loginToken),
                models_1.Sessions.logoutByloginTokenAndUserId({ loginToken: sessionObj.loginToken, userId: this.userId }),
            ]);
            return api_1.API.v1.success({ sessionId });
        });
    },
});
api_1.API.v1.addRoute('sessions/list.all', { authRequired: true, twoFactorRequired: true, validateParams: isSessionsPaginateProps, permissionsRequired: ['view-device-management'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort = { loginAt: -1 } } = yield this.parseJsonQuery();
            const filter = (0, string_helpers_1.escapeRegExp)(((_a = this.queryParams) === null || _a === void 0 ? void 0 : _a.filter) || '');
            if (!validateSortKeys(Object.keys(sort))) {
                return api_1.API.v1.failure('error-invalid-sort-keys');
            }
            const search = [];
            if (filter) {
                search.push(filter);
                search.push(...(yield models_1.Users.findActiveByUsernameOrNameRegexWithExceptionsAndConditions({ $regex: filter, $options: 'i' }, [], {}, { projection: { _id: 1 }, limit: 5 })
                    .map((el) => el._id)
                    .toArray()));
            }
            const sessions = yield models_1.Sessions.aggregateSessionsAndPopulate({ search: search.join('|'), sort, offset, count });
            return api_1.API.v1.success(sessions);
        });
    },
});
api_1.API.v1.addRoute('sessions/info.admin', { authRequired: true, twoFactorRequired: true, validateParams: isSessionsProps, permissionsRequired: ['view-device-management'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const sessionId = (_a = this.queryParams) === null || _a === void 0 ? void 0 : _a.sessionId;
            const { sessions } = yield models_1.Sessions.aggregateSessionsAndPopulate({ search: sessionId, count: 1 });
            if (!(sessions === null || sessions === void 0 ? void 0 : sessions.length)) {
                return api_1.API.v1.notFound('Session not found');
            }
            return api_1.API.v1.success(sessions[0]);
        });
    },
});
api_1.API.v1.addRoute('sessions/logout', { authRequired: true, twoFactorRequired: true, validateParams: isSessionsProps, permissionsRequired: ['logout-device-management'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!license_1.License.hasModule('device-management')) {
                return api_1.API.v1.unauthorized();
            }
            const { sessionId } = this.bodyParams;
            const sessionObj = yield models_1.Sessions.findOneBySessionId(sessionId);
            if (!(sessionObj === null || sessionObj === void 0 ? void 0 : sessionObj.loginToken)) {
                return api_1.API.v1.notFound('Session not found');
            }
            yield core_services_1.api.broadcast('user.forceLogout', sessionObj.userId);
            yield Promise.all([
                models_1.Users.unsetOneLoginToken(sessionObj.userId, sessionObj.loginToken),
                models_1.Sessions.logoutByloginTokenAndUserId({ loginToken: sessionObj.loginToken, userId: sessionObj.userId, logoutBy: this.userId }),
            ]);
            return api_1.API.v1.success({ sessionId });
        });
    },
});
