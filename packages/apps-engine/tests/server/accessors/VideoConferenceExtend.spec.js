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
exports.VideoConferenceExtendAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let VideoConferenceExtendAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicVideoConferenceExtend_decorators;
    let _setProviderData_decorators;
    let _setStatus_decorators;
    let _setEndedBy_decorators;
    let _setEndedAt_decorators;
    let _setDiscussionRid_decorators;
    let _addUser_decorators;
    return _a = class VideoConferenceExtendAccessorTestFixture {
            basicVideoConferenceExtend() {
                (0, alsatian_1.Expect)(() => new accessors_1.VideoConferenceExtender({})).not.toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.VideoConferenceExtender(utilities_1.TestData.getVideoConference())).not.toThrow();
            }
            setProviderData() {
                const call = {};
                const extend = new accessors_1.VideoConferenceExtender(call);
                (0, alsatian_1.Expect)(call.providerData).not.toBeDefined();
                (0, alsatian_1.Expect)(extend.setProviderData({ key: 'test' })).toBe(extend);
                (0, alsatian_1.Expect)(call.providerData).toBeDefined();
                (0, alsatian_1.Expect)(call.providerData.key).toBe('test');
                (0, alsatian_1.Expect)(extend.getVideoConference()).not.toBe(call);
                (0, alsatian_1.Expect)(extend.getVideoConference()).toEqual(call);
            }
            setStatus() {
                const call = { status: 0 };
                const extend = new accessors_1.VideoConferenceExtender(call);
                (0, alsatian_1.Expect)(call.status).toBe(0);
                (0, alsatian_1.Expect)(extend.setStatus(1)).toBe(extend);
                (0, alsatian_1.Expect)(call.status).toBe(1);
            }
            setEndedBy() {
                const call = {};
                const extend = new accessors_1.VideoConferenceExtender(call);
                (0, alsatian_1.Expect)(call.endedBy).not.toBeDefined();
                (0, alsatian_1.Expect)(extend.setEndedBy('userId')).toBe(extend);
                (0, alsatian_1.Expect)(call.endedBy).toBeDefined();
                (0, alsatian_1.Expect)(call.endedBy._id).toBe('userId');
            }
            setEndedAt() {
                const call = {};
                const extend = new accessors_1.VideoConferenceExtender(call);
                const date = new Date();
                (0, alsatian_1.Expect)(call.endedAt).not.toBeDefined();
                (0, alsatian_1.Expect)(extend.setEndedAt(date)).toBe(extend);
                (0, alsatian_1.Expect)(call.endedAt).toBe(date);
            }
            setDiscussionRid() {
                const call = {};
                const extend = new accessors_1.VideoConferenceExtender(call);
                (0, alsatian_1.Expect)(call.discussionRid).not.toBeDefined();
                (0, alsatian_1.Expect)(extend.setDiscussionRid('testId')).toBe(extend);
                (0, alsatian_1.Expect)(call.discussionRid).toBe('testId');
            }
            addUser() {
                const call = { users: [] };
                const extend = new accessors_1.VideoConferenceExtender(call);
                (0, alsatian_1.Expect)(call.users).toBeEmpty();
                (0, alsatian_1.Expect)(extend.addUser('userId')).toBe(extend);
                (0, alsatian_1.Expect)(call.users).not.toBeEmpty();
                (0, alsatian_1.Expect)(call.users[0]._id).toBe('userId');
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicVideoConferenceExtend_decorators = [(0, alsatian_1.Test)()];
            _setProviderData_decorators = [(0, alsatian_1.Test)()];
            _setStatus_decorators = [(0, alsatian_1.Test)()];
            _setEndedBy_decorators = [(0, alsatian_1.Test)()];
            _setEndedAt_decorators = [(0, alsatian_1.Test)()];
            _setDiscussionRid_decorators = [(0, alsatian_1.Test)()];
            _addUser_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicVideoConferenceExtend_decorators, { kind: "method", name: "basicVideoConferenceExtend", static: false, private: false, access: { has: obj => "basicVideoConferenceExtend" in obj, get: obj => obj.basicVideoConferenceExtend }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setProviderData_decorators, { kind: "method", name: "setProviderData", static: false, private: false, access: { has: obj => "setProviderData" in obj, get: obj => obj.setProviderData }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setStatus_decorators, { kind: "method", name: "setStatus", static: false, private: false, access: { has: obj => "setStatus" in obj, get: obj => obj.setStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setEndedBy_decorators, { kind: "method", name: "setEndedBy", static: false, private: false, access: { has: obj => "setEndedBy" in obj, get: obj => obj.setEndedBy }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setEndedAt_decorators, { kind: "method", name: "setEndedAt", static: false, private: false, access: { has: obj => "setEndedAt" in obj, get: obj => obj.setEndedAt }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setDiscussionRid_decorators, { kind: "method", name: "setDiscussionRid", static: false, private: false, access: { has: obj => "setDiscussionRid" in obj, get: obj => obj.setDiscussionRid }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addUser_decorators, { kind: "method", name: "addUser", static: false, private: false, access: { has: obj => "addUser" in obj, get: obj => obj.addUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VideoConferenceExtendAccessorTestFixture = VideoConferenceExtendAccessorTestFixture;
