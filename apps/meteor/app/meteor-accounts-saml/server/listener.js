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
const body_parser_1 = __importDefault(require("body-parser"));
const meteor_1 = require("meteor/meteor");
const routepolicy_1 = require("meteor/routepolicy");
const webapp_1 = require("meteor/webapp");
const SAML_1 = require("./lib/SAML");
const Utils_1 = require("./lib/Utils");
const system_1 = require("../../../server/lib/logger/system");
routepolicy_1.RoutePolicy.declare('/_saml/', 'network');
const samlUrlToObject = function (url) {
    // req.url will be '/_saml/<action>/<service name>/<credentialToken>'
    if (!url) {
        return null;
    }
    const splitUrl = url.split('?');
    const splitPath = splitUrl[0].split('/');
    // Any non-saml request will continue down the default
    // middlewares.
    if (splitPath[1] !== '_saml') {
        return null;
    }
    const result = {
        actionName: splitPath[2],
        serviceName: splitPath[3],
        credentialToken: splitPath[4],
    };
    Utils_1.SAMLUtils.log(result);
    return result;
};
const middleware = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Make sure to catch any exceptions because otherwise we'd crash
        // the runner
        try {
            const samlObject = samlUrlToObject(req.url);
            if (!(samlObject === null || samlObject === void 0 ? void 0 : samlObject.serviceName)) {
                next();
                return;
            }
            if (!samlObject.actionName) {
                throw new Error('Missing SAML action');
            }
            const service = Utils_1.SAMLUtils.getServiceProviderOptions(samlObject.serviceName);
            if (!service) {
                system_1.SystemLogger.error(`${samlObject.serviceName} service provider not found`);
                throw new Error('SAML Service Provider not found.');
            }
            yield SAML_1.SAML.processRequest(req, res, service, samlObject);
        }
        catch (err) {
            // @ToDo: Ideally we should send some error message to the client, but there's no way to do it on a redirect right now.
            system_1.SystemLogger.error(err);
            const url = meteor_1.Meteor.absoluteUrl('home');
            res.writeHead(302, {
                Location: url,
            });
            res.end();
        }
    });
};
// Listen to incoming SAML http requests
webapp_1.WebApp.connectHandlers
    .use(body_parser_1.default.json())
    .use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return middleware(req, res, next); }));
