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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Livechat = exports.useSsl = void 0;
const ddp_client_1 = require("@rocket.chat/ddp-client");
const query_string_1 = require("query-string");
const host = (_b = (_a = window.SERVER_URL) !== null && _a !== void 0 ? _a : (0, query_string_1.parse)(window.location.search).serverUrl) !== null && _b !== void 0 ? _b : (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null);
exports.useSsl = Boolean((_c = (Array.isArray(host) ? host[0] : host)) === null || _c === void 0 ? void 0 : _c.match(/^https:/));
exports.Livechat = ddp_client_1.LivechatClientImpl.create(host.replace(/^http/, 'ws'));
exports.Livechat.rest.use(function (request, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield next(...request);
        }
        catch (error) {
            if (error instanceof Response) {
                const e = yield error.json();
                throw e;
            }
            throw error;
        }
    });
});
