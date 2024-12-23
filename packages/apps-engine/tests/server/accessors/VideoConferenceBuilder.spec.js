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
exports.VideoConferenceBuilderAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let VideoConferenceBuilderAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicVideoConferenceBuilderBuilder_decorators;
    let _setData_decorators;
    let _setRoomId_decorators;
    let _setCreatedBy_decorators;
    let _setProviderName_decorators;
    let _setProviderData_decorators;
    let _setTitle_decorators;
    let _setDiscussionRid_decorators;
    let _initialData_decorators;
    return _a = class VideoConferenceBuilderAccessorTestFixture {
            basicVideoConferenceBuilderBuilder() {
                (0, alsatian_1.Expect)(() => new accessors_1.VideoConferenceBuilder()).not.toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.VideoConferenceBuilder(utilities_1.TestData.getAppVideoConference())).not.toThrow();
            }
            setData() {
                const builder = new accessors_1.VideoConferenceBuilder();
                (0, alsatian_1.Expect)(builder.setData({ providerName: 'test-provider' })).toBe(builder);
                (0, alsatian_1.Expect)(builder.call.providerName).toBe('test-provider');
            }
            setRoomId() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setRoomId('roomId')).toBe(builder);
                (0, alsatian_1.Expect)(call.rid).toBe('roomId');
                (0, alsatian_1.Expect)(builder.getRoomId()).toBe('roomId');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            setCreatedBy() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setCreatedBy('userId')).toBe(builder);
                (0, alsatian_1.Expect)(call.createdBy).toBe('userId');
                (0, alsatian_1.Expect)(builder.getCreatedBy()).toBe('userId');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            setProviderName() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setProviderName('test')).toBe(builder);
                (0, alsatian_1.Expect)(call.providerName).toBe('test');
                (0, alsatian_1.Expect)(builder.getProviderName()).toBe('test');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            setProviderData() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setProviderData({ custom: true })).toBe(builder);
                (0, alsatian_1.Expect)(call.providerData).toEqual({ custom: true });
                (0, alsatian_1.Expect)(builder.getProviderData()).toEqual({ custom: true });
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            setTitle() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setTitle('Video Conference')).toBe(builder);
                (0, alsatian_1.Expect)(call.title).toBe('Video Conference');
                (0, alsatian_1.Expect)(builder.getTitle()).toBe('Video Conference');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            setDiscussionRid() {
                const call = {};
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(builder.setDiscussionRid('testId')).toBe(builder);
                (0, alsatian_1.Expect)(call.discussionRid).toBe('testId');
                (0, alsatian_1.Expect)(builder.getDiscussionRid()).toBe('testId');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            initialData() {
                const call = { providerName: 'test' };
                const builder = new accessors_1.VideoConferenceBuilder(call);
                (0, alsatian_1.Expect)(call.providerName).toBe('test');
                (0, alsatian_1.Expect)(builder.getProviderName()).toBe('test');
                (0, alsatian_1.Expect)(builder.setProviderName('test2')).toBe(builder);
                (0, alsatian_1.Expect)(call.providerName).toBe('test2');
                (0, alsatian_1.Expect)(builder.getProviderName()).toBe('test2');
                (0, alsatian_1.Expect)(builder.getVideoConference()).toBe(call);
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicVideoConferenceBuilderBuilder_decorators = [(0, alsatian_1.Test)()];
            _setData_decorators = [(0, alsatian_1.Test)()];
            _setRoomId_decorators = [(0, alsatian_1.Test)()];
            _setCreatedBy_decorators = [(0, alsatian_1.Test)()];
            _setProviderName_decorators = [(0, alsatian_1.Test)()];
            _setProviderData_decorators = [(0, alsatian_1.Test)()];
            _setTitle_decorators = [(0, alsatian_1.Test)()];
            _setDiscussionRid_decorators = [(0, alsatian_1.Test)()];
            _initialData_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicVideoConferenceBuilderBuilder_decorators, { kind: "method", name: "basicVideoConferenceBuilderBuilder", static: false, private: false, access: { has: obj => "basicVideoConferenceBuilderBuilder" in obj, get: obj => obj.basicVideoConferenceBuilderBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setData_decorators, { kind: "method", name: "setData", static: false, private: false, access: { has: obj => "setData" in obj, get: obj => obj.setData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setRoomId_decorators, { kind: "method", name: "setRoomId", static: false, private: false, access: { has: obj => "setRoomId" in obj, get: obj => obj.setRoomId }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setCreatedBy_decorators, { kind: "method", name: "setCreatedBy", static: false, private: false, access: { has: obj => "setCreatedBy" in obj, get: obj => obj.setCreatedBy }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setProviderName_decorators, { kind: "method", name: "setProviderName", static: false, private: false, access: { has: obj => "setProviderName" in obj, get: obj => obj.setProviderName }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setProviderData_decorators, { kind: "method", name: "setProviderData", static: false, private: false, access: { has: obj => "setProviderData" in obj, get: obj => obj.setProviderData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setTitle_decorators, { kind: "method", name: "setTitle", static: false, private: false, access: { has: obj => "setTitle" in obj, get: obj => obj.setTitle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setDiscussionRid_decorators, { kind: "method", name: "setDiscussionRid", static: false, private: false, access: { has: obj => "setDiscussionRid" in obj, get: obj => obj.setDiscussionRid }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _initialData_decorators, { kind: "method", name: "initialData", static: false, private: false, access: { has: obj => "initialData" in obj, get: obj => obj.initialData }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VideoConferenceBuilderAccessorTestFixture = VideoConferenceBuilderAccessorTestFixture;
