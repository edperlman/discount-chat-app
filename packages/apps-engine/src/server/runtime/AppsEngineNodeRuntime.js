"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AppsEngineNodeRuntime = void 0;
const timers = __importStar(require("timers"));
const vm = __importStar(require("vm"));
const AppsEngineRuntime_1 = require("./AppsEngineRuntime");
class AppsEngineNodeRuntime extends AppsEngineRuntime_1.AppsEngineRuntime {
    static runCode(code, sandbox, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    try {
                        resolve(this.runCodeSync(code, sandbox, options));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
        });
    }
    static runCodeSync(code, sandbox, options) {
        return vm.runInNewContext(code, Object.assign(Object.assign({}, AppsEngineNodeRuntime.defaultContext), sandbox), Object.assign(Object.assign({}, AppsEngineNodeRuntime.defaultRuntimeOptions), (options || {})));
    }
    constructor(app, customRequire) {
        super(app, customRequire);
        this.app = app;
        this.customRequire = customRequire;
    }
    runInSandbox(code, sandbox, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        sandbox !== null && sandbox !== void 0 ? sandbox : (sandbox = {});
                        const result = yield vm.runInNewContext(code, Object.assign(Object.assign(Object.assign({}, AppsEngineNodeRuntime.defaultContext), sandbox), { require: this.customRequire }), Object.assign(Object.assign({}, AppsEngineNodeRuntime.defaultRuntimeOptions), { filename: (0, AppsEngineRuntime_1.getFilenameForApp)((options === null || options === void 0 ? void 0 : options.filename) || this.app.getName()) }));
                        resolve(result);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            });
        });
    }
}
exports.AppsEngineNodeRuntime = AppsEngineNodeRuntime;
AppsEngineNodeRuntime.defaultRuntimeOptions = {
    timeout: AppsEngineRuntime_1.APPS_ENGINE_RUNTIME_DEFAULT_TIMEOUT,
};
AppsEngineNodeRuntime.defaultContext = Object.assign(Object.assign({}, timers), { Buffer,
    console, process: {}, exports: {} });
