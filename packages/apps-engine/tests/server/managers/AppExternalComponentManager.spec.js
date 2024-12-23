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
exports.AppExternalComponentManagerTestFixture = void 0;
const alsatian_1 = require("alsatian");
const IExternalComponent_1 = require("../../../src/definition/externalComponent/IExternalComponent");
const managers_1 = require("../../../src/server/managers");
let AppExternalComponentManagerTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _basicAppExternalComponentManager_decorators;
    let _verifyGetRegisteredExternalComponents_decorators;
    let _verifyGetAppTouchedExternalComponents_decorators;
    let _verifyGetExternalComponents_decorators;
    let _verifyGetProvidedComponents_decorators;
    let _verifyAddExternalComponent_decorators;
    let _verifyRegisterExternalComponents_decorators;
    let _verifyUnregisterExternalComponents_decorators;
    let _verifyPurgeExternalComponents_decorators;
    return _a = class AppExternalComponentManagerTestFixture {
            constructor() {
                this.mockExternalComponent1 = __runInitializers(this, _instanceExtraInitializers);
            }
            register(aecm, externalComponent) {
                const { appId } = externalComponent;
                aecm.addExternalComponent(appId, externalComponent);
                aecm.registerExternalComponents(appId);
            }
            setupFixture() {
                this.mockExternalComponent1 = {
                    appId: '1eb382c0-3679-44a6-8af0-18802e342fb1',
                    name: 'TestExternalComponent1',
                    description: 'TestExternalComponent1',
                    url: '',
                    icon: '',
                    location: IExternalComponent_1.ExternalComponentLocation.CONTEXTUAL_BAR,
                };
                this.mockExternalComponent2 = {
                    appId: '125a944b-9747-4e6e-b029-6e9b26bb3481',
                    name: 'TestExternalComponent2',
                    description: 'TestExternalComponent2',
                    url: '',
                    icon: '',
                    location: IExternalComponent_1.ExternalComponentLocation.CONTEXTUAL_BAR,
                };
                this.mockExternalComponent3 = Object.assign(Object.assign({}, this.mockExternalComponent2), { appId: this.mockExternalComponent1.appId, name: this.mockExternalComponent2.name, description: 'TestExternalComponent3' });
                this.mockAppExternalComponentManager = new managers_1.AppExternalComponentManager();
                this.mockAppExternalComponentManager.addExternalComponent(this.mockExternalComponent1.appId, this.mockExternalComponent1);
            }
            basicAppExternalComponentManager() {
                const aecm = new managers_1.AppExternalComponentManager();
                (0, alsatian_1.Expect)(aecm.registeredExternalComponents.size).toBe(0);
                (0, alsatian_1.Expect)(aecm.appTouchedExternalComponents.size).toBe(0);
            }
            verifyGetRegisteredExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(0);
                this.register(aecm, component);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(1);
            }
            verifyGetAppTouchedExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(0);
                aecm.addExternalComponent(component.appId, component);
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(1);
            }
            verifyGetExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                (0, alsatian_1.Expect)(aecm.getExternalComponents(component.appId)).toBe(null);
                aecm.addExternalComponent(component.appId, component);
                (0, alsatian_1.Expect)(aecm.getExternalComponents(component.appId).size).toBe(1);
            }
            verifyGetProvidedComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component1 = this.mockExternalComponent1;
                const component2 = this.mockExternalComponent2;
                (0, alsatian_1.Expect)(Array.isArray(aecm.getProvidedComponents())).toBe(true);
                this.register(aecm, component1);
                this.register(aecm, component2);
                (0, alsatian_1.Expect)(aecm.getProvidedComponents().length).toBe(2);
            }
            verifyAddExternalComponent() {
                const aecm1 = new managers_1.AppExternalComponentManager();
                const component1 = this.mockExternalComponent1;
                const component3 = this.mockExternalComponent3;
                aecm1.addExternalComponent(component1.appId, component1);
                (0, alsatian_1.Expect)(aecm1.getAppTouchedExternalComponents().size).toBe(1);
                (0, alsatian_1.Expect)(aecm1.getExternalComponents(component1.appId).size).toBe(1);
                aecm1.addExternalComponent(component1.appId, component3);
                (0, alsatian_1.Expect)(aecm1.getExternalComponents(component1.appId).size).toBe(2);
            }
            verifyRegisterExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(0);
                this.register(aecm, component);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(1);
            }
            verifyUnregisterExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                this.register(aecm, component);
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(1);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(1);
                aecm.unregisterExternalComponents(component.appId);
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(1);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(0);
            }
            verifyPurgeExternalComponents() {
                const aecm = new managers_1.AppExternalComponentManager();
                const component = this.mockExternalComponent1;
                this.register(aecm, component);
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(1);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(1);
                aecm.purgeExternalComponents(component.appId);
                (0, alsatian_1.Expect)(aecm.getAppTouchedExternalComponents().size).toBe(0);
                (0, alsatian_1.Expect)(aecm.getRegisteredExternalComponents().size).toBe(0);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _basicAppExternalComponentManager_decorators = [(0, alsatian_1.Test)()];
            _verifyGetRegisteredExternalComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyGetAppTouchedExternalComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyGetExternalComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyGetProvidedComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyAddExternalComponent_decorators = [(0, alsatian_1.Test)()];
            _verifyRegisterExternalComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyUnregisterExternalComponents_decorators = [(0, alsatian_1.Test)()];
            _verifyPurgeExternalComponents_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicAppExternalComponentManager_decorators, { kind: "method", name: "basicAppExternalComponentManager", static: false, private: false, access: { has: obj => "basicAppExternalComponentManager" in obj, get: obj => obj.basicAppExternalComponentManager }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyGetRegisteredExternalComponents_decorators, { kind: "method", name: "verifyGetRegisteredExternalComponents", static: false, private: false, access: { has: obj => "verifyGetRegisteredExternalComponents" in obj, get: obj => obj.verifyGetRegisteredExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyGetAppTouchedExternalComponents_decorators, { kind: "method", name: "verifyGetAppTouchedExternalComponents", static: false, private: false, access: { has: obj => "verifyGetAppTouchedExternalComponents" in obj, get: obj => obj.verifyGetAppTouchedExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyGetExternalComponents_decorators, { kind: "method", name: "verifyGetExternalComponents", static: false, private: false, access: { has: obj => "verifyGetExternalComponents" in obj, get: obj => obj.verifyGetExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyGetProvidedComponents_decorators, { kind: "method", name: "verifyGetProvidedComponents", static: false, private: false, access: { has: obj => "verifyGetProvidedComponents" in obj, get: obj => obj.verifyGetProvidedComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyAddExternalComponent_decorators, { kind: "method", name: "verifyAddExternalComponent", static: false, private: false, access: { has: obj => "verifyAddExternalComponent" in obj, get: obj => obj.verifyAddExternalComponent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyRegisterExternalComponents_decorators, { kind: "method", name: "verifyRegisterExternalComponents", static: false, private: false, access: { has: obj => "verifyRegisterExternalComponents" in obj, get: obj => obj.verifyRegisterExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyUnregisterExternalComponents_decorators, { kind: "method", name: "verifyUnregisterExternalComponents", static: false, private: false, access: { has: obj => "verifyUnregisterExternalComponents" in obj, get: obj => obj.verifyUnregisterExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _verifyPurgeExternalComponents_decorators, { kind: "method", name: "verifyPurgeExternalComponents", static: false, private: false, access: { has: obj => "verifyPurgeExternalComponents" in obj, get: obj => obj.verifyPurgeExternalComponents }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppExternalComponentManagerTestFixture = AppExternalComponentManagerTestFixture;
