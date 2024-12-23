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
exports.AppAccessorsTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppStatus_1 = require("../../../src/definition/AppStatus");
const accessors_1 = require("../../../src/server/accessors");
const logging_1 = require("../../../src/server/logging");
const managers_1 = require("../../../src/server/managers");
const appBridges_1 = require("../../test-data/bridges/appBridges");
const logStorage_1 = require("../../test-data/storage/logStorage");
const utilities_1 = require("../../test-data/utilities");
let AppAccessorsTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _setup_decorators;
    let _testAppAccessor_decorators;
    return _a = class AppAccessorsTestFixture {
            constructor() {
                this.mockBridges = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                this.mockApp = {
                    getRuntime() {
                        return {};
                    },
                    getID() {
                        return 'testing';
                    },
                    getStatus() {
                        return Promise.resolve(AppStatus_1.AppStatus.AUTO_ENABLED);
                    },
                    setupLogger(method) {
                        return new logging_1.AppConsole(method);
                    },
                };
                const bri = this.mockBridges;
                const app = this.mockApp;
                this.mockManager = {
                    getBridges() {
                        return bri;
                    },
                    getCommandManager() {
                        return {};
                    },
                    getExternalComponentManager() {
                        return {};
                    },
                    getOneById(appId) {
                        return appId === 'failMePlease' ? undefined : app;
                    },
                    getLogStorage() {
                        return new logStorage_1.TestsAppLogStorage();
                    },
                    getSchedulerManager() {
                        return {};
                    },
                    getUIActionButtonManager() {
                        return {};
                    },
                    getVideoConfProviderManager() {
                        return {};
                    },
                    getSettingsManager() {
                        return {};
                    },
                };
                this.mockAccessors = new managers_1.AppAccessorManager(this.mockManager);
                const ac = this.mockAccessors;
                this.mockManager.getAccessorManager = function _getAccessorManager() {
                    return ac;
                };
                this.mockApiManager = new managers_1.AppApiManager(this.mockManager);
                const apiManager = this.mockApiManager;
                this.mockManager.getApiManager = function _getApiManager() {
                    return apiManager;
                };
            }
            setup() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                const bri = this.mockBridges;
                this.mockManager.getBridges = function _refreshedGetBridges() {
                    return bri;
                };
                this.mockApiManager = new managers_1.AppApiManager(this.mockManager);
                const apiManager = this.mockApiManager;
                this.mockManager.getApiManager = function _refreshedGetApiManager() {
                    return apiManager;
                };
            }
            testAppAccessor() {
                (0, alsatian_1.Expect)(() => new accessors_1.AppAccessors({}, '')).toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.AppAccessors(this.mockManager, 'testing')).not.toThrow();
                const appAccessors = new accessors_1.AppAccessors(this.mockManager, 'testing');
                (0, alsatian_1.Expect)(appAccessors.environmentReader).toEqual(this.mockAccessors.getEnvironmentRead('testing'));
                (0, alsatian_1.Expect)(appAccessors.environmentWriter).toEqual(this.mockAccessors.getEnvironmentWrite('testing'));
                (0, alsatian_1.Expect)(appAccessors.reader).toEqual(this.mockAccessors.getReader('testing'));
                (0, alsatian_1.Expect)(appAccessors.http).toEqual(this.mockAccessors.getHttp('testing'));
                (0, alsatian_1.Expect)(appAccessors.providedApiEndpoints).toEqual(this.mockApiManager.listApis('testing'));
                this.mockApiManager.addApi('testing', utilities_1.TestData.getApi('app-accessor-api'));
                (0, alsatian_1.Expect)(appAccessors.providedApiEndpoints).toEqual(this.mockApiManager.listApis('testing'));
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _setup_decorators = [alsatian_1.Setup];
            _testAppAccessor_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _testAppAccessor_decorators, { kind: "method", name: "testAppAccessor", static: false, private: false, access: { has: obj => "testAppAccessor" in obj, get: obj => obj.testAppAccessor }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.doThrow = false,
        _a;
})();
exports.AppAccessorsTestFixture = AppAccessorsTestFixture;
