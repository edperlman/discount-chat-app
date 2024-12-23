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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = exports.APIClass = exports.defaultRateLimiterOptions = void 0;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const tracing_1 = require("@rocket.chat/tracing");
const accounts_base_1 = require("meteor/accounts-base");
const ddp_1 = require("meteor/ddp");
const ddp_common_1 = require("meteor/ddp-common");
const meteor_1 = require("meteor/meteor");
const rate_limit_1 = require("meteor/rate-limit");
const rocketchat_restivus_1 = require("meteor/rocketchat:restivus");
const underscore_1 = __importDefault(require("underscore"));
const api_helpers_1 = require("./api.helpers");
const getUserInfo_1 = require("./helpers/getUserInfo");
const parseJsonQuery_1 = require("./helpers/parseJsonQuery");
const isObject_1 = require("../../../lib/utils/isObject");
const getNestedProp_1 = require("../../../server/lib/getNestedProp");
const logPayloads_1 = require("../../../server/lib/logger/logPayloads");
const code_1 = require("../../2fa/server/code");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_1 = require("../../metrics/server");
const server_2 = require("../../settings/server");
const getDefaultUserFields_1 = require("../../utils/server/functions/getDefaultUserFields");
const logger = new logger_1.Logger('API');
exports.defaultRateLimiterOptions = {
    numRequestsAllowed: server_2.settings.get('API_Enable_Rate_Limiter_Limit_Calls_Default'),
    intervalTimeInMS: server_2.settings.get('API_Enable_Rate_Limiter_Limit_Time_Default'),
};
const rateLimiterDictionary = {};
const getRequestIP = (req) => {
    var _a, _b;
    const socket = req.socket || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.socket);
    const remoteAddress = req.headers['x-real-ip'] || (typeof socket !== 'string' && ((socket === null || socket === void 0 ? void 0 : socket.remoteAddress) || ((_b = req.connection) === null || _b === void 0 ? void 0 : _b.remoteAddress) || null));
    let forwardedFor = req.headers['x-forwarded-for'];
    if (!socket) {
        return remoteAddress || forwardedFor || null;
    }
    const httpForwardedCount = parseInt(String(process.env.HTTP_FORWARDED_COUNT)) || 0;
    if (httpForwardedCount <= 0) {
        return remoteAddress;
    }
    if (!forwardedFor || typeof forwardedFor.valueOf() !== 'string') {
        return remoteAddress;
    }
    forwardedFor = forwardedFor.trim().split(/\s*,\s*/);
    if (httpForwardedCount > forwardedFor.length) {
        return remoteAddress;
    }
    return forwardedFor[forwardedFor.length - httpForwardedCount];
};
const generateConnection = (ipAddress, httpHeaders) => ({
    id: random_1.Random.id(),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close() { },
    httpHeaders,
    clientAddress: ipAddress,
});
let prometheusAPIUserAgent = false;
class APIClass extends rocketchat_restivus_1.Restivus {
    constructor(properties) {
        super(properties);
        this.helperMethods = new Map();
        this.apiPath = properties.apiPath;
        this.authMethods = [];
        this.fieldSeparator = '.';
        this.defaultFieldsToExclude = {
            joinCode: 0,
            members: 0,
            importIds: 0,
            e2e: 0,
        };
        this.defaultLimitedUserFieldsToExclude = {
            avatarOrigin: 0,
            emails: 0,
            phone: 0,
            statusConnection: 0,
            createdAt: 0,
            lastLogin: 0,
            services: 0,
            requirePasswordChange: 0,
            requirePasswordChangeReason: 0,
            roles: 0,
            statusDefault: 0,
            _updatedAt: 0,
            settings: 0,
            inviteToken: 0,
        };
        this.limitedUserFieldsToExclude = this.defaultLimitedUserFieldsToExclude;
        this.limitedUserFieldsToExcludeIfIsPrivilegedUser = {
            services: 0,
            inviteToken: 0,
        };
    }
    setLimitedCustomFields(customFields) {
        const nonPublicFieds = customFields.reduce((acc, customField) => {
            acc[`customFields.${customField}`] = 0;
            return acc;
        }, {});
        this.limitedUserFieldsToExclude = Object.assign(Object.assign({}, this.defaultLimitedUserFieldsToExclude), nonPublicFieds);
    }
    parseJsonQuery() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, parseJsonQuery_1.parseJsonQuery)(this);
        });
    }
    addAuthMethod(func) {
        this.authMethods.push(func);
    }
    shouldAddRateLimitToRoute(options) {
        const { version } = this._config;
        const { rateLimiterOptions } = options;
        return ((typeof rateLimiterOptions === 'object' || rateLimiterOptions === undefined) &&
            Boolean(version) &&
            !process.env.TEST_MODE &&
            Boolean(exports.defaultRateLimiterOptions.numRequestsAllowed && exports.defaultRateLimiterOptions.intervalTimeInMS));
    }
    success(result = {}) {
        if ((0, isObject_1.isObject)(result)) {
            result.success = true;
        }
        const finalResult = {
            statusCode: 200,
            body: result,
        };
        return finalResult;
    }
    failure(result, errorType, stack, error) {
        const response = { statusCode: 400, body: result };
        if ((0, isObject_1.isObject)(result)) {
            response.body.success = false;
        }
        else {
            response.body = {
                success: false,
                error: result,
                stack,
            };
            if (errorType) {
                response.body.errorType = errorType;
            }
            if (error && typeof error === 'object' && 'details' in error && (error === null || error === void 0 ? void 0 : error.details)) {
                try {
                    response.body.details = JSON.parse(error.details);
                }
                catch (e) {
                    response.body.details = error.details;
                }
            }
        }
        return response;
    }
    notFound(msg) {
        return {
            statusCode: 404,
            body: {
                success: false,
                error: msg || 'Resource not found',
            },
        };
    }
    internalError(msg) {
        return {
            statusCode: 500,
            body: {
                success: false,
                error: msg || 'Internal error occured',
            },
        };
    }
    unauthorized(msg) {
        return {
            statusCode: 403,
            body: {
                success: false,
                error: msg || 'unauthorized',
            },
        };
    }
    tooManyRequests(msg) {
        return {
            statusCode: 429,
            body: {
                success: false,
                error: msg || 'Too many requests',
            },
        };
    }
    getRateLimiter(route) {
        return rateLimiterDictionary[route];
    }
    shouldVerifyRateLimit(route, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (rateLimiterDictionary.hasOwnProperty(route) &&
                server_2.settings.get('API_Enable_Rate_Limiter') === true &&
                (process.env.NODE_ENV !== 'development' || server_2.settings.get('API_Enable_Rate_Limiter_Dev') === true) &&
                !(userId && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'api-bypass-rate-limit'))));
        });
    }
    enforceRateLimit(objectForRateLimitMatch, _, response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.shouldVerifyRateLimit(objectForRateLimitMatch.route, userId))) {
                return;
            }
            rateLimiterDictionary[objectForRateLimitMatch.route].rateLimiter.increment(objectForRateLimitMatch);
            const attemptResult = yield rateLimiterDictionary[objectForRateLimitMatch.route].rateLimiter.check(objectForRateLimitMatch);
            const timeToResetAttempsInSeconds = Math.ceil(attemptResult.timeToReset / 1000);
            response.setHeader('X-RateLimit-Limit', rateLimiterDictionary[objectForRateLimitMatch.route].options.numRequestsAllowed);
            response.setHeader('X-RateLimit-Remaining', attemptResult.numInvocationsLeft);
            response.setHeader('X-RateLimit-Reset', new Date().getTime() + attemptResult.timeToReset);
            if (!attemptResult.allowed) {
                throw new meteor_1.Meteor.Error('error-too-many-requests', `Error, too many requests. Please slow down. You must wait ${timeToResetAttempsInSeconds} seconds before trying this endpoint again.`, {
                    timeToReset: attemptResult.timeToReset,
                    seconds: timeToResetAttempsInSeconds,
                });
            }
        });
    }
    reloadRoutesToRefreshRateLimiter() {
        const { version } = this._config;
        this._routes.forEach((route) => {
            if (this.shouldAddRateLimitToRoute(route.options)) {
                this.addRateLimiterRuleForRoutes({
                    routes: [route.path],
                    rateLimiterOptions: route.options.rateLimiterOptions || exports.defaultRateLimiterOptions,
                    endpoints: Object.keys(route.endpoints).filter((endpoint) => endpoint !== 'options'),
                    apiVersion: version,
                });
            }
        });
    }
    addRateLimiterRuleForRoutes({ routes, rateLimiterOptions, endpoints, apiVersion, }) {
        if (typeof rateLimiterOptions !== 'object') {
            throw new meteor_1.Meteor.Error('"rateLimiterOptions" must be an object');
        }
        if (!rateLimiterOptions.numRequestsAllowed) {
            throw new meteor_1.Meteor.Error('You must set "numRequestsAllowed" property in rateLimiter for REST API endpoint');
        }
        if (!rateLimiterOptions.intervalTimeInMS) {
            throw new meteor_1.Meteor.Error('You must set "intervalTimeInMS" property in rateLimiter for REST API endpoint');
        }
        const addRateLimitRuleToEveryRoute = (routes) => {
            routes.forEach((route) => {
                rateLimiterDictionary[route] = {
                    rateLimiter: new rate_limit_1.RateLimiter(),
                    options: rateLimiterOptions,
                };
                const rateLimitRule = {
                    IPAddr: (input) => input,
                    route,
                };
                rateLimiterDictionary[route].rateLimiter.addRule(rateLimitRule, rateLimiterOptions.numRequestsAllowed, rateLimiterOptions.intervalTimeInMS);
            });
        };
        routes.map((route) => this.namedRoutes(route, endpoints, apiVersion)).map(addRateLimitRuleToEveryRoute);
    }
    processTwoFactor(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, request, invocation, options, connection, }) {
            if (options && (!('twoFactorRequired' in options) || !options.twoFactorRequired)) {
                return;
            }
            const code = request.headers['x-2fa-code'];
            const method = request.headers['x-2fa-method'];
            yield (0, code_1.checkCodeForUser)({
                user: userId,
                code,
                method,
                options: options && 'twoFactorOptions' in options ? options.twoFactorOptions || {} : {},
                connection,
            });
            invocation.twoFactorChecked = true;
        });
    }
    getFullRouteName(route, method, apiVersion) {
        let prefix = `/${this.apiPath || ''}`;
        if (apiVersion) {
            prefix += `${apiVersion}/`;
        }
        return `${prefix}${route}${method}`;
    }
    namedRoutes(route, endpoints, apiVersion) {
        const routeActions = Array.isArray(endpoints) ? endpoints : Object.keys(endpoints);
        return routeActions.map((action) => this.getFullRouteName(route, action, apiVersion));
    }
    addRoute(subpaths, options, endpoints) {
        // Note: required if the developer didn't provide options
        if (endpoints === undefined) {
            endpoints = options;
            options = {};
        }
        const operations = endpoints;
        const shouldVerifyPermissions = (0, api_helpers_1.checkPermissions)(options);
        // Allow for more than one route using the same option and endpoints
        if (!Array.isArray(subpaths)) {
            subpaths = [subpaths];
        }
        const { version } = this._config;
        if (this.shouldAddRateLimitToRoute(options)) {
            this.addRateLimiterRuleForRoutes({
                routes: subpaths,
                rateLimiterOptions: options.rateLimiterOptions || exports.defaultRateLimiterOptions,
                endpoints: operations,
                apiVersion: version,
            });
        }
        subpaths.forEach((route) => {
            // Note: This is required due to Restivus calling `addRoute` in the constructor of itself
            Object.keys(operations).forEach((method) => {
                const _options = Object.assign({}, options);
                if (typeof operations[method] === 'function') {
                    operations[method] = {
                        action: operations[method],
                    };
                }
                else {
                    const extraOptions = Object.assign({}, operations[method]);
                    delete extraOptions.action;
                    Object.assign(_options, extraOptions);
                }
                // Add a try/catch for each endpoint
                const originalAction = operations[method].action;
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const api = this;
                operations[method].action =
                    function _internalRouteActionHandler() {
                        return __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            const rocketchatRestApiEnd = server_1.metrics.rocketchatRestApi.startTimer(Object.assign(Object.assign({ method,
                                version }, (prometheusAPIUserAgent && { user_agent: this.request.headers['user-agent'] })), { entrypoint: route.startsWith('method.call') ? decodeURIComponent(this.request._parsedUrl.pathname.slice(8)) : route }));
                            this.requestIp = getRequestIP(this.request);
                            const startTime = Date.now();
                            const log = logger.logger.child(Object.assign({ method: this.request.method, url: this.request.url, userId: this.request.headers['x-user-id'], userAgent: this.request.headers['user-agent'], length: this.request.headers['content-length'], host: this.request.headers.host, referer: this.request.headers.referer, remoteIP: this.requestIp }, (0, logPayloads_1.getRestPayload)(this.request.body)));
                            // If the endpoint requires authentication only if anonymous read is disabled, load the user info if it was provided
                            if (!options.authRequired && options.authOrAnonRequired) {
                                const { 'x-user-id': userId, 'x-auth-token': userToken } = this.request.headers;
                                if (userId && userToken) {
                                    this.user = yield models_1.Users.findOne({
                                        'services.resume.loginTokens.hashedToken': accounts_base_1.Accounts._hashLoginToken(userToken),
                                        '_id': userId,
                                    }, {
                                        projection: (0, getDefaultUserFields_1.getDefaultUserFields)(),
                                    });
                                    this.userId = (_a = this.user) === null || _a === void 0 ? void 0 : _a._id;
                                }
                                if (!this.user && !server_2.settings.get('Accounts_AllowAnonymousRead')) {
                                    return {
                                        statusCode: 401,
                                        body: {
                                            status: 'error',
                                            message: 'You must be logged in to do this.',
                                        },
                                    };
                                }
                            }
                            const objectForRateLimitMatch = {
                                IPAddr: this.requestIp,
                                route: `${this.request.route}${this.request.method.toLowerCase()}`,
                            };
                            let result;
                            const connection = Object.assign(Object.assign({}, generateConnection(this.requestIp, this.request.headers)), { token: this.token });
                            try {
                                if (options.deprecation) {
                                    (0, api_helpers_1.parseDeprecation)(this, options.deprecation);
                                }
                                yield api.enforceRateLimit(objectForRateLimitMatch, this.request, this.response, this.userId);
                                if (_options.validateParams) {
                                    const requestMethod = this.request.method;
                                    const validatorFunc = typeof _options.validateParams === 'function' ? _options.validateParams : _options.validateParams[requestMethod];
                                    if (validatorFunc && !validatorFunc(requestMethod === 'GET' ? this.queryParams : this.bodyParams)) {
                                        throw new meteor_1.Meteor.Error('invalid-params', (_b = validatorFunc.errors) === null || _b === void 0 ? void 0 : _b.map((error) => error.message).join('\n '));
                                    }
                                }
                                if (shouldVerifyPermissions &&
                                    (!this.userId ||
                                        !(yield (0, api_helpers_1.checkPermissionsForInvocation)(this.userId, _options.permissionsRequired, this.request.method)))) {
                                    throw new meteor_1.Meteor.Error('error-unauthorized', 'User does not have the permissions required for this action', {
                                        permissions: _options.permissionsRequired,
                                    });
                                }
                                const invocation = new ddp_common_1.DDPCommon.MethodInvocation({
                                    connection,
                                    isSimulation: false,
                                    userId: this.userId,
                                });
                                accounts_base_1.Accounts._accountData[connection.id] = {
                                    connection,
                                };
                                accounts_base_1.Accounts._setAccountData(connection.id, 'loginToken', this.token);
                                yield api.processTwoFactor({
                                    userId: this.userId,
                                    request: this.request,
                                    invocation: invocation,
                                    options: _options,
                                    connection: connection,
                                });
                                this.queryOperations = options.queryOperations;
                                this.queryFields = options.queryFields;
                                this.parseJsonQuery = api.parseJsonQuery.bind(this);
                                result = yield (0, tracing_1.tracerSpan)(`${this.request.method} ${this.request.url}`, {
                                    attributes: {
                                        url: this.request.url,
                                        route: this.request.route,
                                        method: this.request.method,
                                        userId: this.userId,
                                    },
                                }, (span) => __awaiter(this, void 0, void 0, function* () {
                                    if (span) {
                                        this.response.setHeader('X-Trace-Id', span.spanContext().traceId);
                                    }
                                    const result = (yield ddp_1.DDP._CurrentInvocation.withValue(invocation, () => __awaiter(this, void 0, void 0, function* () { return originalAction.apply(this); }))) || exports.API.v1.success();
                                    span === null || span === void 0 ? void 0 : span.setAttribute('status', result.statusCode);
                                    return result;
                                }));
                                log.http({
                                    status: result.statusCode,
                                    responseTime: Date.now() - startTime,
                                });
                            }
                            catch (e) {
                                const apiMethod = {
                                    'error-too-many-requests': 'tooManyRequests',
                                    'error-unauthorized': 'unauthorized',
                                }[e.error] || 'failure';
                                result = exports.API.v1[apiMethod](typeof e === 'string' ? e : e.message, e.error, process.env.TEST_MODE ? e.stack : undefined, e);
                                log.http({
                                    err: e,
                                    status: result.statusCode,
                                    responseTime: Date.now() - startTime,
                                });
                            }
                            finally {
                                delete accounts_base_1.Accounts._accountData[connection.id];
                            }
                            rocketchatRestApiEnd({
                                status: result.statusCode,
                            });
                            return result;
                        });
                    };
                // Allow the endpoints to make usage of the logger which respects the user's settings
                operations[method].logger = logger;
            });
            super.addRoute(route, options, operations);
        });
    }
    updateRateLimiterDictionaryForRoute(route, numRequestsAllowed, intervalTimeInMS) {
        var _a;
        if (rateLimiterDictionary[route]) {
            rateLimiterDictionary[route].options.numRequestsAllowed =
                numRequestsAllowed !== null && numRequestsAllowed !== void 0 ? numRequestsAllowed : rateLimiterDictionary[route].options.numRequestsAllowed;
            rateLimiterDictionary[route].options.intervalTimeInMS = intervalTimeInMS !== null && intervalTimeInMS !== void 0 ? intervalTimeInMS : rateLimiterDictionary[route].options.intervalTimeInMS;
            (_a = exports.API.v1) === null || _a === void 0 ? void 0 : _a.reloadRoutesToRefreshRateLimiter();
        }
    }
    _initAuth() {
        const loginCompatibility = (bodyParams, request) => {
            // Grab the username or email that the user is logging in with
            const { user, username, email, password, code: bodyCode } = bodyParams;
            let usernameToLDAPLogin = '';
            if (password == null) {
                return bodyParams;
            }
            if (underscore_1.default.without(Object.keys(bodyParams), 'user', 'username', 'email', 'password', 'code').length > 0) {
                return bodyParams;
            }
            const code = bodyCode || request.headers['x-2fa-code'];
            const auth = {
                password,
            };
            if (typeof user === 'string') {
                auth.user = user.includes('@') ? { email: user } : { username: user };
                usernameToLDAPLogin = user;
            }
            else if (username) {
                auth.user = { username };
                usernameToLDAPLogin = username;
            }
            else if (email) {
                auth.user = { email };
                usernameToLDAPLogin = email;
            }
            if (auth.user == null) {
                return bodyParams;
            }
            if (auth.password.hashed) {
                auth.password = {
                    digest: auth.password,
                    algorithm: 'sha-256',
                };
            }
            const objectToLDAPLogin = {
                ldap: true,
                username: usernameToLDAPLogin,
                ldapPass: auth.password,
                ldapOptions: {},
            };
            if (server_2.settings.get('LDAP_Enable') && !code) {
                return objectToLDAPLogin;
            }
            if (code) {
                return {
                    totp: {
                        code,
                        login: server_2.settings.get('LDAP_Enable') ? objectToLDAPLogin : auth,
                    },
                };
            }
            return auth;
        };
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this.addRoute('login', { authRequired: false }, {
            post() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const request = this.request;
                    const args = loginCompatibility(this.bodyParams, request);
                    const invocation = new ddp_common_1.DDPCommon.MethodInvocation({
                        connection: generateConnection(getRequestIP(request) || '', this.request.headers),
                    });
                    let auth;
                    try {
                        auth = yield ddp_1.DDP._CurrentInvocation.withValue(invocation, () => __awaiter(this, void 0, void 0, function* () { return meteor_1.Meteor.callAsync('login', args); }));
                    }
                    catch (error) {
                        let e = error;
                        if (error.reason === 'User not found') {
                            e = {
                                error: 'Unauthorized',
                                reason: 'Unauthorized',
                            };
                        }
                        return {
                            statusCode: 401,
                            body: {
                                status: 'error',
                                error: e.error,
                                details: e.details,
                                message: e.reason || e.message,
                            },
                        };
                    }
                    this.user = yield models_1.Users.findOne({
                        _id: auth.id,
                    }, {
                        projection: (0, getDefaultUserFields_1.getDefaultUserFields)(),
                    });
                    this.userId = (_a = this.user) === null || _a === void 0 ? void 0 : _a._id;
                    const response = {
                        status: 'success',
                        data: {
                            userId: this.userId,
                            authToken: auth.token,
                            me: yield (0, getUserInfo_1.getUserInfo)(this.user || {}),
                        },
                    };
                    const extraData = (_b = self._config.onLoggedIn) === null || _b === void 0 ? void 0 : _b.call(this);
                    if (extraData != null) {
                        underscore_1.default.extend(response.data, {
                            extra: extraData,
                        });
                    }
                    return response;
                });
            },
        });
        const logout = function () {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                // Remove the given auth token from the user's account
                const authToken = this.request.headers['x-auth-token'];
                const hashedToken = accounts_base_1.Accounts._hashLoginToken(authToken);
                const tokenLocation = (_b = (_a = self._config) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
                const index = (tokenLocation === null || tokenLocation === void 0 ? void 0 : tokenLocation.lastIndexOf('.')) || 0;
                const tokenPath = (tokenLocation === null || tokenLocation === void 0 ? void 0 : tokenLocation.substring(0, index)) || '';
                const tokenFieldName = (tokenLocation === null || tokenLocation === void 0 ? void 0 : tokenLocation.substring(index + 1)) || '';
                const tokenToRemove = {};
                tokenToRemove[tokenFieldName] = hashedToken;
                const tokenRemovalQuery = {};
                tokenRemovalQuery[tokenPath] = tokenToRemove;
                yield models_1.Users.updateOne({ _id: this.user._id }, {
                    $pull: tokenRemovalQuery,
                });
                // TODO this can be optmized so places that care about loginTokens being removed are invoked directly
                // instead of having to listen to every watch.users event
                void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
                    const userTokens = yield models_1.Users.findOneById(this.user._id, { projection: { [tokenPath]: 1 } });
                    if (!userTokens) {
                        return;
                    }
                    const diff = { [tokenPath]: (0, getNestedProp_1.getNestedProp)(userTokens, tokenPath) };
                    return { clientAction: 'updated', id: this.user._id, diff };
                }));
                const response = {
                    status: 'success',
                    data: {
                        message: "You've been logged out!",
                    },
                };
                // Call the logout hook with the authenticated user attached
                const extraData = (_c = self._config.onLoggedOut) === null || _c === void 0 ? void 0 : _c.call(this);
                if (extraData != null) {
                    underscore_1.default.extend(response.data, {
                        extra: extraData,
                    });
                }
                return response;
            });
        };
        /*
            Add a logout endpoint to the API
            After the user is logged out, the onLoggedOut hook is called (see Restfully.configure() for
            adding hook).
        */
        return this.addRoute('logout', {
            authRequired: true,
        }, {
            get() {
                return __awaiter(this, void 0, void 0, function* () {
                    console.warn('Warning: Default logout via GET will be removed in Restivus v1.0. Use POST instead.');
                    console.warn('    See https://github.com/kahmali/meteor-restivus/issues/100');
                    return logout.call(this);
                });
            },
            post() {
                return __awaiter(this, void 0, void 0, function* () {
                    return logout.call(this);
                });
            },
        });
    }
}
exports.APIClass = APIClass;
const getUserAuth = function _getUserAuth(...args) {
    const invalidResults = [undefined, null, false];
    return {
        token: 'services.resume.loginTokens.hashedToken',
        user() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                var _d, _e;
                if ((_d = this.bodyParams) === null || _d === void 0 ? void 0 : _d.payload) {
                    this.bodyParams = JSON.parse(this.bodyParams.payload);
                }
                try {
                    for (var _f = true, _g = __asyncValues(((_e = exports.API.v1) === null || _e === void 0 ? void 0 : _e.authMethods) || []), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                        _c = _h.value;
                        _f = false;
                        const method = _c;
                        if (typeof method === 'function') {
                            const result = yield method.apply(this, args);
                            if (!invalidResults.includes(result)) {
                                return result;
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                let token;
                if (this.request.headers['x-auth-token']) {
                    token = accounts_base_1.Accounts._hashLoginToken(this.request.headers['x-auth-token']);
                }
                this.token = token || '';
                return {
                    userId: this.request.headers['x-user-id'],
                    token,
                };
            });
        },
    };
};
const defaultOptionsEndpoint = function _defaultOptionsEndpoint() {
    return __awaiter(this, void 0, void 0, function* () {
        // check if a pre-flight request
        if (!this.request.headers['access-control-request-method'] && !this.request.headers.origin) {
            this.done();
            return;
        }
        if (!server_2.settings.get('API_Enable_CORS')) {
            this.response.writeHead(405);
            this.response.write('CORS not enabled. Go to "Admin > General > REST Api" to enable it.');
            this.done();
            return;
        }
        const CORSOriginSetting = String(server_2.settings.get('API_CORS_Origin'));
        const defaultHeaders = {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD, PATCH',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, X-User-Id, X-Auth-Token, x-visitor-token, Authorization',
        };
        if (CORSOriginSetting === '*') {
            this.response.writeHead(200, Object.assign({ 'Access-Control-Allow-Origin': '*' }, defaultHeaders));
            this.done();
            return;
        }
        const origins = CORSOriginSetting.trim()
            .split(',')
            .map((origin) => String(origin).trim().toLocaleLowerCase());
        // if invalid origin reply without required CORS headers
        if (!origins.includes(this.request.headers.origin)) {
            this.done();
            return;
        }
        this.response.writeHead(200, Object.assign({ 'Access-Control-Allow-Origin': this.request.headers.origin, 'Vary': 'Origin' }, defaultHeaders));
        this.done();
    });
};
const createApi = function _createApi(options = {}) {
    return new APIClass(Object.assign({
        apiPath: 'api/',
        useDefaultAuth: true,
        prettyJson: process.env.NODE_ENV === 'development',
        defaultOptionsEndpoint,
        auth: getUserAuth(),
    }, options));
};
exports.API = {
    getUserAuth,
    ApiClass: APIClass,
    v1: createApi({
        version: 'v1',
    }),
    default: createApi(),
};
// register the API to be re-created once the CORS-setting changes.
server_2.settings.watchMultiple(['API_Enable_CORS', 'API_CORS_Origin'], () => {
    exports.API.v1 = createApi({
        version: 'v1',
    });
    exports.API.default = createApi();
});
server_2.settings.watch('Accounts_CustomFields', (value) => {
    var _a;
    if (!value) {
        return (_a = exports.API.v1) === null || _a === void 0 ? void 0 : _a.setLimitedCustomFields([]);
    }
    try {
        const customFields = JSON.parse(value);
        const nonPublicCustomFields = Object.keys(customFields).filter((customFieldKey) => customFields[customFieldKey].public !== true);
        exports.API.v1.setLimitedCustomFields(nonPublicCustomFields);
    }
    catch (error) {
        console.warn('Invalid Custom Fields', error);
    }
});
server_2.settings.watch('API_Enable_Rate_Limiter_Limit_Time_Default', (value) => {
    exports.defaultRateLimiterOptions.intervalTimeInMS = value;
    exports.API.v1.reloadRoutesToRefreshRateLimiter();
});
server_2.settings.watch('API_Enable_Rate_Limiter_Limit_Calls_Default', (value) => {
    exports.defaultRateLimiterOptions.numRequestsAllowed = value;
    exports.API.v1.reloadRoutesToRefreshRateLimiter();
});
server_2.settings.watch('Prometheus_API_User_Agent', (value) => {
    prometheusAPIUserAgent = value;
});
