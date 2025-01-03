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
exports.AppSlashCommandRegistrationTestFixture = void 0;
const alsatian_1 = require("alsatian");
const AppSlashCommand_1 = require("../../../src/server/managers/AppSlashCommand");
let AppSlashCommandRegistrationTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _ensureAppSlashCommand_decorators;
    return _a = class AppSlashCommandRegistrationTestFixture {
            constructor() {
                this.mockApp = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockApp = {};
            }
            ensureAppSlashCommand() {
                (0, alsatian_1.Expect)(() => new AppSlashCommand_1.AppSlashCommand(this.mockApp, {})).not.toThrow();
                const ascr = new AppSlashCommand_1.AppSlashCommand(this.mockApp, {});
                (0, alsatian_1.Expect)(ascr.isRegistered).toBe(false);
                (0, alsatian_1.Expect)(ascr.isEnabled).toBe(false);
                (0, alsatian_1.Expect)(ascr.isDisabled).toBe(false);
                ascr.hasBeenRegistered();
                (0, alsatian_1.Expect)(ascr.isDisabled).toBe(false);
                (0, alsatian_1.Expect)(ascr.isEnabled).toBe(true);
                (0, alsatian_1.Expect)(ascr.isRegistered).toBe(true);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _ensureAppSlashCommand_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _ensureAppSlashCommand_decorators, { kind: "method", name: "ensureAppSlashCommand", static: false, private: false, access: { has: obj => "ensureAppSlashCommand" in obj, get: obj => obj.ensureAppSlashCommand }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppSlashCommandRegistrationTestFixture = AppSlashCommandRegistrationTestFixture;