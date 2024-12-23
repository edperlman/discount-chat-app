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
exports.AppConsoleTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/definition/accessors");
const metadata_1 = require("../../../src/definition/metadata");
const logging_1 = require("../../../src/server/logging");
let AppConsoleTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicConsoleMethods_decorators;
    return _a = class AppConsoleTestFixture {
            basicConsoleMethods() {
                (0, alsatian_1.Expect)(() => new logging_1.AppConsole(metadata_1.AppMethod._CONSTRUCTOR)).not.toThrow();
                const logger = new logging_1.AppConsole(metadata_1.AppMethod._CONSTRUCTOR);
                const { entries } = logger;
                (0, alsatian_1.Expect)(() => logger.debug('this is a debug')).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(1);
                (0, alsatian_1.Expect)(entries[0].severity).toBe(accessors_1.LogMessageSeverity.DEBUG);
                (0, alsatian_1.Expect)(entries[0].args[0]).toBe('this is a debug');
                (0, alsatian_1.Expect)(() => logger.info('this is an info log')).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(2);
                (0, alsatian_1.Expect)(entries[1].severity).toBe(accessors_1.LogMessageSeverity.INFORMATION);
                (0, alsatian_1.Expect)(entries[1].args[0]).toBe('this is an info log');
                (0, alsatian_1.Expect)(() => logger.log('this is a log')).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(3);
                (0, alsatian_1.Expect)(entries[2].severity).toBe(accessors_1.LogMessageSeverity.LOG);
                (0, alsatian_1.Expect)(entries[2].args[0]).toBe('this is a log');
                (0, alsatian_1.Expect)(() => logger.warn('this is a warn')).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(4);
                (0, alsatian_1.Expect)(entries[3].severity).toBe(accessors_1.LogMessageSeverity.WARNING);
                (0, alsatian_1.Expect)(entries[3].args[0]).toBe('this is a warn');
                const e = new Error('just a test');
                (0, alsatian_1.Expect)(() => logger.error(e)).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(5);
                (0, alsatian_1.Expect)(entries[4].severity).toBe(accessors_1.LogMessageSeverity.ERROR);
                (0, alsatian_1.Expect)(entries[4].args[0]).toBe(JSON.stringify(e, Object.getOwnPropertyNames(e)));
                (0, alsatian_1.Expect)(() => logger.success('this is a success')).not.toThrow();
                (0, alsatian_1.Expect)(entries.length).toBe(6);
                (0, alsatian_1.Expect)(entries[5].severity).toBe(accessors_1.LogMessageSeverity.SUCCESS);
                (0, alsatian_1.Expect)(entries[5].args[0]).toBe('this is a success');
                (0, alsatian_1.Expect)(() => {
                    class Item {
                        constructor() {
                            logger.debug('inside');
                        }
                    }
                    return new Item();
                }).not.toThrow();
                (0, alsatian_1.Expect)(logger.getEntries()).toEqual(entries);
                (0, alsatian_1.Expect)(logger.getMethod()).toBe(metadata_1.AppMethod._CONSTRUCTOR);
                (0, alsatian_1.Expect)(logger.getStartTime()).toBeDefined();
                (0, alsatian_1.Expect)(logger.getEndTime()).toBeDefined();
                (0, alsatian_1.Expect)(logger.getTotalTime()).toBeGreaterThan(1);
                const getFuncSpy = (0, alsatian_1.SpyOn)(logger, 'getFunc');
                (0, alsatian_1.Expect)(getFuncSpy.call([{}])).toBe('anonymous');
                const mockFrames = [];
                mockFrames.push({});
                mockFrames.push({
                    getMethodName() {
                        return 'testing';
                    },
                    getFunctionName() {
                        return null;
                    },
                });
                (0, alsatian_1.Expect)(getFuncSpy.call(mockFrames)).toBe('testing');
                (0, alsatian_1.Expect)(logging_1.AppConsole.toStorageEntry('testing-app', logger)).toBeDefined(); // TODO: better test this
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicConsoleMethods_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicConsoleMethods_decorators, { kind: "method", name: "basicConsoleMethods", static: false, private: false, access: { has: obj => "basicConsoleMethods" in obj, get: obj => obj.basicConsoleMethods }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppConsoleTestFixture = AppConsoleTestFixture;
