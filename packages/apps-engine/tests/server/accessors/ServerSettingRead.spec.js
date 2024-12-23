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
exports.ServerSettingReadAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let ServerSettingReadAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _expectDataFromRoomRead_decorators;
    return _a = class ServerSettingReadAccessorTestFixture {
            constructor() {
                this.setting = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.setting = utilities_1.TestData.getSetting('testing');
                const theSetting = this.setting;
                this.mockServerSettingBridge = {
                    doGetOneById(id, appId) {
                        return Promise.resolve(id === 'testing' ? theSetting : undefined);
                    },
                    doIsReadableById(id, appId) {
                        return Promise.resolve(true);
                    },
                };
            }
            expectDataFromRoomRead() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.ServerSettingRead(this.mockServerSettingBridge, 'testing-app')).not.toThrow();
                    const ssr = new accessors_1.ServerSettingRead(this.mockServerSettingBridge, 'testing-app');
                    (0, alsatian_1.Expect)(yield ssr.getOneById('testing')).toBeDefined();
                    (0, alsatian_1.Expect)(yield ssr.getOneById('testing')).toEqual(this.setting);
                    (0, alsatian_1.Expect)(yield ssr.getValueById('testing')).toEqual(this.setting.packageValue);
                    this.setting.value = 'theValue';
                    (0, alsatian_1.Expect)(yield ssr.getValueById('testing')).toBe('theValue');
                    yield (0, alsatian_1.Expect)(() => __awaiter(this, void 0, void 0, function* () { return ssr.getValueById('fake'); })).toThrowErrorAsync(Error, 'No Server Setting found, or it is unaccessible, by the id of "fake".');
                    yield (0, alsatian_1.Expect)(() => ssr.getAll()).toThrowErrorAsync(Error, 'Method not implemented.');
                    (0, alsatian_1.Expect)(yield ssr.isReadableById('testing')).toBe(true);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _expectDataFromRoomRead_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _expectDataFromRoomRead_decorators, { kind: "method", name: "expectDataFromRoomRead", static: false, private: false, access: { has: obj => "expectDataFromRoomRead" in obj, get: obj => obj.expectDataFromRoomRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ServerSettingReadAccessorTestFixture = ServerSettingReadAccessorTestFixture;
