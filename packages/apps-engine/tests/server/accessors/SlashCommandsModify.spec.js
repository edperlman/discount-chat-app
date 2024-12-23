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
exports.SlashCommandsModifyTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let SlashCommandsModifyTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _useSlashCommandsModify_decorators;
    return _a = class SlashCommandsModifyTestFixture {
            constructor() {
                this.cmd = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.cmd = utilities_1.TestData.getSlashCommand();
                this.mockAppId = 'testing-app';
                this.mockCmdManager = {
                    modifyCommand(appId, command) { },
                    disableCommand(appId, command) { },
                    enableCommand(appId, command) { },
                };
            }
            useSlashCommandsModify() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.SlashCommandsModify(this.mockCmdManager, this.mockAppId)).not.toThrow();
                    const sp1 = (0, alsatian_1.SpyOn)(this.mockCmdManager, 'modifyCommand');
                    const sp2 = (0, alsatian_1.SpyOn)(this.mockCmdManager, 'disableCommand');
                    const sp3 = (0, alsatian_1.SpyOn)(this.mockCmdManager, 'enableCommand');
                    const scm = new accessors_1.SlashCommandsModify(this.mockCmdManager, this.mockAppId);
                    (0, alsatian_1.Expect)(yield scm.modifySlashCommand(this.cmd)).not.toBeDefined();
                    (0, alsatian_1.Expect)(this.mockCmdManager.modifyCommand).toHaveBeenCalledWith(this.mockAppId, this.cmd);
                    (0, alsatian_1.Expect)(yield scm.disableSlashCommand('testing-cmd')).not.toBeDefined();
                    (0, alsatian_1.Expect)(this.mockCmdManager.disableCommand).toHaveBeenCalledWith(this.mockAppId, 'testing-cmd');
                    (0, alsatian_1.Expect)(yield scm.enableSlashCommand('testing-cmd')).not.toBeDefined();
                    (0, alsatian_1.Expect)(this.mockCmdManager.enableCommand).toHaveBeenCalledWith(this.mockAppId, 'testing-cmd');
                    sp1.restore();
                    sp2.restore();
                    sp3.restore();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _useSlashCommandsModify_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _useSlashCommandsModify_decorators, { kind: "method", name: "useSlashCommandsModify", static: false, private: false, access: { has: obj => "useSlashCommandsModify" in obj, get: obj => obj.useSlashCommandsModify }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SlashCommandsModifyTestFixture = SlashCommandsModifyTestFixture;
