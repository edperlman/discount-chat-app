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
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const instance_status_1 = require("@rocket.chat/instance-status");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const webapp_1 = require("meteor/webapp");
const ufs_1 = require("../../../../server/ufs");
const isDocker_1 = require("../../../utils/server/functions/isDocker");
const logger = new logger_1.Logger('UploadProxy');
function handle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Quick check to see if request should be catch
        if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.includes(`/${ufs_1.UploadFS.config.storesPath}/`))) {
            return next();
        }
        logger.debug({ msg: 'Upload URL:', url: req.url });
        if (req.method !== 'POST') {
            return next();
        }
        // Remove store path
        const parsedUrl = url_1.default.parse(req.url);
        const path = ((_b = parsedUrl.pathname) === null || _b === void 0 ? void 0 : _b.substr(ufs_1.UploadFS.config.storesPath.length + 1)) || '';
        // Get store
        const regExp = new RegExp('^/([^/?]+)/([^/?]+)$');
        const match = regExp.exec(path);
        // Request is not valid
        if (match === null) {
            res.writeHead(400);
            res.end();
            return;
        }
        // Get store
        const store = ufs_1.UploadFS.getStore(match[1]);
        if (!store) {
            res.writeHead(404);
            res.end();
            return;
        }
        // Get file
        const fileId = match[2];
        const file = yield store.getCollection().findOne({ _id: fileId });
        if (!file) {
            res.writeHead(404);
            res.end();
            return;
        }
        if (!file.instanceId || file.instanceId === instance_status_1.InstanceStatus.id()) {
            logger.debug('Correct instance');
            return next();
        }
        // Proxy to other instance
        const instance = yield models_1.InstanceStatus.findOneById(file.instanceId);
        if (instance == null) {
            res.writeHead(404);
            res.end();
            return;
        }
        if (instance.extraInformation.host === process.env.INSTANCE_IP && (0, isDocker_1.isDocker)() === false) {
            instance.extraInformation.host = 'localhost';
        }
        logger.debug(`Wrong instance, proxing to ${instance.extraInformation.host}:${instance.extraInformation.port}`);
        const options = {
            hostname: instance.extraInformation.host,
            port: instance.extraInformation.port,
            path: req.originalUrl,
            method: 'POST',
        };
        logger.warn('UFS proxy middleware is deprecated as this upload method is not being used by Web/Mobile Clients. See this: https://docs.rocket.chat/api/rest-api/methods/rooms/upload');
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const proxy = http_1.default.request(options, (proxy_res) => {
            proxy_res.pipe(res, {
                end: true,
            });
        });
        req.pipe(proxy, {
            end: true,
        });
    });
}
// @ts-expect-error - l
const dummyRouter = webapp_1.WebApp.connectHandlers._router;
// Create a dummy route
dummyRouter.route('*');
// fetch the newly created "layer"
const stackedRoute = dummyRouter.stack.pop();
stackedRoute.handle = handle;
// Move the layer to the top :)
// @ts-expect-error - l
webapp_1.WebApp.connectHandlers._router.stack.unshift(stackedRoute);
