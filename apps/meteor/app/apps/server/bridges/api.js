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
exports.AppApisBridge = void 0;
const ApiBridge_1 = require("@rocket.chat/apps-engine/server/bridges/ApiBridge");
const express_1 = __importDefault(require("express"));
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const authentication_1 = require("../../../api/server/middlewares/authentication");
const apiServer = (0, express_1.default)();
apiServer.disable('x-powered-by');
webapp_1.WebApp.connectHandlers.use(apiServer);
class AppApisBridge extends ApiBridge_1.ApiBridge {
    constructor(orch) {
        super();
        this.orch = orch;
        this.appRouters = new Map();
        apiServer.use('/api/apps/private/:appId/:hash', (req, res) => {
            const notFound = () => res.sendStatus(404);
            const router = this.appRouters.get(req.params.appId);
            if (router) {
                req._privateHash = req.params.hash;
                return router(req, res, notFound);
            }
            notFound();
        });
        apiServer.use('/api/apps/public/:appId', (req, res) => {
            const notFound = () => res.sendStatus(404);
            const router = this.appRouters.get(req.params.appId);
            if (router && typeof router === 'function') {
                return router(req, res, notFound);
            }
            notFound();
        });
    }
    registerApi(_a, appId_1) {
        return __awaiter(this, arguments, void 0, function* ({ api, computedPath, endpoint }, appId) {
            this.orch.debugLog(`The App ${appId} is registering the api: "${endpoint.path}" (${computedPath})`);
            this._verifyApi(api, endpoint);
            let router = this.appRouters.get(appId);
            if (!router) {
                router = express_1.default.Router(); // eslint-disable-line new-cap
                this.appRouters.set(appId, router);
            }
            const method = 'all';
            let routePath = endpoint.path.trim();
            if (!routePath.startsWith('/')) {
                routePath = `/${routePath}`;
            }
            if (router[method] instanceof Function) {
                router[method](routePath, (0, authentication_1.authenticationMiddleware)({ rejectUnauthorized: !!endpoint.authRequired }), meteor_1.Meteor.bindEnvironment(this._appApiExecutor(endpoint, appId)));
            }
        });
    }
    unregisterApis(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is unregistering all apis`);
            if (this.appRouters.get(appId)) {
                this.appRouters.delete(appId);
            }
        });
    }
    _verifyApi(api, endpoint) {
        if (typeof api !== 'object') {
            throw new Error('Invalid Api parameter provided, it must be a valid IApi object.');
        }
        if (typeof endpoint.path !== 'string') {
            throw new Error('Invalid Api parameter provided, it must be a valid IApi object.');
        }
    }
    _appApiExecutor(endpoint, appId) {
        return (req, res) => {
            var _a, _b, _c;
            const request = {
                method: req.method.toLowerCase(),
                headers: req.headers,
                query: req.query || {},
                params: req.params || {},
                content: req.body,
                privateHash: req._privateHash,
                user: req.user && ((_b = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users')) === null || _b === void 0 ? void 0 : _b.convertToApp(req.user)),
            };
            (_c = this.orch
                .getManager()) === null || _c === void 0 ? void 0 : _c.getApiManager().executeApi(appId, endpoint.path, request).then(({ status, headers = {}, content }) => {
                res.set(headers);
                res.status(status);
                res.send(content);
            }).catch((reason) => {
                // Should we handle this as an error?
                res.status(500).send(reason.message);
            });
        };
    }
}
exports.AppApisBridge = AppApisBridge;
