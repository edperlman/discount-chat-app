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
exports.AppUIKitInteractionApi = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const meteor_1 = require("meteor/meteor");
const webapp_1 = require("meteor/webapp");
const authentication_1 = require("../../../../app/api/server/middlewares/authentication");
const server_1 = require("../../../../app/settings/server");
const orchestrator_1 = require("../orchestrator");
const apiServer = (0, express_1.default)();
apiServer.disable('x-powered-by');
let corsEnabled = false;
let allowListOrigins = [];
server_1.settings.watch('API_Enable_CORS', (value) => {
    corsEnabled = value;
});
server_1.settings.watch('API_CORS_Origin', (value) => {
    allowListOrigins = value
        ? value
            .trim()
            .split(',')
            .map((origin) => String(origin).trim().toLocaleLowerCase())
        : [];
});
webapp_1.WebApp.connectHandlers.use(apiServer);
// eslint-disable-next-line new-cap
const router = express_1.default.Router();
const unauthorized = (res) => res.status(401).send({
    status: 'error',
    message: 'You must be logged in to do this.',
});
meteor_1.Meteor.startup(() => {
    // use specific rate limit of 600 (which is 60 times the default limits) requests per minute (around 10/second)
    const apiLimiter = (0, express_rate_limit_1.default)({
        windowMs: server_1.settings.get('API_Enable_Rate_Limiter_Limit_Time_Default'),
        max: server_1.settings.get('API_Enable_Rate_Limiter_Limit_Calls_Default') * 60,
        skip: () => server_1.settings.get('API_Enable_Rate_Limiter') !== true ||
            (process.env.NODE_ENV === 'development' && server_1.settings.get('API_Enable_Rate_Limiter_Dev') !== true),
    });
    router.use(apiLimiter);
});
router.use((0, authentication_1.authenticationMiddleware)({ rejectUnauthorized: false }));
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { 'x-visitor-token': visitorToken } = req.headers;
    if (visitorToken) {
        req.body.visitor = yield ((_a = orchestrator_1.Apps.getConverters()) === null || _a === void 0 ? void 0 : _a.get('visitors').convertByToken(visitorToken));
    }
    if (!req.user && !req.body.visitor) {
        return unauthorized(res);
    }
    next();
}));
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin ||
            !corsEnabled ||
            allowListOrigins.includes('*') ||
            allowListOrigins.includes(origin) ||
            origin === server_1.settings.get('Site_Url')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
};
apiServer.use('/api/apps/ui.interaction/', (0, cors_1.default)(corsOptions), router); // didn't have the rateLimiter option
const getCoreAppPayload = (req) => {
    const { id: appId } = req.params;
    if (req.body.type === 'blockAction') {
        const { user } = req;
        const { type, actionId, triggerId, payload, container, visitor } = req.body;
        const message = 'mid' in req.body ? req.body.mid : undefined;
        const room = 'rid' in req.body ? req.body.rid : undefined;
        return {
            appId,
            type,
            actionId,
            triggerId,
            container,
            message,
            payload,
            user,
            visitor,
            room,
        };
    }
    if (req.body.type === 'viewClosed') {
        const { user } = req;
        const { type, payload: { view, isCleared }, triggerId, } = req.body;
        return {
            appId,
            triggerId,
            type,
            user,
            payload: {
                view,
                isCleared,
            },
        };
    }
    if (req.body.type === 'viewSubmit') {
        const { user } = req;
        const { type, actionId, triggerId, payload } = req.body;
        return {
            appId,
            type,
            actionId,
            triggerId,
            payload,
            user,
        };
    }
    throw new Error('Type not supported');
};
router.post('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: appId } = req.params;
    const isCoreApp = yield core_services_1.UiKitCoreApp.isRegistered(appId);
    if (!isCoreApp) {
        return next();
    }
    try {
        const payload = getCoreAppPayload(req);
        const result = yield core_services_1.UiKitCoreApp[payload.type](payload);
        // Using ?? to always send something in the response, even if the app had no result.
        res.send(result !== null && result !== void 0 ? result : {});
    }
    catch (e) {
        const error = e instanceof Error ? e.message : e;
        res.status(500).send({ error });
    }
}));
class AppUIKitInteractionApi {
    constructor(orch) {
        this.routeHandler = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const { orch } = this;
            const { id: appId } = req.params;
            switch (req.body.type) {
                case 'blockAction': {
                    const { type, actionId, triggerId, payload, container } = req.body;
                    const mid = 'mid' in req.body ? req.body.mid : undefined;
                    const rid = 'rid' in req.body ? req.body.rid : undefined;
                    const { visitor } = req.body;
                    const room = yield ((_a = orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertById(rid));
                    const user = (_b = orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('users').convertToApp(req.user);
                    const message = mid && (yield ((_c = orch.getConverters()) === null || _c === void 0 ? void 0 : _c.get('messages').convertById(mid)));
                    const action = {
                        type,
                        container,
                        appId,
                        actionId,
                        message,
                        triggerId,
                        payload,
                        user,
                        visitor,
                        room,
                    };
                    try {
                        const eventInterface = !visitor ? 'IUIKitInteractionHandler' : 'IUIKitLivechatInteractionHandler';
                        const result = yield orch.triggerEvent(eventInterface, action);
                        res.send(result);
                    }
                    catch (e) {
                        const error = e instanceof Error ? e.message : e;
                        res.status(500).send({ error });
                    }
                    break;
                }
                case 'viewClosed': {
                    const { type, payload: { view, isCleared }, } = req.body;
                    const user = (_d = orch.getConverters()) === null || _d === void 0 ? void 0 : _d.get('users').convertToApp(req.user);
                    const action = {
                        type,
                        appId,
                        user,
                        payload: {
                            view,
                            isCleared,
                        },
                    };
                    try {
                        const result = yield orch.triggerEvent('IUIKitInteractionHandler', action);
                        res.send(result);
                    }
                    catch (e) {
                        const error = e instanceof Error ? e.message : e;
                        res.status(500).send({ error });
                    }
                    break;
                }
                case 'viewSubmit': {
                    const { type, actionId, triggerId, payload } = req.body;
                    const user = (_e = orch.getConverters()) === null || _e === void 0 ? void 0 : _e.get('users').convertToApp(req.user);
                    const action = {
                        type,
                        appId,
                        actionId,
                        triggerId,
                        payload,
                        user,
                    };
                    try {
                        const result = yield orch.triggerEvent('IUIKitInteractionHandler', action);
                        res.send(result);
                    }
                    catch (e) {
                        const error = e instanceof Error ? e.message : e;
                        res.status(500).send({ error });
                    }
                    break;
                }
                case 'actionButton': {
                    const { type, actionId, triggerId, rid, mid, tmid, payload: { context, message: msgText }, } = req.body;
                    const room = yield ((_f = orch.getConverters()) === null || _f === void 0 ? void 0 : _f.get('rooms').convertById(rid));
                    const user = (_g = orch.getConverters()) === null || _g === void 0 ? void 0 : _g.get('users').convertToApp(req.user);
                    const message = mid && (yield ((_h = orch.getConverters()) === null || _h === void 0 ? void 0 : _h.get('messages').convertById(mid)));
                    const action = {
                        type,
                        appId,
                        actionId,
                        triggerId,
                        user,
                        room,
                        message,
                        tmid,
                        payload: Object.assign({ context }, (msgText ? { message: msgText } : {})),
                    };
                    try {
                        const result = yield orch.triggerEvent('IUIKitInteractionHandler', action);
                        res.send(result);
                    }
                    catch (e) {
                        const error = e instanceof Error ? e.message : e;
                        res.status(500).send({ error });
                    }
                    break;
                }
                default: {
                    res.status(400).send({ error: 'Unknown action' });
                }
            }
            // TODO: validate payloads per type
        });
        this.orch = orch;
        router.post('/:id', this.routeHandler);
    }
}
exports.AppUIKitInteractionApi = AppUIKitInteractionApi;
