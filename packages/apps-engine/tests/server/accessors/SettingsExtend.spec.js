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
exports.SettingsExtendAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const settings_1 = require("../../../src/definition/settings");
const accessors_1 = require("../../../src/server/accessors");
let SettingsExtendAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicSettingsExtend_decorators;
    let _provideSettingToSettingsExtend_decorators;
    return _a = class SettingsExtendAccessorTestFixture {
            basicSettingsExtend() {
                (0, alsatian_1.Expect)(() => new accessors_1.SettingsExtend({})).not.toThrow();
            }
            provideSettingToSettingsExtend() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mockedStorageItem = {
                        settings: {},
                    };
                    const mockedApp = {
                        getStorageItem: function _getStorageItem() {
                            return mockedStorageItem;
                        },
                    };
                    const se = new accessors_1.SettingsExtend(mockedApp);
                    const setting = {
                        id: 'testing',
                        type: settings_1.SettingType.STRING,
                        packageValue: 'thing',
                        required: false,
                        public: false,
                        i18nLabel: 'Testing_Settings',
                    };
                    yield (0, alsatian_1.Expect)(() => se.provideSetting(setting)).not.toThrowAsync();
                    (0, alsatian_1.Expect)(mockedStorageItem.settings).not.toBeEmpty();
                    const settingModified = {
                        id: 'testing',
                        type: settings_1.SettingType.STRING,
                        packageValue: 'thing',
                        required: false,
                        public: false,
                        i18nLabel: 'Testing_Thing',
                        value: 'dont-use-me',
                    };
                    yield (0, alsatian_1.Expect)(() => se.provideSetting(settingModified)).not.toThrowAsync();
                    (0, alsatian_1.Expect)(mockedStorageItem.settings.testing).toBeDefined();
                    (0, alsatian_1.Expect)(mockedStorageItem.settings.testing.value).not.toBeDefined();
                    (0, alsatian_1.Expect)(mockedStorageItem.settings.testing.i18nLabel).toBe('Testing_Thing');
                });
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicSettingsExtend_decorators = [(0, alsatian_1.Test)()];
            _provideSettingToSettingsExtend_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _basicSettingsExtend_decorators, { kind: "method", name: "basicSettingsExtend", static: false, private: false, access: { has: obj => "basicSettingsExtend" in obj, get: obj => obj.basicSettingsExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _provideSettingToSettingsExtend_decorators, { kind: "method", name: "provideSettingToSettingsExtend", static: false, private: false, access: { has: obj => "provideSettingToSettingsExtend" in obj, get: obj => obj.provideSettingToSettingsExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SettingsExtendAccessorTestFixture = SettingsExtendAccessorTestFixture;
