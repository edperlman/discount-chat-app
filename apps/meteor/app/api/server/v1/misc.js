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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ejson_1 = __importDefault(require("ejson"));
const check_1 = require("meteor/check");
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const uuid_1 = require("uuid");
const i18n_1 = require("../../../../server/lib/i18n");
const system_1 = require("../../../../server/lib/logger/system");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const stdout_1 = require("../../../../server/stream/stdout");
const server_1 = require("../../../lib/server");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_2 = require("../../../settings/server");
const getBaseUserFields_1 = require("../../../utils/server/functions/getBaseUserFields");
const isSMTPConfigured_1 = require("../../../utils/server/functions/isSMTPConfigured");
const getURL_1 = require("../../../utils/server/getURL");
const api_1 = require("../api");
const getLoggedInUser_1 = require("../helpers/getLoggedInUser");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
const getUserInfo_1 = require("../helpers/getUserInfo");
/**
 * @openapi
 *  /api/v1/me:
 *    get:
 *      description: Gets user data of the authenticated user
 *      security:
 *        - authenticated: []
 *      responses:
 *        200:
 *          description: The user data of the authenticated user
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      username:
 *                        type: string
 *                      nickname:
 *                        type: string
 *                      emails:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            address:
 *                              type: string
 *                            verified:
 *                              type: boolean
 *                      email:
 *                        type: string
 *                      status:
 *                        $ref: '#/components/schemas/UserStatus'
 *                      statusDefault:
 *                        $ref: '#/components/schemas/UserStatus'
 *                      statusText:
 *                        $ref: '#/components/schemas/UserStatus'
 *                      statusConnection:
 *                        $ref: '#/components/schemas/UserStatus'
 *                      bio:
 *                        type: string
 *                      avatarOrigin:
 *                        type: string
 *                        enum: [none, local, upload, url]
 *                      utcOffset:
 *                        type: number
 *                      language:
 *                        type: string
 *                      settings:
 *                        type: object
 *                        properties:
 *                          preferences:
 *                            type: object
 *                      enableAutoAway:
 *                        type: boolean
 *                      idleTimeLimit:
 *                        type: number
 *                      roles:
 *                        type: array
 *                      active:
 *                        type: boolean
 *                      defaultRoom:
 *                        type: string
 *                      customFields:
 *                        type: array
 *                      requirePasswordChange:
 *                        type: boolean
 *                      requirePasswordChangeReason:
 *                        type: string
 *                      services:
 *                        type: object
 *                        properties:
 *                          github:
 *                            type: object
 *                          gitlab:
 *                            type: object
 *                          password:
 *                            type: object
 *                            properties:
 *                              exists:
 *                                type: boolean
 *                          totp:
 *                            type: object
 *                            properties:
 *                              enabled:
 *                                type: boolean
 *                          email2fa:
 *                            type: object
 *                            properties:
 *                              enabled:
 *                                type: boolean
 *                      statusLivechat:
 *                        type: string
 *                        enum: [available, 'not-available']
 *                      banners:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            text:
 *                              type: string
 *                            textArguments:
 *                              type: array
 *                              items: {}
 *                            modifiers:
 *                              type: array
 *                              items:
 *                                type: string
 *                            infoUrl:
 *                              type: string
 *                      oauth:
 *                        type: object
 *                        properties:
 *                          authorizedClients:
 *                            type: array
 *                            items:
 *                              type: string
 *                      _updatedAt:
 *                        type: string
 *                        format: date-time
 *                      avatarETag:
 *                        type: string
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('me', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userFields = Object.assign(Object.assign({}, (0, getBaseUserFields_1.getBaseUserFields)()), { services: 1 });
            const _d = (yield models_1.Users.findOneById(this.userId, { projection: userFields })), { services } = _d, user = __rest(_d, ["services"]);
            return api_1.API.v1.success(yield (0, getUserInfo_1.getUserInfo)(Object.assign(Object.assign(Object.assign({}, user), { isOAuthUser: (0, core_typings_1.isOAuthUser)(Object.assign(Object.assign({}, user), { services })) }), (services && {
                services: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (services.github && { github: services.github })), (services.gitlab && { gitlab: services.gitlab })), (((_a = services.email2fa) === null || _a === void 0 ? void 0 : _a.enabled) && { email2fa: { enabled: services.email2fa.enabled } })), (((_b = services.totp) === null || _b === void 0 ? void 0 : _b.enabled) && { totp: { enabled: services.totp.enabled } })), { password: {
                        // The password hash shouldn't be leaked but the client may need to know if it exists.
                        exists: Boolean((_c = services === null || services === void 0 ? void 0 : services.password) === null || _c === void 0 ? void 0 : _c.bcrypt),
                    } }),
            }))));
        });
    },
});
let onlineCache = 0;
let onlineCacheDate = 0;
const cacheInvalid = 60000; // 1 minute
api_1.API.v1.addRoute('shield.svg', {
    authRequired: false,
    rateLimiterOptions: {
        numRequestsAllowed: 60,
        intervalTimeInMS: 60000,
    },
    validateParams: rest_typings_1.isShieldSvgProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, icon } = this.queryParams;
            let { channel, name } = this.queryParams;
            if (!server_2.settings.get('API_Enable_Shields')) {
                throw new meteor_1.Meteor.Error('error-endpoint-disabled', 'This endpoint is disabled', {
                    route: '/api/v1/shield.svg',
                });
            }
            const types = server_2.settings.get('API_Shield_Types');
            if (type &&
                types !== '*' &&
                !types
                    .split(',')
                    .map((t) => t.trim())
                    .includes(type)) {
                throw new meteor_1.Meteor.Error('error-shield-disabled', 'This shield type is disabled', {
                    route: '/api/v1/shield.svg',
                });
            }
            const hideIcon = icon === 'false';
            if (hideIcon && !(name === null || name === void 0 ? void 0 : name.trim())) {
                return api_1.API.v1.failure('Name cannot be empty when icon is hidden');
            }
            let text;
            let backgroundColor = '#4c1';
            switch (type) {
                case 'online':
                    if (Date.now() - onlineCacheDate > cacheInvalid) {
                        onlineCache = yield models_1.Users.countUsersNotOffline();
                        onlineCacheDate = Date.now();
                    }
                    text = `${onlineCache} ${i18n_1.i18n.t('Online')}`;
                    break;
                case 'channel':
                    if (!channel) {
                        return api_1.API.v1.failure('Shield channel is required for type "channel"');
                    }
                    text = `#${channel}`;
                    break;
                case 'user':
                    if (server_2.settings.get('API_Shield_user_require_auth') && !(yield (0, getLoggedInUser_1.getLoggedInUser)(this.request))) {
                        return api_1.API.v1.failure('You must be logged in to do this.');
                    }
                    const user = yield (0, getUserFromParams_1.getUserFromParams)(this.queryParams);
                    // Respect the server's choice for using their real names or not
                    if (user.name && server_2.settings.get('UI_Use_Real_Name')) {
                        text = `${user.name}`;
                    }
                    else {
                        text = `@${user.username}`;
                    }
                    switch (user.status) {
                        case 'online':
                            backgroundColor = '#1fb31f';
                            break;
                        case 'away':
                            backgroundColor = '#dc9b01';
                            break;
                        case 'busy':
                            backgroundColor = '#bc2031';
                            break;
                        case 'offline':
                            backgroundColor = '#a5a1a1';
                    }
                    break;
                default:
                    text = i18n_1.i18n.t('Join_Chat').toUpperCase();
            }
            const iconSize = hideIcon ? 7 : 24;
            const leftSize = name ? name.length * 6 + 7 + iconSize : iconSize;
            const rightSize = text.length * 6 + 20;
            const width = leftSize + rightSize;
            const height = 20;
            channel = (0, string_helpers_1.escapeHTML)(channel);
            text = (0, string_helpers_1.escapeHTML)(text);
            name = (0, string_helpers_1.escapeHTML)(name);
            return {
                headers: { 'Content-Type': 'image/svg+xml;charset=utf-8' },
                body: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
					<linearGradient id="b" x2="0" y2="100%">
						<stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
						<stop offset="1" stop-opacity=".1"/>
					</linearGradient>
					<mask id="a">
						<rect width="${width}" height="${height}" rx="3" fill="#fff"/>
					</mask>
					<g mask="url(#a)">
						<path fill="#555" d="M0 0h${leftSize}v${height}H0z"/>
						<path fill="${backgroundColor}" d="M${leftSize} 0h${rightSize}v${height}H${leftSize}z"/>
						<path fill="url(#b)" d="M0 0h${width}v${height}H0z"/>
					</g>
						${hideIcon ? '' : `<image x="5" y="3" width="14" height="14" xlink:href="${(0, getURL_1.getURL)('/assets/favicon.svg', { full: true })}"/>`}
					<g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
						${name
                    ? `<text x="${iconSize}" y="15" fill="#010101" fill-opacity=".3">${name}</text>
						<text x="${iconSize}" y="14">${name}</text>`
                    : ''}
						<text x="${leftSize + 7}" y="15" fill="#010101" fill-opacity=".3">${text}</text>
						<text x="${leftSize + 7}" y="14">${text}</text>
					</g>
				</svg>
			`
                    .trim()
                    .replace(/\>[\s]+\</gm, '><'),
            };
        });
    },
});
api_1.API.v1.addRoute('spotlight', {
    authRequired: true,
    validateParams: rest_typings_1.isSpotlightProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = this.queryParams;
            const result = yield meteor_1.Meteor.callAsync('spotlight', query);
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('directory', {
    authRequired: true,
    validateParams: rest_typings_1.isDirectoryProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, query } = yield this.parseJsonQuery();
            const { text, type, workspace = 'local' } = this.queryParams;
            const filter = Object.assign(Object.assign(Object.assign(Object.assign({}, (query ? Object.assign({}, query) : {})), (text ? { text } : {})), (type ? { type } : {})), (workspace ? { workspace } : {}));
            if (sort && Object.keys(sort).length > 1) {
                return api_1.API.v1.failure('This method support only one "sort" parameter');
            }
            const sortBy = sort ? Object.keys(sort)[0] : undefined;
            const sortDirection = sort && Object.values(sort)[0] === 1 ? 'asc' : 'desc';
            const result = yield meteor_1.Meteor.callAsync('browseChannels', Object.assign(Object.assign({}, filter), { sortBy,
                sortDirection, offset: Math.max(0, offset), limit: Math.max(0, count) }));
            if (!result) {
                return api_1.API.v1.failure('Please verify the parameters');
            }
            return api_1.API.v1.success({
                result: result.results,
                count: result.results.length,
                offset,
                total: result.total,
            });
        });
    },
});
api_1.API.v1.addRoute('pw.getPolicy', {
    authRequired: false,
}, {
    get() {
        return api_1.API.v1.success(server_1.passwordPolicy.getPasswordPolicy());
    },
});
/**
 * @openapi
 *  /api/v1/stdout.queue:
 *    get:
 *      description: Retrieves last 1000 lines of server logs
 *      security:
 *        - authenticated: ['view-logs']
 *      responses:
 *        200:
 *          description: The user data of the authenticated user
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/ApiSuccessV1'
 *                  - type: object
 *                    properties:
 *                      queue:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            string:
 *                              type: string
 *                            ts:
 *                              type: string
 *                              format: date-time
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('stdout.queue', { authRequired: true, permissionsRequired: ['view-logs'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({ queue: (0, stdout_1.getLogs)() });
        });
    },
});
const mountResult = ({ id, error, result, }) => ({
    message: ejson_1.default.stringify({
        msg: 'result',
        id,
        error: error,
        result: result,
    }),
});
// had to create two different endpoints for authenticated and non-authenticated calls
// because restivus does not provide 'this.userId' if 'authRequired: false'
api_1.API.v1.addRoute('method.call/:method', {
    authRequired: true,
    rateLimiterOptions: false,
    validateParams: rest_typings_1.isMeteorCall,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                message: String,
            });
            const data = ejson_1.default.parse(this.bodyParams.message);
            if (!(0, rest_typings_1.isMethodCallProps)(data)) {
                return api_1.API.v1.failure('Invalid method call');
            }
            const { method, params, id } = data;
            const connectionId = this.token ||
                crypto_1.default
                    .createHash('md5')
                    .update(this.requestIp + this.user._id)
                    .digest('hex');
            const rateLimiterInput = {
                userId: this.userId,
                clientAddress: this.requestIp,
                type: 'method',
                name: method,
                connectionId,
            };
            try {
                ddp_rate_limiter_1.DDPRateLimiter._increment(rateLimiterInput);
                const rateLimitResult = ddp_rate_limiter_1.DDPRateLimiter._check(rateLimiterInput);
                if (!rateLimitResult.allowed) {
                    throw new meteor_1.Meteor.Error('too-many-requests', ddp_rate_limiter_1.DDPRateLimiter.getErrorMessage(rateLimitResult), {
                        timeToReset: rateLimitResult.timeToReset,
                    });
                }
                const result = yield meteor_1.Meteor.callAsync(method, ...params);
                return api_1.API.v1.success(mountResult({ id, result }));
            }
            catch (err) {
                if (!err.isClientSafe && !err.meteorError) {
                    system_1.SystemLogger.error({ msg: `Exception while invoking method ${method}`, err });
                }
                if (server_2.settings.get('Log_Level') === '2') {
                    meteor_1.Meteor._debug(`Exception while invoking method ${method}`, err);
                }
                return api_1.API.v1.success(mountResult({ id, error: err }));
            }
        });
    },
});
api_1.API.v1.addRoute('method.callAnon/:method', {
    authRequired: false,
    rateLimiterOptions: false,
    validateParams: rest_typings_1.isMeteorCall,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                message: String,
            });
            const data = ejson_1.default.parse(this.bodyParams.message);
            if (!(0, rest_typings_1.isMethodCallAnonProps)(data)) {
                return api_1.API.v1.failure('Invalid method call');
            }
            const { method, params, id } = data;
            const connectionId = this.token || crypto_1.default.createHash('md5').update(this.requestIp).digest('hex');
            const rateLimiterInput = {
                userId: this.userId || undefined,
                clientAddress: this.requestIp,
                type: 'method',
                name: method,
                connectionId,
            };
            try {
                ddp_rate_limiter_1.DDPRateLimiter._increment(rateLimiterInput);
                const rateLimitResult = ddp_rate_limiter_1.DDPRateLimiter._check(rateLimiterInput);
                if (!rateLimitResult.allowed) {
                    throw new meteor_1.Meteor.Error('too-many-requests', ddp_rate_limiter_1.DDPRateLimiter.getErrorMessage(rateLimitResult), {
                        timeToReset: rateLimitResult.timeToReset,
                    });
                }
                const result = yield meteor_1.Meteor.callAsync(method, ...params);
                return api_1.API.v1.success(mountResult({ id, result }));
            }
            catch (err) {
                if (!err.isClientSafe && !err.meteorError) {
                    system_1.SystemLogger.error({ msg: `Exception while invoking method ${method}`, err });
                }
                if (server_2.settings.get('Log_Level') === '2') {
                    meteor_1.Meteor._debug(`Exception while invoking method ${method}`, err);
                }
                return api_1.API.v1.success(mountResult({ id, error: err }));
            }
        });
    },
});
api_1.API.v1.addRoute('smtp.check', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({ isSMTPConfigured: (0, isSMTPConfigured_1.isSMTPConfigured)() });
        });
    },
});
/**
 * @openapi
 *  /api/v1/fingerprint:
 *    post:
 *      description: Update Fingerprint definition as a new workspace or update of configuration
 *      security:
 *        $ref: '#/security/authenticated'
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                setDeploymentAs:
 *                  type: string
 *            example: |
 *              {
 *                 "setDeploymentAs": "new-workspace"
 *              }
 *      responses:
 *        200:
 *          description: Workspace successfully configured
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiSuccessV1'
 *        default:
 *          description: Unexpected error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiFailureV1'
 */
