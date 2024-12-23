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
exports.Http = void 0;
const AppObjectRegistry_ts_1 = require("../../AppObjectRegistry.ts");
class Http {
    constructor(read, persistence, httpExtender, senderFn) {
        this.read = read;
        this.persistence = persistence;
        this.httpExtender = httpExtender;
        this.senderFn = senderFn;
        // this.httpExtender = new HttpExtend();
    }
    get(url, options) {
        return this._processHandler(url, 'get', options);
    }
    put(url, options) {
        return this._processHandler(url, 'put', options);
    }
    post(url, options) {
        return this._processHandler(url, 'post', options);
    }
    del(url, options) {
        return this._processHandler(url, 'delete', options);
    }
    patch(url, options) {
        return this._processHandler(url, 'patch', options);
    }
    _processHandler(url, method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = options || {};
            if (typeof request.headers === 'undefined') {
                request.headers = {};
            }
            this.httpExtender.getDefaultHeaders().forEach((value, key) => {
                var _a;
                if (typeof ((_a = request.headers) === null || _a === void 0 ? void 0 : _a[key]) !== 'string') {
                    request.headers[key] = value;
                }
            });
            if (typeof request.params === 'undefined') {
                request.params = {};
            }
            this.httpExtender.getDefaultParams().forEach((value, key) => {
                var _a;
                if (typeof ((_a = request.params) === null || _a === void 0 ? void 0 : _a[key]) !== 'string') {
                    request.params[key] = value;
                }
            });
            for (const handler of this.httpExtender.getPreRequestHandlers()) {
                request = yield handler.executePreHttpRequest(url, request, this.read, this.persistence);
            }
            let { result: response } = yield this.senderFn({
                method: `bridges:getHttpBridge:doCall`,
                params: [{
                        appId: AppObjectRegistry_ts_1.AppObjectRegistry.get('id'),
                        method,
                        url,
                        request,
                    }],
            });
            for (const handler of this.httpExtender.getPreResponseHandlers()) {
                response = yield handler.executePreHttpResponse(response, this.read, this.persistence);
            }
            return response;
        });
    }
}
exports.Http = Http;
