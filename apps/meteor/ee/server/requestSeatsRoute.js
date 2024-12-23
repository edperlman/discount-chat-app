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
const express_1 = __importDefault(require("express"));
const webapp_1 = require("meteor/webapp");
const authentication_1 = require("../../app/api/server/middlewares/authentication");
const getCheckoutUrl_1 = require("../../app/cloud/server/functions/getCheckoutUrl");
const getSeatsRequestLink_1 = require("../app/license/server/getSeatsRequestLink");
const apiServer = (0, express_1.default)();
webapp_1.WebApp.connectHandlers.use(apiServer);
// eslint-disable-next-line new-cap
const router = express_1.default.Router();
apiServer.use('/requestSeats', router);
apiServer.use('/links/manage-subscription', router);
router.use((0, authentication_1.authenticationMiddleware)({ rejectUnauthorized: false, cookies: true }));
router.use((0, authentication_1.hasPermissionMiddleware)('manage-cloud', {
    rejectUnauthorized: false,
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, getSeatsRequestLink_1.getSeatsRequestLink)(req.unauthorized ? getCheckoutUrl_1.fallback : (yield (0, getCheckoutUrl_1.getCheckoutUrl)()).url, req.query);
    yield core_services_1.Analytics.saveSeatRequest();
    res.writeHead(302, { Location: url });
    res.end();
}));