api_1.API.v1.addRoute('fingerprint', {
    authRequired: true,
    validateParams: rest_typings_1.isFingerprintProps,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                setDeploymentAs: String,
            });
            const settingsIds = [];
            if (this.bodyParams.setDeploymentAs === 'new-workspace') {
                yield models_1.WorkspaceCredentials.removeAllCredentials();
                settingsIds.push('Cloud_Service_Agree_PrivacyTerms', 'Cloud_Workspace_Id', 'Cloud_Workspace_Name', 'Cloud_Workspace_Client_Id', 'Cloud_Workspace_Client_Secret', 'Cloud_Workspace_Client_Secret_Expires_At', 'Cloud_Workspace_Registration_Client_Uri', 'Cloud_Workspace_PublicKey', 'Cloud_Workspace_License', 'Cloud_Workspace_Had_Trial', 'uniqueID');
            }
            settingsIds.push('Deployment_FingerPrint_Verified');
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            });
            const promises = settingsIds.map((settingId) => {
                if (settingId === 'uniqueID') {
                    return auditSettingOperation(models_1.Settings.resetValueById, 'uniqueID', process.env.DEPLOYMENT_ID || (0, uuid_1.v4)());
                }
                if (settingId === 'Cloud_Workspace_Access_Token_Expires_At') {
                    return auditSettingOperation(models_1.Settings.resetValueById, 'Cloud_Workspace_Access_Token_Expires_At', new Date(0));
                }
                if (settingId === 'Deployment_FingerPrint_Verified') {
                    return auditSettingOperation(models_1.Settings.updateValueById, 'Deployment_FingerPrint_Verified', true);
                }
                return (0, auditedSettingUpdates_1.resetAuditedSettingByUser)({
                    _id: this.userId,
                    username: this.user.username,
                    ip: this.requestIp,
                    useragent: this.request.headers['user-agent'] || '',
                })(models_1.Settings.resetValueById, settingId);
            });
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(settingsIds[index]);
                }
            });
            return api_1.API.v1.success({});
        });
    },
});
