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
exports.AppFabricationFulfillmentTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppStatus_1 = require("../../../src/definition/AppStatus");
const metadata_1 = require("../../../src/definition/metadata");
const ProxiedApp_1 = require("../../../src/server/ProxiedApp");
const compiler_1 = require("../../../src/server/compiler");
let AppFabricationFulfillmentTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _appFabricationDefinement_decorators;
    return _a = class AppFabricationFulfillmentTestFixture {
            appFabricationDefinement() {
                const expctedInfo = {
                    id: '614055e2-3dba-41fb-be48-c1ff146f5932',
                    name: 'Testing App',
                    nameSlug: 'testing-app',
                    description: 'A Rocket.Chat Application used to test out the various features.',
                    version: '0.0.8',
                    requiredApiVersion: '>=0.9.6',
                    author: {
                        name: 'Bradley Hilton',
                        homepage: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions',
                        support: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions/issues',
                    },
                    classFile: 'TestingApp.ts',
                    iconFile: 'testing.jpg',
                    implements: [],
                    permissions: [],
                };
                (0, alsatian_1.Expect)(() => new compiler_1.AppFabricationFulfillment()).not.toThrow();
                const aff = new compiler_1.AppFabricationFulfillment();
                (0, alsatian_1.Expect)(() => aff.setAppInfo(expctedInfo)).not.toThrow();
                (0, alsatian_1.Expect)(aff.getAppInfo()).toEqual(expctedInfo);
                const expectedInter = {};
                expectedInter[metadata_1.AppInterface.IPreMessageSentPrevent] = true;
                (0, alsatian_1.Expect)(() => aff.setImplementedInterfaces(expectedInter)).not.toThrow();
                (0, alsatian_1.Expect)(aff.getImplementedInferfaces()).toEqual(expectedInter);
                const fakeApp = new ProxiedApp_1.ProxiedApp({}, { status: AppStatus_1.AppStatus.UNKNOWN }, {});
                (0, alsatian_1.Expect)(() => aff.setApp(fakeApp)).not.toThrow();
                (0, alsatian_1.Expect)(aff.getApp()).toEqual(fakeApp);
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _appFabricationDefinement_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _appFabricationDefinement_decorators, { kind: "method", name: "appFabricationDefinement", static: false, private: false, access: { has: obj => "appFabricationDefinement" in obj, get: obj => obj.appFabricationDefinement }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppFabricationFulfillmentTestFixture = AppFabricationFulfillmentTestFixture;
