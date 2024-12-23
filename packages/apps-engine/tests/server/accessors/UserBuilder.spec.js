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
exports.UserBuilderAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
let UserBuilderAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicUserBuilder_decorators;
    let _settingOnUserBuilder_decorators;
    return _a = class UserBuilderAccessorTestFixture {
            basicUserBuilder() {
                (0, alsatian_1.Expect)(() => new accessors_1.UserBuilder()).not.toThrow();
            }
            settingOnUserBuilder() {
                const ubOnce = new accessors_1.UserBuilder();
                (0, alsatian_1.Expect)(ubOnce.setData({ name: 'Test User', email: 'testuser@gmail.com', username: 'testuser' })).toBe(ubOnce);
                (0, alsatian_1.Expect)(ubOnce.user.name).toBe('Test User');
                (0, alsatian_1.Expect)(ubOnce.user.username).toBe('testuser');
                (0, alsatian_1.Expect)(ubOnce.user.email).toBe('testuser@gmail.com');
                const user = {};
                const ub = new accessors_1.UserBuilder(user);
                (0, alsatian_1.Expect)(ub.setEmails([
                    {
                        address: 'testuser@gmail.com',
                        verified: false,
                    },
                ])).toBe(ub);
                (0, alsatian_1.Expect)(user.emails).toEqual([
                    {
                        address: 'testuser@gmail.com',
                        verified: false,
                    },
                ]);
                (0, alsatian_1.Expect)(ub.getEmails()).toEqual([
                    {
                        address: 'testuser@gmail.com',
                        verified: false,
                    },
                ]);
                (0, alsatian_1.Expect)(ub.setDisplayName('Test User')).toBe(ub);
                (0, alsatian_1.Expect)(user.name).toEqual('Test User');
                (0, alsatian_1.Expect)(ub.getDisplayName()).toEqual('Test User');
                (0, alsatian_1.Expect)(ub.setUsername('testuser')).toBe(ub);
                (0, alsatian_1.Expect)(user.username).toEqual('testuser');
                (0, alsatian_1.Expect)(ub.getUsername()).toEqual('testuser');
                (0, alsatian_1.Expect)(ub.setRoles(['bot'])).toBe(ub);
                (0, alsatian_1.Expect)(user.roles).toEqual(['bot']);
                (0, alsatian_1.Expect)(ub.getRoles()).toEqual(['bot']);
                (0, alsatian_1.Expect)(ub.getUser()).toBe(user);
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicUserBuilder_decorators = [(0, alsatian_1.Test)()];
            _settingOnUserBuilder_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicUserBuilder_decorators, { kind: "method", name: "basicUserBuilder", static: false, private: false, access: { has: obj => "basicUserBuilder" in obj, get: obj => obj.basicUserBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _settingOnUserBuilder_decorators, { kind: "method", name: "settingOnUserBuilder", static: false, private: false, access: { has: obj => "settingOnUserBuilder" in obj, get: obj => obj.settingOnUserBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UserBuilderAccessorTestFixture = UserBuilderAccessorTestFixture;
