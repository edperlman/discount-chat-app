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
exports.UtilitiesTestFixture = void 0;
const alsatian_1 = require("alsatian");
const Utilities_1 = require("../../../src/server/misc/Utilities");
let UtilitiesTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _testDeepClone_decorators;
    let _testDeepFreeze_decorators;
    let _testDeepCloneAndFreeze_decorators;
    return _a = class UtilitiesTestFixture {
            constructor() {
                this.expectedInfo = (__runInitializers(this, _instanceExtraInitializers), {
                    id: '614055e2-3dba-41fb-be48-c1ff146f5932',
                    name: 'Testing App',
                    nameSlug: 'testing-app',
                    description: 'A Rocket.Chat Application used to test out the various features.',
                    version: '0.0.8',
                    requiredApiVersion: '>=0.9.6',
                    author: {
                        name: 'Bradley Hilton',
                        homepage: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions',
                        support: 'https://github.com/RocketChat/Rocket.Chat.Apps-ts-definitions/issues',
                    },
                    classFile: 'TestingApp.ts',
                    iconFile: 'testing.jpg',
                });
            }
            testDeepClone() {
                (0, alsatian_1.Expect)(() => Utilities_1.Utilities.deepClone(this.expectedInfo)).not.toThrow();
                const info = Utilities_1.Utilities.deepClone(this.expectedInfo);
                (0, alsatian_1.Expect)(info).toEqual(this.expectedInfo);
                info.name = 'New Testing App';
                (0, alsatian_1.Expect)(info.name).toEqual('New Testing App');
                (0, alsatian_1.Expect)(info.author.name).toEqual(this.expectedInfo.author.name);
            }
            testDeepFreeze() {
                (0, alsatian_1.Expect)(() => {
                    this.expectedInfo.name = 'New Testing App';
                }).not.toThrow();
                (0, alsatian_1.Expect)(() => {
                    this.expectedInfo.author.name = 'Bradley H';
                }).not.toThrow();
                (0, alsatian_1.Expect)(this.expectedInfo.name).toEqual('New Testing App');
                (0, alsatian_1.Expect)(this.expectedInfo.author.name).toEqual('Bradley H');
                (0, alsatian_1.Expect)(() => Utilities_1.Utilities.deepFreeze(this.expectedInfo)).not.toThrow();
                (0, alsatian_1.Expect)(() => {
                    this.expectedInfo.name = 'Old Testing App';
                }).toThrow();
                (0, alsatian_1.Expect)(() => {
                    this.expectedInfo.author.name = 'Bradley';
                }).toThrow();
                (0, alsatian_1.Expect)(this.expectedInfo.name).toEqual('New Testing App');
                (0, alsatian_1.Expect)(this.expectedInfo.author.name).toEqual('Bradley H');
            }
            testDeepCloneAndFreeze() {
                (0, alsatian_1.Expect)(() => Utilities_1.Utilities.deepCloneAndFreeze({})).not.toThrow();
                const info = Utilities_1.Utilities.deepCloneAndFreeze(this.expectedInfo);
                (0, alsatian_1.Expect)(info).toEqual(this.expectedInfo);
                (0, alsatian_1.Expect)(info).not.toBe(this.expectedInfo);
                (0, alsatian_1.Expect)(info.author.name).toEqual(this.expectedInfo.author.name);
                (0, alsatian_1.Expect)(info.author.name).toEqual('Bradley H'); // was changed on testDeepFreeze
                (0, alsatian_1.Expect)(() => {
                    info.author.name = 'Bradley Hilton';
                }).toThrow();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _testDeepClone_decorators = [(0, alsatian_1.Test)()];
            _testDeepFreeze_decorators = [(0, alsatian_1.Test)()];
            _testDeepCloneAndFreeze_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _testDeepClone_decorators, { kind: "method", name: "testDeepClone", static: false, private: false, access: { has: obj => "testDeepClone" in obj, get: obj => obj.testDeepClone }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _testDeepFreeze_decorators, { kind: "method", name: "testDeepFreeze", static: false, private: false, access: { has: obj => "testDeepFreeze" in obj, get: obj => obj.testDeepFreeze }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _testDeepCloneAndFreeze_decorators, { kind: "method", name: "testDeepCloneAndFreeze", static: false, private: false, access: { has: obj => "testDeepCloneAndFreeze" in obj, get: obj => obj.testDeepCloneAndFreeze }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UtilitiesTestFixture = UtilitiesTestFixture;
