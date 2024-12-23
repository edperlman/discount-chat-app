"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OAuth2Server = void 0;
const models_1 = require("@rocket.chat/models");
const express_1 = __importDefault(require("express"));
const accounts_base_1 = require("meteor/accounts-base");
const oauth2_server_1 = __importStar(require("oauth2-server"));
const model_1 = require("./model");
class OAuth2Server {
    constructor(config) {
        if (config == null) {
            config = {};
        }
        this.config = config;
        this.app = (0, express_1.default)();
        this.oauth = new oauth2_server_1.default({
            model: new model_1.Model(this.config),
        });
        this.initRoutes();
        return this;
    }
    initRoutes() {
        const { config, oauth } = this;
        const debugMiddleware = function (req, _res, next) {
            if (config.debug === true) {
                console.log('[OAuth2Server]', req.method, req.url);
            }
            return next();
        };
        const handleResponse = function (res, response, next) {
            var _a;
            if (response.status === 302 && ((_a = response.headers) === null || _a === void 0 ? void 0 : _a.location)) {
                const { location } = response.headers;
                delete response.headers.location;
                res.set(response.headers);
                res.redirect(location);
            }
            else if (response.status) {
                res.set(response.headers);
                res.status(response.status).send(response.body);
            }
            else {
                next();
            }
        };
        // Transforms requests which are POST and aren't "x-www-form-urlencoded" content type
        // and they pass the required information as query strings
        const transformRequestsNotUsingFormUrlencodedType = function (req, _res, next) {
            if (!req.is('application/x-www-form-urlencoded') && req.method === 'POST') {
                if (config.debug === true) {
                    console.log('[OAuth2Server]', 'Transforming a request to form-urlencoded with the query going to the body.');
                }
                req.headers['content-type'] = 'application/x-www-form-urlencoded';
                req.body = Object.assign({}, req.body, req.query);
            }
            return next();
        };
        this.app.all('/oauth/token', debugMiddleware, transformRequestsNotUsingFormUrlencodedType, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const request = new oauth2_server_1.default.Request(req);
            const response = new oauth2_server_1.default.Response(res);
            try {
                yield oauth.token(request, response);
                handleResponse(res, response, next);
            }
            catch (e) {
                next(e);
            }
        }));
        this.app.get('/oauth/authorize', debugMiddleware, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (typeof req.query.client_id !== 'string') {
                return res.redirect('/oauth/error/404');
            }
            const client = yield models_1.OAuthApps.findOneActiveByClientId(req.query.client_id);
            if (client == null) {
                return res.redirect('/oauth/error/404');
            }
            const redirectUris = client.redirectUri.split(',');
            if (typeof req.query.redirect_uri === 'string' && !redirectUris.includes(req.query.redirect_uri)) {
                return res.redirect('/oauth/error/invalid_redirect_uri');
            }
            return next();
        }));
        this.app.post('/oauth/authorize', debugMiddleware, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.allow !== 'yes') {
                res.status(401);
                return res.send({ error: 'access_denied', error_description: 'The user denied access to your application' });
            }
            // The new version of the library is expecting a new name. Doing this for compatibility
            if (req.body.token && !req.body.access_token) {
                req.body.access_token = req.body.token;
            }
            if (req.body.access_token == null) {
                return res.status(401).send('No token');
            }
            const user = yield models_1.Users.findOne({
                'services.resume.loginTokens.hashedToken': accounts_base_1.Accounts._hashLoginToken(req.body.access_token),
            }, { projection: { _id: 1 } });
            if (user == null) {
                return res.status(401).send('Invalid token');
            }
            res.locals.user = { id: user._id };
            return next();
        }));
        this.app.post('/oauth/authorize', debugMiddleware, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const request = new oauth2_server_1.default.Request(req);
            const response = new oauth2_server_1.default.Response(res);
            try {
                yield oauth.authorize(request, response, {
                    authenticateHandler: {
                        handle() {
                            return __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                const clientId = request.body.client_id || ((_a = request.query) === null || _a === void 0 ? void 0 : _a.client_id);
                                if (!clientId) {
                                    throw new Error('Missing parameter: `client_id`');
                                }
                                if (req.body.allow === 'yes') {
                                    yield models_1.Users.updateOne({ _id: res.locals.user.id }, { $addToSet: { 'oauth.authorizedClients': clientId } });
                                }
                                return { id: res.locals.user.id };
                            });
                        },
                    },
                });
                handleResponse(res, response, next);
            }
            catch (e) {
                next(e);
            }
        }));
        this.app.use('/oauth/*', (err, _req, res, next) => {
            if (!(err instanceof oauth2_server_1.OAuthError))
                return next(err);
            delete err.stack;
            res.status(err.code);
            if (err instanceof oauth2_server_1.UnauthorizedRequestError) {
                return res.send();
            }
            res.send({ error: err.name, error_description: err.message });
        });
    }
}
exports.OAuth2Server = OAuth2Server;
