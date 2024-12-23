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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DenuRuntimeSubprocessControllerTestFixture = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const alsatian_1 = require("alsatian");
const AppStatus_1 = require("../../../src/definition/AppStatus");
const users_1 = require("../../../src/definition/users");
const managers_1 = require("../../../src/server/managers");
const AppsEngineDenoRuntime_1 = require("../../../src/server/runtime/deno/AppsEngineDenoRuntime");
const utilities_1 = require("../../test-data/utilities");
let DenuRuntimeSubprocessControllerTestFixture = (() => {
    let _classDecorators = [(0, alsatian_1.TestFixture)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _fixture_decorators;
    let _setup_decorators;
    let _teardown_decorators;
    let _testHttpAccessor_decorators;
    let _testIReadAccessor_decorators;
    let _testIEnvironmentReaderAccessor_decorators;
    let _testLivechatCreator_decorators;
    let _testMessageBridge_decorators;
    var DenuRuntimeSubprocessControllerTestFixture = _classThis = class {
        constructor() {
            this.manager = __runInitializers(this, _instanceExtraInitializers);
        }
        fixture() {
            return __awaiter(this, void 0, void 0, function* () {
                const infrastructure = new utilities_1.TestInfastructureSetup();
                this.manager = infrastructure.getMockManager();
                const accessors = new managers_1.AppAccessorManager(this.manager);
                this.manager.getAccessorManager = () => accessors;
                const api = new managers_1.AppApiManager(this.manager);
                this.manager.getApiManager = () => api;
                const appPackage = yield fs.readFile(path.join(__dirname, '../../test-data/apps/hello-world-test_0.0.1.zip'));
                this.appPackage = yield this.manager.getParser().unpackageApp(appPackage);
                this.appStorageItem = {
                    id: 'hello-world-test',
                    status: AppStatus_1.AppStatus.MANUALLY_ENABLED,
                };
            });
        }
        setup() {
            this.controller = new AppsEngineDenoRuntime_1.DenoRuntimeSubprocessController(this.manager, this.appPackage, this.appStorageItem);
            this.controller.setupApp();
        }
        teardown() {
            this.controller.stopApp();
        }
        testHttpAccessor() {
            return __awaiter(this, void 0, void 0, function* () {
                const spy = (0, alsatian_1.SpyOn)(this.manager.getBridges().getHttpBridge(), 'doCall');
                // eslint-disable-next-line
                const r = yield this.controller['handleAccessorMessage']({
                    type: 'request',
                    payload: {
                        jsonrpc: '2.0',
                        id: 'test',
                        method: 'accessor:getHttp:get',
                        params: ['https://google.com', { content: "{ test: 'test' }" }],
                        serialize: () => '',
                    },
                });
                (0, alsatian_1.Expect)(this.manager.getBridges().getHttpBridge().doCall).toHaveBeenCalledWith((0, alsatian_1.Any)(Object).thatMatches({
                    appId: '9c1d62ca-e40f-456f-8601-17c823a16c68',
                    method: 'get',
                    url: 'https://google.com',
                }));
                (0, alsatian_1.Expect)(r.result).toEqual({
                    method: 'get',
                    url: 'https://google.com',
                    content: "{ test: 'test' }",
                    statusCode: 200,
                    headers: {},
                });
                spy.restore();
            });
        }
        testIReadAccessor() {
            return __awaiter(this, void 0, void 0, function* () {
                const spy = (0, alsatian_1.SpyOn)(this.manager.getBridges().getUserBridge(), 'doGetByUsername');
                spy.andReturn(Promise.resolve({
                    id: 'id',
                    username: 'rocket.cat',
                    isEnabled: true,
                    emails: [],
                    name: 'name',
                    roles: [],
                    type: users_1.UserType.USER,
                    active: true,
                    utcOffset: 0,
                    status: 'offline',
                    statusConnection: users_1.UserStatusConnection.OFFLINE,
                    lastLoginAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
                // eslint-disable-next-line
                const { id, result } = yield this.controller['handleAccessorMessage']({
                    type: 'request',
                    payload: {
                        jsonrpc: '2.0',
                        id: 'test',
                        method: 'accessor:getReader:getUserReader:getByUsername',
                        params: ['rocket.cat'],
                        serialize: () => '',
                    },
                });
                (0, alsatian_1.Expect)(this.manager.getBridges().getUserBridge().doGetByUsername).toHaveBeenCalledWith('rocket.cat', '9c1d62ca-e40f-456f-8601-17c823a16c68');
                (0, alsatian_1.Expect)(id).toBe('test');
                (0, alsatian_1.Expect)(result.username).toEqual('rocket.cat');
            });
        }
        testIEnvironmentReaderAccessor() {
            return __awaiter(this, void 0, void 0, function* () {
                // eslint-disable-next-line
                const { id, result } = yield this.controller['handleAccessorMessage']({
                    type: 'request',
                    payload: {
                        jsonrpc: '2.0',
                        id: 'requestId',
                        method: 'accessor:getReader:getEnvironmentReader:getServerSettings:getOneById',
                        params: ['setting test id'],
                        serialize: () => '',
                    },
                });
                (0, alsatian_1.Expect)(id).toBe('requestId');
                (0, alsatian_1.Expect)(result.id).toEqual('setting test id');
            });
        }
        testLivechatCreator() {
            return __awaiter(this, void 0, void 0, function* () {
                const spy = (0, alsatian_1.SpyOn)(this.manager.getBridges().getLivechatBridge(), 'doCreateVisitor');
                spy.andReturn(Promise.resolve('random id'));
                // eslint-disable-next-line
                const { id, result } = yield this.controller['handleAccessorMessage']({
                    type: 'request',
                    payload: {
                        jsonrpc: '2.0',
                        id: 'requestId',
                        method: 'accessor:getModifier:getCreator:getLivechatCreator:createVisitor',
                        params: [
                            {
                                id: 'random id',
                                token: 'random token',
                                username: 'random username for visitor',
                                name: 'Random Visitor',
                            },
                        ],
                        serialize: () => '',
                    },
                });
                // Making sure `handleAccessorMessage` correctly identified which accessor it should resolve to
                // and that it passed the correct arguments to the bridge method
                (0, alsatian_1.Expect)(this.manager.getBridges().getLivechatBridge().doCreateVisitor).toHaveBeenCalledWith((0, alsatian_1.Any)(Object).thatMatches({
                    id: 'random id',
                    token: 'random token',
                    username: 'random username for visitor',
                    name: 'Random Visitor',
                }), '9c1d62ca-e40f-456f-8601-17c823a16c68');
                (0, alsatian_1.Expect)(id).toBe('requestId');
                (0, alsatian_1.Expect)(result).toEqual('random id');
                spy.restore();
            });
        }
        testMessageBridge() {
            return __awaiter(this, void 0, void 0, function* () {
                const spy = (0, alsatian_1.SpyOn)(this.manager.getBridges().getMessageBridge(), 'doCreate');
                spy.andReturn(Promise.resolve('random-message-id'));
                const messageParam = {
                    room: { id: '123' },
                    sender: { id: '456' },
                    text: 'Hello World',
                    alias: 'alias',
                    avatarUrl: 'https://avatars.com/123',
                };
                // eslint-disable-next-line
                const response = yield this.controller['handleBridgeMessage']({
                    type: 'request',
                    payload: {
                        jsonrpc: '2.0',
                        id: 'requestId',
                        method: 'bridges:getMessageBridge:doCreate',
                        params: [messageParam, 'APP_ID'],
                        serialize: () => '',
                    },
                });
                const { id, result } = response;
                (0, alsatian_1.Expect)(this.manager.getBridges().getMessageBridge().doCreate).toHaveBeenCalledWith(messageParam, '9c1d62ca-e40f-456f-8601-17c823a16c68');
                (0, alsatian_1.Expect)(id).toBe('requestId');
                (0, alsatian_1.Expect)(result).toEqual('random-message-id');
                spy.restore();
            });
        }
    };
    __setFunctionName(_classThis, "DenuRuntimeSubprocessControllerTestFixture");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _fixture_decorators = [alsatian_1.AsyncSetupFixture];
        _setup_decorators = [alsatian_1.Setup];
        _teardown_decorators = [alsatian_1.Teardown];
        _testHttpAccessor_decorators = [(0, alsatian_1.AsyncTest)('correctly identifies a call to the HTTP accessor')];
        _testIReadAccessor_decorators = [(0, alsatian_1.AsyncTest)('correctly identifies a call to the IRead accessor')];
        _testIEnvironmentReaderAccessor_decorators = [(0, alsatian_1.AsyncTest)('correctly identifies a call to the IEnvironmentReader accessor via IRead')];
        _testLivechatCreator_decorators = [(0, alsatian_1.AsyncTest)('correctly identifies a call to create a visitor via the LivechatCreator')];
        _testMessageBridge_decorators = [(0, alsatian_1.AsyncTest)('correctly identifies a call to the message bridge')];
        __esDecorate(_classThis, null, _fixture_decorators, { kind: "method", name: "fixture", static: false, private: false, access: { has: obj => "fixture" in obj, get: obj => obj.fixture }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setup_decorators, { kind: "method", name: "setup", static: false, private: false, access: { has: obj => "setup" in obj, get: obj => obj.setup }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _teardown_decorators, { kind: "method", name: "teardown", static: false, private: false, access: { has: obj => "teardown" in obj, get: obj => obj.teardown }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testHttpAccessor_decorators, { kind: "method", name: "testHttpAccessor", static: false, private: false, access: { has: obj => "testHttpAccessor" in obj, get: obj => obj.testHttpAccessor }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testIReadAccessor_decorators, { kind: "method", name: "testIReadAccessor", static: false, private: false, access: { has: obj => "testIReadAccessor" in obj, get: obj => obj.testIReadAccessor }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testIEnvironmentReaderAccessor_decorators, { kind: "method", name: "testIEnvironmentReaderAccessor", static: false, private: false, access: { has: obj => "testIEnvironmentReaderAccessor" in obj, get: obj => obj.testIEnvironmentReaderAccessor }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testLivechatCreator_decorators, { kind: "method", name: "testLivechatCreator", static: false, private: false, access: { has: obj => "testLivechatCreator" in obj, get: obj => obj.testLivechatCreator }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testMessageBridge_decorators, { kind: "method", name: "testMessageBridge", static: false, private: false, access: { has: obj => "testMessageBridge" in obj, get: obj => obj.testMessageBridge }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DenuRuntimeSubprocessControllerTestFixture = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DenuRuntimeSubprocessControllerTestFixture = _classThis;
})();
exports.DenuRuntimeSubprocessControllerTestFixture = DenuRuntimeSubprocessControllerTestFixture;
