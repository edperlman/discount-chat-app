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
exports.AppAccessorManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const managers_1 = require("../../../src/server/managers");
const appBridges_1 = require("../../test-data/bridges/appBridges");
let AppAccessorManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _setup_decorators;
    let _teardown_decorators;
    let _basicAppAccessorManager_decorators;
    let _configurationExtend_decorators;
    let _environmentRead_decorators;
    let _configurationModify_decorators;
    let _reader_decorators;
    let _modifier_decorators;
    let _persistence_decorators;
    let _http_decorators;
    return _a = class AppAccessorManagerTestFixture {
            constructor() {
                this.bridges = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.bridges = new appBridges_1.TestsAppBridges();
                const brds = this.bridges;
                this.manager = {
                    getBridges() {
                        return brds;
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
                        return appId === 'testing' ? {} : undefined;
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
            }
            setup() {
                this.spies = [];
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getServerSettingBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getEnvironmentalVariableBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getMessageBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getPersistenceBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getRoomBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.bridges, 'getUserBridge'));
                this.spies.push((0, alsatian_1.SpyOn)(this.manager, 'getBridges'));
                this.spies.push((0, alsatian_1.SpyOn)(this.manager, 'getCommandManager'));
                this.spies.push((0, alsatian_1.SpyOn)(this.manager, 'getExternalComponentManager'));
                this.spies.push((0, alsatian_1.SpyOn)(this.manager, 'getApiManager'));
            }
            teardown() {
                this.spies.forEach((s) => s.restore());
            }
            basicAppAccessorManager() {
                (0, alsatian_1.Expect)(() => new managers_1.AppAccessorManager(this.manager)).not.toThrow();
                (0, alsatian_1.Expect)(() => new managers_1.AppAccessorManager(this.manager).purifyApp('testing')).not.toThrow();
            }
            configurationExtend() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getConfigurationExtend('testing')).toBeDefined();
                (0, alsatian_1.Expect)(() => acm.getConfigurationExtend('fake')).toThrowError(Error, 'No App found by the provided id: fake');
                (0, alsatian_1.Expect)(acm.getConfigurationExtend('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.manager.getExternalComponentManager).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.manager.getCommandManager).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.manager.getApiManager).toHaveBeenCalled().exactly(1);
            }
            environmentRead() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getEnvironmentRead('testing')).toBeDefined();
                (0, alsatian_1.Expect)(() => acm.getEnvironmentRead('fake')).toThrowError(Error, 'No App found by the provided id: fake');
                (0, alsatian_1.Expect)(acm.getEnvironmentRead('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.bridges.getServerSettingBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getEnvironmentalVariableBridge).toHaveBeenCalled().exactly(1);
            }
            configurationModify() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getConfigurationModify('testing')).toBeDefined();
                (0, alsatian_1.Expect)(acm.getConfigurationModify('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.bridges.getServerSettingBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.manager.getCommandManager).toHaveBeenCalled().exactly(1);
            }
            reader() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getReader('testing')).toBeDefined();
                (0, alsatian_1.Expect)(acm.getReader('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.bridges.getServerSettingBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getEnvironmentalVariableBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getPersistenceBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getRoomBridge).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getUserBridge).toHaveBeenCalled().exactly(2);
                (0, alsatian_1.Expect)(this.bridges.getMessageBridge).toHaveBeenCalled().exactly(2);
            }
            modifier() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getModifier('testing')).toBeDefined();
                (0, alsatian_1.Expect)(acm.getModifier('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.manager.getBridges).toHaveBeenCalled().exactly(1);
                (0, alsatian_1.Expect)(this.bridges.getMessageBridge).toHaveBeenCalled().exactly(1);
            }
            persistence() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getPersistence('testing')).toBeDefined();
                (0, alsatian_1.Expect)(acm.getPersistence('testing')).toBeDefined();
                (0, alsatian_1.Expect)(this.bridges.getPersistenceBridge).toHaveBeenCalled().exactly(1);
            }
            http() {
                const acm = new managers_1.AppAccessorManager(this.manager);
                (0, alsatian_1.Expect)(acm.getHttp('testing')).toBeDefined();
                (0, alsatian_1.Expect)(acm.getHttp('testing')).toBeDefined();
                acm.https.delete('testing');
                (0, alsatian_1.Expect)(acm.getHttp('testing')).toBeDefined();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _setup_decorators = [alsatian_1.Setup];
            _teardown_decorators = [alsatian_1.Teardown];
            _basicAppAccessorManager_decorators = [(0, alsatian_1.Test)()];
            _configurationExtend_decorators = [(0, alsatian_1.Test)()];
            _environmentRead_decorators = [(0, alsatian_1.Test)()];
            _configurationModify_decorators = [(0, alsatian_1.Test)()];
            _reader_decorators = [(0, alsatian_1.Test)()];
            _modifier_decorators = [(0, alsatian_1.Test)()];
            _persistence_decorators = [(0, alsatian_1.Test)()];
            _http_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicAppAccessorManager_decorators, { kind: "method", name: "basicAppAccessorManager", static: false, private: false, access: { has: obj => "basicAppAccessorManager" in obj, get: obj => obj.basicAppAccessorManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _configurationExtend_decorators, { kind: "method", name: "configurationExtend", static: false, private: false, access: { has: obj => "configurationExtend" in obj, get: obj => obj.configurationExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _environmentRead_decorators, { kind: "method", name: "environmentRead", static: false, private: false, access: { has: obj => "environmentRead" in obj, get: obj => obj.environmentRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _configurationModify_decorators, { kind: "method", name: "configurationModify", static: false, private: false, access: { has: obj => "configurationModify" in obj, get: obj => obj.configurationModify }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _reader_decorators, { kind: "method", name: "reader", static: false, private: false, access: { has: obj => "reader" in obj, get: obj => obj.reader }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _modifier_decorators, { kind: "method", name: "modifier", static: false, private: false, access: { has: obj => "modifier" in obj, get: obj => obj.modifier }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _persistence_decorators, { kind: "method", name: "persistence", static: false, private: false, access: { has: obj => "persistence" in obj, get: obj => obj.persistence }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _http_decorators, { kind: "method", name: "http", static: false, private: false, access: { has: obj => "http" in obj, get: obj => obj.http }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppAccessorManagerTestFixture = AppAccessorManagerTestFixture;
