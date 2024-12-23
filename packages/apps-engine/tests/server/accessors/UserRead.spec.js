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
exports.UserReadAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let UserReadAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _expectDataFromMessageRead_decorators;
    return _a = class UserReadAccessorTestFixture {
            constructor() {
                this.user = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.user = utilities_1.TestData.getUser();
                const theUser = this.user;
                this.mockUserBridge = {
                    doGetById(id, appId) {
                        return Promise.resolve(theUser);
                    },
                    doGetByUsername(id, appId) {
                        return Promise.resolve(theUser);
                    },
                    doGetAppUser(appId) {
                        return Promise.resolve(theUser);
                    },
                };
            }
            expectDataFromMessageRead() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.UserRead(this.mockUserBridge, 'testing-app')).not.toThrow();
                    const ur = new accessors_1.UserRead(this.mockUserBridge, 'testing-app');
                    (0, alsatian_1.Expect)(yield ur.getById('fake')).toBeDefined();
                    (0, alsatian_1.Expect)(yield ur.getById('fake')).toEqual(this.user);
                    (0, alsatian_1.Expect)(yield ur.getByUsername('username')).toBeDefined();
                    (0, alsatian_1.Expect)(yield ur.getByUsername('username')).toEqual(this.user);
                    (0, alsatian_1.Expect)(yield ur.getAppUser(this.mockAppId)).toBeDefined();
                    (0, alsatian_1.Expect)(yield ur.getAppUser(this.mockAppId)).toEqual(this.user);
                    (0, alsatian_1.Expect)(yield ur.getAppUser()).toEqual(this.user);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _expectDataFromMessageRead_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _expectDataFromMessageRead_decorators, { kind: "method", name: "expectDataFromMessageRead", static: false, private: false, access: { has: obj => "expectDataFromMessageRead" in obj, get: obj => obj.expectDataFromMessageRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UserReadAccessorTestFixture = UserReadAccessorTestFixture;
