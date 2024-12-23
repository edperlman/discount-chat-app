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
exports.AppVideoConfProviderManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const errors_1 = require("../../../src/server/errors");
const managers_1 = require("../../../src/server/managers");
const AppVideoConfProvider_1 = require("../../../src/server/managers/AppVideoConfProvider");
const appBridges_1 = require("../../test-data/bridges/appBridges");
const logStorage_1 = require("../../test-data/storage/logStorage");
const utilities_1 = require("../../test-data/utilities");
let AppVideoConfProviderManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _setup_decorators;
    let _teardown_decorators;
    let _basicAppVideoConfProviderManager_decorators;
    let _addProvider_decorators;
    let _ignoreAppsWithoutProviders_decorators;
    let _registerProviders_decorators;
    let _registerTwoProviders_decorators;
    let _registerProvidersFromMultipleApps_decorators;
    let _failToRegisterSameProvider_decorators;
    let _unregisterProviders_decorators;
    let _failToGenerateUrlWithoutProvider_decorators;
    let _generateUrl_decorators;
    let _generateUrlWithMultipleProvidersAvailable_decorators;
    let _failToGenerateUrlWithUnknownProvider_decorators;
    let _failToGenerateUrlWithUnregisteredProvider_decorators;
    let _failToCustomizeUrlWithoutProvider_decorators;
    let _customizeUrl_decorators;
    let _customizeUrlWithMultipleProvidersAvailable_decorators;
    let _failToCustomizeUrlWithUnknownProvider_decorators;
    let _failToCustomizeUrlWithUnregisteredProvider_decorators;
    return _a = class AppVideoConfProviderManagerTestFixture {
            constructor() {
                this.mockBridges = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockBridges = new appBridges_1.TestsAppBridges();
                this.mockApp = utilities_1.TestData.getMockApp('testing', 'testing');
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
            setup() { }
            teardown() { }
            basicAppVideoConfProviderManager() {
                (0, alsatian_1.Expect)(() => new managers_1.AppVideoConfProviderManager({})).toThrow();
                (0, alsatian_1.Expect)(() => new managers_1.AppVideoConfProviderManager(this.mockManager)).not.toThrow();
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                (0, alsatian_1.Expect)(manager.manager).toBe(this.mockManager);
                (0, alsatian_1.Expect)(manager.accessors).toBe(this.mockManager.getAccessorManager());
                (0, alsatian_1.Expect)(manager.videoConfProviders).toBeDefined();
                (0, alsatian_1.Expect)(manager.videoConfProviders.size).toBe(0);
            }
            addProvider() {
                const provider = utilities_1.TestData.getVideoConfProvider();
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                (0, alsatian_1.Expect)(() => manager.addProvider('testing', provider)).not.toThrow();
                (0, alsatian_1.Expect)(manager.videoConfProviders.size).toBe(1);
                (0, alsatian_1.Expect)(() => manager.addProvider('failMePlease', provider)).toThrowError(Error, 'App must exist in order for a video conference provider to be added.');
                (0, alsatian_1.Expect)(manager.videoConfProviders.size).toBe(1);
            }
            ignoreAppsWithoutProviders() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                (0, alsatian_1.Expect)(() => manager.registerProviders('non-existant')).not.toThrow();
            }
            registerProviders() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider());
                const appInfo = manager.videoConfProviders.get('firstApp');
                (0, alsatian_1.Expect)(appInfo).toBeDefined();
                const regInfo = appInfo.get('test');
                (0, alsatian_1.Expect)(regInfo).toBeDefined();
                (0, alsatian_1.Expect)(regInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(() => manager.registerProviders('firstApp')).not.toThrow();
                (0, alsatian_1.Expect)(regInfo.isRegistered).toBe(true);
            }
            registerTwoProviders() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider());
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider('another-test'));
                const firstApp = manager.videoConfProviders.get('firstApp');
                (0, alsatian_1.Expect)(firstApp).toBeDefined();
                const firstRegInfo = firstApp.get('test');
                (0, alsatian_1.Expect)(firstRegInfo).toBeDefined();
                const secondRegInfo = firstApp.get('another-test');
                (0, alsatian_1.Expect)(secondRegInfo).toBeDefined();
                (0, alsatian_1.Expect)(firstRegInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(secondRegInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(() => manager.registerProviders('firstApp')).not.toThrow();
                (0, alsatian_1.Expect)(firstRegInfo.isRegistered).toBe(true);
                (0, alsatian_1.Expect)(secondRegInfo.isRegistered).toBe(true);
            }
            registerProvidersFromMultipleApps() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider());
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider('another-test'));
                manager.addProvider('secondApp', utilities_1.TestData.getVideoConfProvider('test3'));
                const firstApp = manager.videoConfProviders.get('firstApp');
                (0, alsatian_1.Expect)(firstApp).toBeDefined();
                const firstRegInfo = firstApp.get('test');
                const secondRegInfo = firstApp.get('another-test');
                (0, alsatian_1.Expect)(firstRegInfo).toBeDefined();
                (0, alsatian_1.Expect)(secondRegInfo).toBeDefined();
                const secondApp = manager.videoConfProviders.get('secondApp');
                (0, alsatian_1.Expect)(secondApp).toBeDefined();
                const thirdRegInfo = secondApp.get('test3');
                (0, alsatian_1.Expect)(thirdRegInfo).toBeDefined();
                (0, alsatian_1.Expect)(firstRegInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(secondRegInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(() => manager.registerProviders('firstApp')).not.toThrow();
                (0, alsatian_1.Expect)(firstRegInfo.isRegistered).toBe(true);
                (0, alsatian_1.Expect)(secondRegInfo.isRegistered).toBe(true);
                (0, alsatian_1.Expect)(thirdRegInfo.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(() => manager.registerProviders('secondApp')).not.toThrow();
                (0, alsatian_1.Expect)(thirdRegInfo.isRegistered).toBe(true);
            }
            failToRegisterSameProvider() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                manager.addProvider('firstApp', utilities_1.TestData.getVideoConfProvider());
                (0, alsatian_1.Expect)(() => manager.addProvider('secondApp', utilities_1.TestData.getVideoConfProvider('test'))).toThrowError(errors_1.VideoConfProviderAlreadyExistsError, `The video conference provider "test" was already registered by another App.`);
            }
            unregisterProviders() {
                const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                const regInfo = manager.videoConfProviders.get('testing').get('test');
                (0, alsatian_1.Expect)(() => manager.registerProviders('testing')).not.toThrow();
                (0, alsatian_1.Expect)(() => manager.unregisterProviders('non-existant')).not.toThrow();
                (0, alsatian_1.Expect)(regInfo.isRegistered).toBe(true);
                (0, alsatian_1.Expect)(() => manager.unregisterProviders('testing')).not.toThrow();
                (0, alsatian_1.Expect)(regInfo.isRegistered).toBe(false);
            }
            failToGenerateUrlWithoutProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    const call = utilities_1.TestData.getVideoConfData();
                    yield (0, alsatian_1.Expect)(() => __awaiter(this, void 0, void 0, function* () { return manager.generateUrl('test', call); })).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "test" is not registered in the system.`);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    yield (0, alsatian_1.Expect)(() => manager.generateUrl('test', call)).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "test" is not registered in the system.`);
                });
            }
            generateUrl() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    manager.registerProviders('testing');
                    const call = utilities_1.TestData.getVideoConfData();
                    (0, alsatian_1.SpyOn)(AppVideoConfProvider_1.AppVideoConfProvider.prototype, 'runGenerateUrl').andReturn('test/first-call');
                    const url = yield manager.generateUrl('test', call);
                    yield (0, alsatian_1.Expect)(url).toBe('test/first-call');
                });
            }
            generateUrlWithMultipleProvidersAvailable() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider('test2'));
                    manager.registerProviders('testing');
                    manager.addProvider('secondApp', utilities_1.TestData.getVideoConfProvider('differentProvider'));
                    manager.registerProviders('secondApp');
                    const call = utilities_1.TestData.getVideoConfData();
                    const cases = [
                        {
                            name: 'test',
                            call,
                            runGenerateUrl: 'test/first-call',
                            result: 'test/first-call',
                        },
                        {
                            name: 'test2',
                            call,
                            runGenerateUrl: 'test2/first-call',
                            result: 'test2/first-call',
                        },
                        {
                            name: 'differentProvider',
                            call,
                            runGenerateUrl: 'differentProvider/first-call',
                            result: 'differentProvider/first-call',
                        },
                    ];
                    for (const c of cases) {
                        (0, alsatian_1.SpyOn)(AppVideoConfProvider_1.AppVideoConfProvider.prototype, 'runGenerateUrl').andReturn(c.runGenerateUrl);
                        yield (0, alsatian_1.Expect)(yield manager.generateUrl(c.name, c.call)).toBe(c.result);
                    }
                });
            }
            failToGenerateUrlWithUnknownProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const call = utilities_1.TestData.getVideoConfData();
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => manager.generateUrl('unknownProvider', call)).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "unknownProvider" is not registered in the system.`);
                });
            }
            failToGenerateUrlWithUnregisteredProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const call = utilities_1.TestData.getVideoConfData();
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('unregisteredApp', utilities_1.TestData.getVideoConfProvider('unregisteredProvider'));
                    yield (0, alsatian_1.Expect)(() => manager.generateUrl('unregisteredProvider', call)).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "unregisteredProvider" is not registered in the system.`);
                });
            }
            failToCustomizeUrlWithoutProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    const call = utilities_1.TestData.getVideoConfDataExtended();
                    const user = utilities_1.TestData.getVideoConferenceUser();
                    yield (0, alsatian_1.Expect)(() => manager.customizeUrl('test', call, user, {})).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "test" is not registered in the system.`);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    yield (0, alsatian_1.Expect)(() => manager.customizeUrl('test', call, user, {})).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "test" is not registered in the system.`);
                });
            }
            customizeUrl() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    manager.registerProviders('testing');
                    const call = utilities_1.TestData.getVideoConfDataExtended();
                    const user = utilities_1.TestData.getVideoConferenceUser();
                    const cases = [
                        {
                            name: 'test',
                            call,
                            user,
                            options: {},
                            runCustomizeUrl: 'test/first-call#caller',
                            result: 'test/first-call#caller',
                        },
                        {
                            name: 'test',
                            call,
                            user: undefined,
                            options: {},
                            runCustomizeUrl: 'test/first-call#',
                            result: 'test/first-call#',
                        },
                    ];
                    for (const c of cases) {
                        (0, alsatian_1.SpyOn)(AppVideoConfProvider_1.AppVideoConfProvider.prototype, 'runCustomizeUrl').andReturn(c.runCustomizeUrl);
                        yield (0, alsatian_1.Expect)(yield manager.customizeUrl(c.name, c.call, c.user, c.options)).toBe(c.result);
                    }
                });
            }
            customizeUrlWithMultipleProvidersAvailable() {
                return __awaiter(this, void 0, void 0, function* () {
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider());
                    manager.addProvider('testing', utilities_1.TestData.getVideoConfProvider('test2'));
                    manager.registerProviders('testing');
                    manager.addProvider('secondApp', utilities_1.TestData.getVideoConfProvider('differentProvider'));
                    manager.registerProviders('secondApp');
                    const call = utilities_1.TestData.getVideoConfDataExtended();
                    const user = utilities_1.TestData.getVideoConferenceUser();
                    const cases = [
                        {
                            name: 'test',
                            call,
                            user,
                            options: {},
                            runCustomizeUrl: 'test/first-call#caller',
                            result: 'test/first-call#caller',
                        },
                        {
                            name: 'test',
                            call,
                            user: undefined,
                            options: {},
                            runCustomizeUrl: 'test/first-call#',
                            result: 'test/first-call#',
                        },
                        {
                            name: 'test2',
                            call,
                            user,
                            options: {},
                            runCustomizeUrl: 'test2/first-call#caller',
                            result: 'test2/first-call#caller',
                        },
                        {
                            name: 'test2',
                            call,
                            user: undefined,
                            options: {},
                            runCustomizeUrl: 'test2/first-call#',
                            result: 'test2/first-call#',
                        },
                        {
                            name: 'differentProvider',
                            call,
                            user,
                            options: {},
                            runCustomizeUrl: 'differentProvider/first-call#caller',
                            result: 'differentProvider/first-call#caller',
                        },
                        {
                            name: 'differentProvider',
                            call,
                            user: undefined,
                            options: {},
                            runCustomizeUrl: 'differentProvider/first-call#',
                            result: 'differentProvider/first-call#',
                        },
                    ];
                    for (const c of cases) {
                        (0, alsatian_1.SpyOn)(AppVideoConfProvider_1.AppVideoConfProvider.prototype, 'runCustomizeUrl').andReturn(c.runCustomizeUrl);
                        yield (0, alsatian_1.Expect)(yield manager.customizeUrl(c.name, c.call, c.user, c.options)).toBe(c.result);
                    }
                });
            }
            failToCustomizeUrlWithUnknownProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const call = utilities_1.TestData.getVideoConfDataExtended();
                    const user = utilities_1.TestData.getVideoConferenceUser();
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    yield (0, alsatian_1.Expect)(() => manager.customizeUrl('unknownProvider', call, user, {})).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "unknownProvider" is not registered in the system.`);
                });
            }
            failToCustomizeUrlWithUnregisteredProvider() {
                return __awaiter(this, void 0, void 0, function* () {
                    const call = utilities_1.TestData.getVideoConfDataExtended();
                    const user = utilities_1.TestData.getVideoConferenceUser();
                    const manager = new managers_1.AppVideoConfProviderManager(this.mockManager);
                    manager.addProvider('unregisteredApp', utilities_1.TestData.getVideoConfProvider('unregisteredProvider'));
                    yield (0, alsatian_1.Expect)(() => manager.customizeUrl('unregisteredProvider', call, user, {})).toThrowErrorAsync(errors_1.VideoConfProviderNotRegisteredError, `The video conference provider "unregisteredProvider" is not registered in the system.`);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _setup_decorators = [alsatian_1.Setup];
            _teardown_decorators = [alsatian_1.Teardown];
            _basicAppVideoConfProviderManager_decorators = [(0, alsatian_1.Test)()];
            _addProvider_decorators = [(0, alsatian_1.Test)()];
            _ignoreAppsWithoutProviders_decorators = [(0, alsatian_1.Test)()];
            _registerProviders_decorators = [(0, alsatian_1.Test)()];
            _registerTwoProviders_decorators = [(0, alsatian_1.Test)()];
            _registerProvidersFromMultipleApps_decorators = [(0, alsatian_1.Test)()];
            _failToRegisterSameProvider_decorators = [(0, alsatian_1.Test)()];
            _unregisterProviders_decorators = [(0, alsatian_1.Test)()];
            _failToGenerateUrlWithoutProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            _generateUrl_decorators = [(0, alsatian_1.AsyncTest)()];
            _generateUrlWithMultipleProvidersAvailable_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToGenerateUrlWithUnknownProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToGenerateUrlWithUnregisteredProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToCustomizeUrlWithoutProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            _customizeUrl_decorators = [(0, alsatian_1.AsyncTest)()];
            _customizeUrlWithMultipleProvidersAvailable_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToCustomizeUrlWithUnknownProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            _failToCustomizeUrlWithUnregisteredProvider_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicAppVideoConfProviderManager_decorators, { kind: "method", name: "basicAppVideoConfProviderManager", static: false, private: false, access: { has: obj => "basicAppVideoConfProviderManager" in obj, get: obj => obj.basicAppVideoConfProviderManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addProvider_decorators, { kind: "method", name: "addProvider", static: false, private: false, access: { has: obj => "addProvider" in obj, get: obj => obj.addProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _ignoreAppsWithoutProviders_decorators, { kind: "method", name: "ignoreAppsWithoutProviders", static: false, private: false, access: { has: obj => "ignoreAppsWithoutProviders" in obj, get: obj => obj.ignoreAppsWithoutProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerProviders_decorators, { kind: "method", name: "registerProviders", static: false, private: false, access: { has: obj => "registerProviders" in obj, get: obj => obj.registerProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerTwoProviders_decorators, { kind: "method", name: "registerTwoProviders", static: false, private: false, access: { has: obj => "registerTwoProviders" in obj, get: obj => obj.registerTwoProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _registerProvidersFromMultipleApps_decorators, { kind: "method", name: "registerProvidersFromMultipleApps", static: false, private: false, access: { has: obj => "registerProvidersFromMultipleApps" in obj, get: obj => obj.registerProvidersFromMultipleApps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToRegisterSameProvider_decorators, { kind: "method", name: "failToRegisterSameProvider", static: false, private: false, access: { has: obj => "failToRegisterSameProvider" in obj, get: obj => obj.failToRegisterSameProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _unregisterProviders_decorators, { kind: "method", name: "unregisterProviders", static: false, private: false, access: { has: obj => "unregisterProviders" in obj, get: obj => obj.unregisterProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToGenerateUrlWithoutProvider_decorators, { kind: "method", name: "failToGenerateUrlWithoutProvider", static: false, private: false, access: { has: obj => "failToGenerateUrlWithoutProvider" in obj, get: obj => obj.failToGenerateUrlWithoutProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _generateUrl_decorators, { kind: "method", name: "generateUrl", static: false, private: false, access: { has: obj => "generateUrl" in obj, get: obj => obj.generateUrl }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _generateUrlWithMultipleProvidersAvailable_decorators, { kind: "method", name: "generateUrlWithMultipleProvidersAvailable", static: false, private: false, access: { has: obj => "generateUrlWithMultipleProvidersAvailable" in obj, get: obj => obj.generateUrlWithMultipleProvidersAvailable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToGenerateUrlWithUnknownProvider_decorators, { kind: "method", name: "failToGenerateUrlWithUnknownProvider", static: false, private: false, access: { has: obj => "failToGenerateUrlWithUnknownProvider" in obj, get: obj => obj.failToGenerateUrlWithUnknownProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToGenerateUrlWithUnregisteredProvider_decorators, { kind: "method", name: "failToGenerateUrlWithUnregisteredProvider", static: false, private: false, access: { has: obj => "failToGenerateUrlWithUnregisteredProvider" in obj, get: obj => obj.failToGenerateUrlWithUnregisteredProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToCustomizeUrlWithoutProvider_decorators, { kind: "method", name: "failToCustomizeUrlWithoutProvider", static: false, private: false, access: { has: obj => "failToCustomizeUrlWithoutProvider" in obj, get: obj => obj.failToCustomizeUrlWithoutProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _customizeUrl_decorators, { kind: "method", name: "customizeUrl", static: false, private: false, access: { has: obj => "customizeUrl" in obj, get: obj => obj.customizeUrl }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _customizeUrlWithMultipleProvidersAvailable_decorators, { kind: "method", name: "customizeUrlWithMultipleProvidersAvailable", static: false, private: false, access: { has: obj => "customizeUrlWithMultipleProvidersAvailable" in obj, get: obj => obj.customizeUrlWithMultipleProvidersAvailable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToCustomizeUrlWithUnknownProvider_decorators, { kind: "method", name: "failToCustomizeUrlWithUnknownProvider", static: false, private: false, access: { has: obj => "failToCustomizeUrlWithUnknownProvider" in obj, get: obj => obj.failToCustomizeUrlWithUnknownProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _failToCustomizeUrlWithUnregisteredProvider_decorators, { kind: "method", name: "failToCustomizeUrlWithUnregisteredProvider", static: false, private: false, access: { has: obj => "failToCustomizeUrlWithUnregisteredProvider" in obj, get: obj => obj.failToCustomizeUrlWithUnregisteredProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.doThrow = false,
        _a;
})();
exports.AppVideoConfProviderManagerTestFixture = AppVideoConfProviderManagerTestFixture;
