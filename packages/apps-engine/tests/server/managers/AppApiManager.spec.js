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
exports.AppApiManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppStatus_1 = require("../../../src/definition/AppStatus");
const accessors_1 = require("../../../src/definition/accessors");
const errors_1 = require("../../../src/server/errors");
const logging_1 = require("../../../src/server/logging");
const managers_1 = require("../../../src/server/managers");
const AppApi_1 = require("../../../src/server/managers/AppApi");
const appBridges_1 = require("../../test-data/bridges/appBridges");
const logStorage_1 = require("../../test-data/storage/logStorage");
const utilities_1 = require("../../test-data/utilities");
let AppApiManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _setup_decorators;
    let _teardown_decorators;
    let _basicAppApiManager_decorators;
    let _registerApi_decorators;
    let _addApi_decorators;
    let _registerApis_decorators;
    let _unregisterApis_decorators;
    let _executeApis_decorators;
    let _listApis_decorators;
    return _a = class AppApiManagerTestFixture {
            constructor() {
                this.mockBridges = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                this.mockApp = {
                    getRuntime() {
                        return {
                            runInSandbox: () => Promise.resolve(true),
                        };
                    },
                    getDenoRuntime() {
                        return {
                            sendRequest: () => Promise.resolve(true),
                        };
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
                    getApiManager() {
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
                };
                this.mockAccessors = new managers_1.AppAccessorManager(this.mockManager);
                const ac = this.mockAccessors;
                this.mockManager.getAccessorManager = function _getAccessorManager() {
                    return ac;
                };
            }
            setup() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                const bri = this.mockBridges;
                this.mockManager.getBridges = function _refreshedGetBridges() {
                    return bri;
                };
                this.spies = [];
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getApiBridge(), 'doRegisterApi'));
                this.spies.push((0, alsatian_1.SpyOn)(this.mockBridges.getApiBridge(), 'doUnregisterApis'));
            }
            teardown() {
                this.spies.forEach((s) => s.restore());
            }
            basicAppApiManager() {
                (0, alsatian_1.Expect)(() => new managers_1.AppApiManager({})).toThrow();
                (0, alsatian_1.Expect)(() => new managers_1.AppApiManager(this.mockManager)).not.toThrow();
                const ascm = new managers_1.AppApiManager(this.mockManager);
                (0, alsatian_1.Expect)(ascm.manager).toBe(this.mockManager);
                (0, alsatian_1.Expect)(ascm.bridge).toBe(this.mockBridges.getApiBridge());
                (0, alsatian_1.Expect)(ascm.accessors).toBe(this.mockManager.getAccessorManager());
                (0, alsatian_1.Expect)(ascm.providedApis).toBeDefined();
                (0, alsatian_1.Expect)(ascm.providedApis.size).toBe(0);
            }
            registerApi() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppApiManager(this.mockManager);
                    const api = utilities_1.TestData.getApi('path');
                    const regInfo = new AppApi_1.AppApi(this.mockApp, api, api.endpoints[0]);
                    yield (0, alsatian_1.Expect)(() => ascm.registerApi('testing', regInfo)).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getApiBridge().doRegisterApi).toHaveBeenCalledWith(regInfo, 'testing');
                });
            }
            addApi() {
                const api = utilities_1.TestData.getApi('apipath');
                const ascm = new managers_1.AppApiManager(this.mockManager);
                (0, alsatian_1.Expect)(() => ascm.addApi('testing', api)).not.toThrow();
                (0, alsatian_1.Expect)(this.mockBridges.getApiBridge().apis.size).toBe(1);
                (0, alsatian_1.Expect)(ascm.providedApis.size).toBe(1);
                (0, alsatian_1.Expect)(ascm.providedApis.get('testing').get('apipath').api).toBe(api);
                (0, alsatian_1.Expect)(() => ascm.addApi('testing', api)).toThrowError(errors_1.PathAlreadyExistsError, 'The api path "apipath" already exists in the system.');
                (0, alsatian_1.Expect)(() => ascm.addApi('failMePlease', utilities_1.TestData.getApi('yet-another'))).toThrowError(Error, 'App must exist in order for an api to be added.');
                (0, alsatian_1.Expect)(() => ascm.addApi('testing', utilities_1.TestData.getApi('another-api'))).not.toThrow();
                (0, alsatian_1.Expect)(ascm.providedApis.size).toBe(1);
                (0, alsatian_1.Expect)(ascm.providedApis.get('testing').size).toBe(2);
            }
            registerApis() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppApiManager(this.mockManager);
                    (0, alsatian_1.SpyOn)(ascm, 'registerApi');
                    ascm.addApi('testing', utilities_1.TestData.getApi('apipath'));
                    const regInfo = ascm.providedApis.get('testing').get('apipath');
                    yield (0, alsatian_1.Expect)(() => ascm.registerApis('non-existant')).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.registerApis('testing')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(ascm.registerApi)
                        .toHaveBeenCalledWith('testing', regInfo)
                        .exactly(1);
                    (0, alsatian_1.Expect)(this.mockBridges.getApiBridge().doRegisterApi).toHaveBeenCalledWith(regInfo, 'testing').exactly(1);
                });
            }
            unregisterApis() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppApiManager(this.mockManager);
                    ascm.addApi('testing', utilities_1.TestData.getApi('apipath'));
                    yield (0, alsatian_1.Expect)(() => ascm.unregisterApis('non-existant')).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.unregisterApis('testing')).not.toThrowAsync();
                    (0, alsatian_1.Expect)(this.mockBridges.getApiBridge().doUnregisterApis).toHaveBeenCalled().exactly(1);
                });
            }
            executeApis() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ascm = new managers_1.AppApiManager(this.mockManager);
                    ascm.addApi('testing', utilities_1.TestData.getApi('api1'));
                    ascm.addApi('testing', utilities_1.TestData.getApi('api2'));
                    ascm.addApi('testing', utilities_1.TestData.getApi('api3'));
                    ascm.registerApis('testing');
                    const request = {
                        method: accessors_1.RequestMethod.GET,
                        headers: {},
                        query: {},
                        params: {},
                        content: '',
                    };
                    yield (0, alsatian_1.Expect)(() => ascm.executeApi('testing', 'nope', request)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeApi('testing', 'not-exists', request)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeApi('testing', 'api1', request)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeApi('testing', 'api2', request)).not.toThrowAsync();
                    yield (0, alsatian_1.Expect)(() => ascm.executeApi('testing', 'api3', request)).not.toThrowAsync();
                });
            }
            listApis() {
                const ascm = new managers_1.AppApiManager(this.mockManager);
                (0, alsatian_1.Expect)(ascm.listApis('testing')).toEqual([]);
                ascm.addApi('testing', utilities_1.TestData.getApi('api1'));
                ascm.registerApis('testing');
                (0, alsatian_1.Expect)(() => ascm.listApis('testing')).not.toThrow();
                (0, alsatian_1.Expect)(ascm.listApis('testing')).not.toEqual([]);
                (0, alsatian_1.Expect)(ascm.listApis('testing')).toEqual([
                    {
                        path: 'api1',
                        computedPath: '/api/apps/public/testing/api1',
                        methods: ['get'],
                        examples: {},
                    },
                ]);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _setup_decorators = [alsatian_1.Setup];
            _teardown_decorators = [alsatian_1.Teardown];
            _basicAppApiManager_decorators = [(0, alsatian_1.Test)()];
            _registerApi_decorators = [(0, alsatian_1.AsyncTest)()];
            _addApi_decorators = [(0, alsatian_1.Test)()];
            _registerApis_decorators = [(0, alsatian_1.AsyncTest)()];
            _unregisterApis_decorators = [(0, alsatian_1.AsyncTest)()];
            _executeApis_decorators = [(0, alsatian_1.AsyncTest)()];
            _listApis_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicAppApiManager_decorators, { kind: "method", name: "basicAppApiManager", static: false, private: false, access: { has: obj => "basicAppApiManager" in obj, get: obj => obj.basicAppApiManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerApi_decorators, { kind: "method", name: "registerApi", static: false, private: false, access: { has: obj => "registerApi" in obj, get: obj => obj.registerApi }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addApi_decorators, { kind: "method", name: "addApi", static: false, private: false, access: { has: obj => "addApi" in obj, get: obj => obj.addApi }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerApis_decorators, { kind: "method", name: "registerApis", static: false, private: false, access: { has: obj => "registerApis" in obj, get: obj => obj.registerApis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _unregisterApis_decorators, { kind: "method", name: "unregisterApis", static: false, private: false, access: { has: obj => "unregisterApis" in obj, get: obj => obj.unregisterApis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _executeApis_decorators, { kind: "method", name: "executeApis", static: false, private: false, access: { has: obj => "executeApis" in obj, get: obj => obj.executeApis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _listApis_decorators, { kind: "method", name: "listApis", static: false, private: false, access: { has: obj => "listApis" in obj, get: obj => obj.listApis }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.doThrow = false,
        _a;
})();
exports.AppApiManagerTestFixture = AppApiManagerTestFixture;
