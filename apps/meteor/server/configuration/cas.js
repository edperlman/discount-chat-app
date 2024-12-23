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
exports.configureCAS = configureCAS;
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const routepolicy_1 = require("meteor/routepolicy");
const webapp_1 = require("meteor/webapp");
const cached_1 = require("../../app/settings/server/cached");
const loginHandler_1 = require("../lib/cas/loginHandler");
const middleware_1 = require("../lib/cas/middleware");
const updateCasService_1 = require("../lib/cas/updateCasService");
function configureCAS() {
    return __awaiter(this, void 0, void 0, function* () {
        const _updateCasServices = (0, lodash_debounce_1.default)(updateCasService_1.updateCasServices, 2000);
        cached_1.settings.watchByRegex(/^CAS_.+/, () => __awaiter(this, void 0, void 0, function* () {
            yield _updateCasServices();
        }));
        routepolicy_1.RoutePolicy.declare('/_cas/', 'network');
        // Listen to incoming OAuth http requests
        webapp_1.WebApp.connectHandlers.use((req, res, next) => {
            (0, middleware_1.middlewareCAS)(req, res, next);
        });
        /*
         * Register a server-side login handler.
         * It is called after Accounts.callLoginMethod() is called from client.
         *
         */
        Accounts.registerLoginHandler('cas', (options) => {
            const promise = (0, loginHandler_1.loginHandlerCAS)(options);
            // Pretend the promise has been awaited so the types will match -
            // #TODO: Fix registerLoginHandler's type definitions (it accepts promises)
            return promise;
        });
    });
}
