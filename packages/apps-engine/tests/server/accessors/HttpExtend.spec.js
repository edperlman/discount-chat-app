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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExtendAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
let HttpExtendAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicHttpExtend_decorators;
    let _defaultHeadersInHttpExtend_decorators;
    let _defaultParamsInHttpExtend_decorators;
    let _preRequestHandlersInHttpExtend_decorators;
    let _preResponseHandlersInHttpExtend_decorators;
    return _a = class HttpExtendAccessorTestFixture {
            basicHttpExtend() {
                (0, alsatian_1.Expect)(() => new accessors_1.HttpExtend()).not.toThrow();
                const he = new accessors_1.HttpExtend();
                (0, alsatian_1.Expect)(he.getDefaultHeaders()).toEqual(new Map());
                (0, alsatian_1.Expect)(he.getDefaultParams()).toEqual(new Map());
                (0, alsatian_1.Expect)(he.getPreRequestHandlers()).toBeEmpty();
                (0, alsatian_1.Expect)(he.getPreResponseHandlers()).toBeEmpty();
            }
            defaultHeadersInHttpExtend() {
                const he = new accessors_1.HttpExtend();
                (0, alsatian_1.Expect)(() => he.provideDefaultHeader('Auth', 'token')).not.toThrow();
                (0, alsatian_1.Expect)(he.getDefaultHeaders().size).toBe(1);
                (0, alsatian_1.Expect)(he.getDefaultHeaders().get('Auth')).toBe('token');
                (0, alsatian_1.Expect)(() => he.provideDefaultHeaders({
                    Auth: 'token2',
                    Another: 'thing',
                })).not.toThrow();
                (0, alsatian_1.Expect)(he.getDefaultHeaders().size).toBe(2);
                (0, alsatian_1.Expect)(he.getDefaultHeaders().get('Auth')).toBe('token2');
                (0, alsatian_1.Expect)(he.getDefaultHeaders().get('Another')).toBe('thing');
            }
            defaultParamsInHttpExtend() {
                const he = new accessors_1.HttpExtend();
                (0, alsatian_1.Expect)(() => he.provideDefaultParam('id', 'abcdefg')).not.toThrow();
                (0, alsatian_1.Expect)(he.getDefaultParams().size).toBe(1);
                (0, alsatian_1.Expect)(he.getDefaultParams().get('id')).toBe('abcdefg');
                (0, alsatian_1.Expect)(() => he.provideDefaultParams({
                    id: 'zyxwvu',
                    count: '4',
                })).not.toThrow();
                (0, alsatian_1.Expect)(he.getDefaultParams().size).toBe(2);
                (0, alsatian_1.Expect)(he.getDefaultParams().get('id')).toBe('zyxwvu');
                (0, alsatian_1.Expect)(he.getDefaultParams().get('count')).toBe('4');
            }
            preRequestHandlersInHttpExtend() {
                const he = new accessors_1.HttpExtend();
                const preRequestHandler = {
                    executePreHttpRequest: function _thing(url, req) {
                        return new Promise((resolve) => resolve(req));
                    },
                };
                (0, alsatian_1.Expect)(() => he.providePreRequestHandler(preRequestHandler)).not.toThrow();
                (0, alsatian_1.Expect)(he.getPreRequestHandlers()).not.toBeEmpty();
            }
            preResponseHandlersInHttpExtend() {
                const he = new accessors_1.HttpExtend();
                const preResponseHandler = {
                    executePreHttpResponse: function _thing(res) {
                        return new Promise((resolve) => resolve(res));
                    },
                };
                (0, alsatian_1.Expect)(() => he.providePreResponseHandler(preResponseHandler)).not.toThrow();
                (0, alsatian_1.Expect)(he.getPreResponseHandlers()).not.toBeEmpty();
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicHttpExtend_decorators = [(0, alsatian_1.Test)()];
            _defaultHeadersInHttpExtend_decorators = [(0, alsatian_1.Test)()];
            _defaultParamsInHttpExtend_decorators = [(0, alsatian_1.Test)()];
            _preRequestHandlersInHttpExtend_decorators = [(0, alsatian_1.Test)()];
            _preResponseHandlersInHttpExtend_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicHttpExtend_decorators, { kind: "method", name: "basicHttpExtend", static: false, private: false, access: { has: obj => "basicHttpExtend" in obj, get: obj => obj.basicHttpExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _defaultHeadersInHttpExtend_decorators, { kind: "method", name: "defaultHeadersInHttpExtend", static: false, private: false, access: { has: obj => "defaultHeadersInHttpExtend" in obj, get: obj => obj.defaultHeadersInHttpExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _defaultParamsInHttpExtend_decorators, { kind: "method", name: "defaultParamsInHttpExtend", static: false, private: false, access: { has: obj => "defaultParamsInHttpExtend" in obj, get: obj => obj.defaultParamsInHttpExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _preRequestHandlersInHttpExtend_decorators, { kind: "method", name: "preRequestHandlersInHttpExtend", static: false, private: false, access: { has: obj => "preRequestHandlersInHttpExtend" in obj, get: obj => obj.preRequestHandlersInHttpExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _preResponseHandlersInHttpExtend_decorators, { kind: "method", name: "preResponseHandlersInHttpExtend", static: false, private: false, access: { has: obj => "preResponseHandlersInHttpExtend" in obj, get: obj => obj.preResponseHandlersInHttpExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.HttpExtendAccessorTestFixture = HttpExtendAccessorTestFixture;
