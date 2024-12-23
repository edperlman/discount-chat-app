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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHttpBridge = void 0;
const HttpBridge_1 = require("@rocket.chat/apps-engine/server/bridges/HttpBridge");
const server_fetch_1 = require("@rocket.chat/server-fetch");
const isGetOrHead = (method) => ['GET', 'HEAD'].includes(method.toUpperCase());
// Previously, there was no timeout for HTTP requests.
// We're setting the default timeout now to 3 minutes as it
// seems to be a good balance
const DEFAULT_TIMEOUT = 3 * 60 * 1000;
class AppHttpBridge extends HttpBridge_1.HttpBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    call(info) {
        return __awaiter(this, void 0, void 0, function* () {
            // begin comptability with old HTTP.call API
            const url = new URL(info.url);
            const { request, method } = info;
            const { headers = {} } = request;
            let { content } = request;
            if (!content && typeof request.data === 'object') {
                content = request.data;
            }
            if (request.auth) {
                if (request.auth.indexOf(':') < 0) {
                    throw new Error('auth option should be of the form "username:password"');
                }
                const base64 = Buffer.from(request.auth, 'ascii').toString('base64');
                headers.Authorization = `Basic ${base64}`;
            }
            let paramsForBody;
            if (content || isGetOrHead(method)) {
                if (request.params) {
                    Object.keys(request.params).forEach((key) => {
                        var _a, _b;
                        if ((_a = request.params) === null || _a === void 0 ? void 0 : _a[key]) {
                            url.searchParams.append(key, (_b = request.params) === null || _b === void 0 ? void 0 : _b[key]);
                        }
                    });
                }
            }
            else {
                paramsForBody = request.params;
            }
            if (paramsForBody) {
                const data = new URLSearchParams();
                Object.entries(paramsForBody).forEach(([key, value]) => {
                    data.append(key, value);
                });
                content = data.toString();
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            if (isGetOrHead(method)) {
                content = undefined;
            }
            const timeout = request.timeout || DEFAULT_TIMEOUT;
            // end comptability with old HTTP.call API
            this.orch.debugLog(`The App ${info.appId} is requesting from the outter webs:`, info);
            const response = yield (0, server_fetch_1.serverFetch)(url.href, {
                method,
                body: content,
                headers,
                timeout,
            }, (request.hasOwnProperty('strictSSL') && !request.strictSSL) ||
                (request.hasOwnProperty('rejectUnauthorized') && request.rejectUnauthorized));
            const result = {
                url: info.url,
                method: info.method,
                statusCode: response.status,
                headers: Object.fromEntries(response.headers),
            };
            const body = Buffer.from(yield response.arrayBuffer());
            if (request.encoding === null) {
                /**
                 * The property `content` is not appropriately typed in the
                 * Apps-engine definition, and we can't simply change it there
                 * as it would be a breaking change. Thus, we're left with this
                 * type assertion.
                 */
                result.content = body;
            }
            else {
                result.content = body.toString(request.encoding);
                result.data = (() => {
                    const contentType = (response.headers.get('content-type') || '').split(';')[0];
                    if (!['application/json', 'text/javascript', 'application/javascript', 'application/x-javascript'].includes(contentType)) {
                        return null;
                    }
                    try {
                        return JSON.parse(result.content);
                    }
                    catch (_a) {
                        return null;
                    }
                })();
            }
            return result;
        });
    }
}
exports.AppHttpBridge = AppHttpBridge;
