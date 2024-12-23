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
exports.AppManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppManager_1 = require("../../src/server/AppManager");
const bridges_1 = require("../../src/server/bridges");
const compiler_1 = require("../../src/server/compiler");
const managers_1 = require("../../src/server/managers");
const utilities_1 = require("../test-data/utilities");
let AppManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _teardown_decorators;
    let _setupAppManager_decorators;
    let _invalidInstancesPassed_decorators;
    let _verifyManagers_decorators;
    return _a = class AppManagerTestFixture {
            constructor() {
                this.testingInfastructure = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.testingInfastructure = new utilities_1.TestInfastructureSetup();
            }
            teardown() {
                AppManager_1.AppManager.Instance = undefined;
            }
            setupAppManager() {
                const manager = new AppManager_1.AppManager({
                    metadataStorage: this.testingInfastructure.getAppStorage(),
                    logStorage: this.testingInfastructure.getLogStorage(),
                    bridges: this.testingInfastructure.getAppBridges(),
                    sourceStorage: this.testingInfastructure.getSourceStorage(),
                });
                (0, alsatian_1.Expect)(manager.getStorage()).toBe(this.testingInfastructure.getAppStorage());
                (0, alsatian_1.Expect)(manager.getLogStorage()).toBe(this.testingInfastructure.getLogStorage());
                // NOTE: manager.getBridges() returns a proxy, so they are vlaue equality instead of reference equality
                (0, alsatian_1.Expect)(manager.getBridges()).toEqual(this.testingInfastructure.getAppBridges());
                (0, alsatian_1.Expect)(manager.areAppsLoaded()).toBe(false);
                (0, alsatian_1.Expect)(() => new AppManager_1.AppManager({
                    metadataStorage: {},
                    logStorage: {},
                    bridges: {},
                    sourceStorage: {},
                })).toThrowError(Error, 'There is already a valid AppManager instance');
            }
            invalidInstancesPassed() {
                const invalid = new utilities_1.SimpleClass();
                (0, alsatian_1.Expect)(() => new AppManager_1.AppManager({
                    metadataStorage: invalid,
                    logStorage: invalid,
                    bridges: invalid,
                    sourceStorage: invalid,
                })).toThrowError(Error, 'Invalid instance of the AppMetadataStorage');
                (0, alsatian_1.Expect)(() => new AppManager_1.AppManager({
                    metadataStorage: this.testingInfastructure.getAppStorage(),
                    logStorage: invalid,
                    bridges: invalid,
                    sourceStorage: invalid,
                })).toThrowError(Error, 'Invalid instance of the AppLogStorage');
                (0, alsatian_1.Expect)(() => new AppManager_1.AppManager({
                    metadataStorage: this.testingInfastructure.getAppStorage(),
                    logStorage: this.testingInfastructure.getLogStorage(),
                    bridges: invalid,
                    sourceStorage: invalid,
                })).toThrowError(Error, 'Invalid instance of the AppBridges');
                (0, alsatian_1.Expect)(() => new AppManager_1.AppManager({
                    metadataStorage: this.testingInfastructure.getAppStorage(),
                    logStorage: this.testingInfastructure.getLogStorage(),
                    bridges: this.testingInfastructure.getAppBridges(),
                    sourceStorage: invalid,
                })).toThrowError(Error, 'Invalid instance of the AppSourceStorage');
            }
            verifyManagers() {
                const manager = new AppManager_1.AppManager({
                    metadataStorage: this.testingInfastructure.getAppStorage(),
                    logStorage: this.testingInfastructure.getLogStorage(),
                    bridges: this.testingInfastructure.getAppBridges(),
                    sourceStorage: this.testingInfastructure.getSourceStorage(),
                });
                (0, alsatian_1.Expect)(manager.getParser() instanceof compiler_1.AppPackageParser).toBe(true);
                (0, alsatian_1.Expect)(manager.getCompiler() instanceof compiler_1.AppCompiler).toBe(true);
                (0, alsatian_1.Expect)(manager.getAccessorManager() instanceof managers_1.AppAccessorManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getBridges() instanceof bridges_1.AppBridges).toBe(true);
                (0, alsatian_1.Expect)(manager.getListenerManager() instanceof managers_1.AppListenerManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getCommandManager() instanceof managers_1.AppSlashCommandManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getExternalComponentManager() instanceof managers_1.AppExternalComponentManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getApiManager() instanceof managers_1.AppApiManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getSettingsManager() instanceof managers_1.AppSettingsManager).toBe(true);
                (0, alsatian_1.Expect)(manager.getVideoConfProviderManager() instanceof managers_1.AppVideoConfProviderManager).toBe(true);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _teardown_decorators = [alsatian_1.Teardown];
            _setupAppManager_decorators = [(0, alsatian_1.Test)('Setup of the AppManager')];
            _invalidInstancesPassed_decorators = [(0, alsatian_1.Test)('Invalid Storage and Bridge')];
            _verifyManagers_decorators = [(0, alsatian_1.Test)('Ensure Managers are Valid Types')];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setupAppManager_decorators, { kind: "method", name: "setupAppManager", static: false, private: false, access: { has: obj => "setupAppManager" in obj, get: obj => obj.setupAppManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _invalidInstancesPassed_decorators, { kind: "method", name: "invalidInstancesPassed", static: false, private: false, access: { has: obj => "invalidInstancesPassed" in obj, get: obj => obj.invalidInstancesPassed }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyManagers_decorators, { kind: "method", name: "verifyManagers", static: false, private: false, access: { has: obj => "verifyManagers" in obj, get: obj => obj.verifyManagers }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppManagerTestFixture = AppManagerTestFixture;
