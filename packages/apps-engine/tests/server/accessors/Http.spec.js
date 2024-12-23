"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
exports.HttpAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
let HttpAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _useHttp_decorators;
    return _a = class HttpAccessorTestFixture {
            constructor() {
                this.mockAppId = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockAppId = 'testing-app';
                this.mockResponse = { statusCode: 200 };
                const res = this.mockResponse;
                this.mockHttpBridge = {
                    doCall(info) {
                        return Promise.resolve(res);
                    },
                };
                const httpBridge = this.mockHttpBridge;
                this.mockAppBridge = {
                    getHttpBridge() {
                        return httpBridge;
                    },
                };
                this.mockHttpExtender = new accessors_1.HttpExtend();
                this.mockReader = {};
                this.mockPersis = {};
                const reader = this.mockReader;
                const persis = this.mockPersis;
                this.mockAccessorManager = {
                    getReader(appId) {
                        return reader;
                    },
                    getPersistence(appId) {
                        return persis;
                    },
                };
                this.mockPreRequestHandler = {
                    executePreHttpRequest(url, request, read, persistence) {
                        return Promise.resolve(request);
                    },
                };
                this.mockPreResponseHandler = {
                    executePreHttpResponse(response, read, persistence) {
                        return Promise.resolve(response);
                    },
                };
            }
            useHttp() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.Http(this.mockAccessorManager, this.mockAppBridge, this.mockHttpExtender, this.mockAppId)).not.toThrow();
                    const http = new accessors_1.Http(this.mockAccessorManager, this.mockAppBridge, this.mockHttpExtender, this.mockAppId);
                    (0, alsatian_1.SpyOn)(this.mockHttpBridge, 'doCall');
                    (0, alsatian_1.SpyOn)(this.mockPreRequestHandler, 'executePreHttpRequest');
                    (0, alsatian_1.SpyOn)(this.mockPreResponseHandler, 'executePreHttpResponse');
                    (0, alsatian_1.Expect)(yield http.get('url-here')).toBeDefined();
                    (0, alsatian_1.Expect)(yield http.post('url-here')).toBeDefined();
                    (0, alsatian_1.Expect)(yield http.put('url-here')).toBeDefined();
                    (0, alsatian_1.Expect)(yield http.del('url-here')).toBeDefined();
                    (0, alsatian_1.Expect)(yield http.get('url-here', { headers: {}, params: {} })).toBeDefined();
                    const request1 = {};
                    this.mockHttpExtender.provideDefaultHeader('Auth-Token', 'Bearer asdfasdf');
                    (0, alsatian_1.Expect)(yield http.post('url-here', request1)).toBeDefined();
                    (0, alsatian_1.Expect)(request1.headers['Auth-Token']).toBe('Bearer asdfasdf');
                    request1.headers['Auth-Token'] = 'mine';
                    (0, alsatian_1.Expect)(yield http.put('url-here', request1)).toBeDefined(); // Check it the default doesn't override provided
                    (0, alsatian_1.Expect)(request1.headers['Auth-Token']).toBe('mine');
                    const request2 = {};
                    this.mockHttpExtender.provideDefaultParam('count', '20');
                    (0, alsatian_1.Expect)(yield http.del('url-here', request2)).toBeDefined();
                    (0, alsatian_1.Expect)(request2.params.count).toBe('20');
                    request2.params.count = '50';
                    (0, alsatian_1.Expect)(yield http.get('url-here', request2)).toBeDefined(); // Check it the default doesn't override provided
                    (0, alsatian_1.Expect)(request2.params.count).toBe('50');
                    this.mockHttpExtender.providePreRequestHandler(this.mockPreRequestHandler);
                    const request3 = {};
                    (0, alsatian_1.Expect)(yield http.post('url-here', request3)).toBeDefined();
                    (0, alsatian_1.Expect)(this.mockPreRequestHandler.executePreHttpRequest).toHaveBeenCalledWith('url-here', request3, this.mockReader, this.mockPersis);
                    this.mockHttpExtender.requests = [];
                    this.mockHttpExtender.providePreResponseHandler(this.mockPreResponseHandler);
                    (0, alsatian_1.Expect)(yield http.post('url-here')).toBeDefined();
                    (0, alsatian_1.Expect)(this.mockPreResponseHandler.executePreHttpResponse).toHaveBeenCalledWith(this.mockResponse, this.mockReader, this.mockPersis);
                    (0, alsatian_1.Expect)(this.mockHttpBridge.doCall).toHaveBeenCalled().exactly(11);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _useHttp_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _useHttp_decorators, { kind: "method", name: "useHttp", static: false, private: false, access: { has: obj => "useHttp" in obj, get: obj => obj.useHttp }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.HttpAccessorTestFixture = HttpAccessorTestFixture;
