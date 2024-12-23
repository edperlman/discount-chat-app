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
exports.RoomBuilderAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const rooms_1 = require("../../../src/definition/rooms");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let RoomBuilderAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicRoomBuilder_decorators;
    let _settingOnRoomBuilder_decorators;
    return _a = class RoomBuilderAccessorTestFixture {
            basicRoomBuilder() {
                (0, alsatian_1.Expect)(() => new accessors_1.RoomBuilder()).not.toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.RoomBuilder(utilities_1.TestData.getRoom())).not.toThrow();
            }
            settingOnRoomBuilder() {
                const rbOnce = new accessors_1.RoomBuilder();
                // setData just replaces the passed in object, so let's treat it differently
                (0, alsatian_1.Expect)(rbOnce.setData({ displayName: 'Testing Channel' })).toBe(rbOnce);
                (0, alsatian_1.Expect)(rbOnce.room.displayName).toBe('Testing Channel');
                const room = {};
                const rb = new accessors_1.RoomBuilder(room);
                (0, alsatian_1.Expect)(rb.setDisplayName('Just a Test')).toBe(rb);
                (0, alsatian_1.Expect)(room.displayName).toEqual('Just a Test');
                (0, alsatian_1.Expect)(rb.getDisplayName()).toEqual('Just a Test');
                (0, alsatian_1.Expect)(rb.setSlugifiedName('just_a_test')).toBe(rb);
                (0, alsatian_1.Expect)(room.slugifiedName).toEqual('just_a_test');
                (0, alsatian_1.Expect)(rb.getSlugifiedName()).toEqual('just_a_test');
                (0, alsatian_1.Expect)(rb.setType(rooms_1.RoomType.CHANNEL)).toBe(rb);
                (0, alsatian_1.Expect)(room.type).toEqual(rooms_1.RoomType.CHANNEL);
                (0, alsatian_1.Expect)(rb.getType()).toEqual(rooms_1.RoomType.CHANNEL);
                (0, alsatian_1.Expect)(rb.setCreator(utilities_1.TestData.getUser())).toBe(rb);
                (0, alsatian_1.Expect)(room.creator).toEqual(utilities_1.TestData.getUser());
                (0, alsatian_1.Expect)(rb.getCreator()).toEqual(utilities_1.TestData.getUser());
                (0, alsatian_1.Expect)(rb.addUsername('testing.username')).toBe(rb);
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(rb.getUsernames()).not.toBeEmpty();
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(rb.getUsernames()[0]).toEqual('testing.username');
                (0, alsatian_1.Expect)(rb.addUsername('another.username')).toBe(rb);
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(rb.getUsernames().length).toBe(2);
                (0, alsatian_1.Expect)(rb.setUsernames([])).toBe(rb);
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(rb.getUsernames()).toBeEmpty();
                (0, alsatian_1.Expect)(rb.addMemberToBeAddedByUsername('testing.username')).toBe(rb);
                (0, alsatian_1.Expect)(rb.getMembersToBeAddedUsernames()).not.toBeEmpty();
                (0, alsatian_1.Expect)(rb.getMembersToBeAddedUsernames()[0]).toEqual('testing.username');
                (0, alsatian_1.Expect)(rb.addMemberToBeAddedByUsername('another.username')).toBe(rb);
                (0, alsatian_1.Expect)(rb.getMembersToBeAddedUsernames().length).toBe(2);
                (0, alsatian_1.Expect)(rb.setMembersToBeAddedByUsernames([])).toBe(rb);
                (0, alsatian_1.Expect)(rb.getMembersToBeAddedUsernames()).toBeEmpty();
                (0, alsatian_1.Expect)(rb.setDefault(true)).toBe(rb);
                (0, alsatian_1.Expect)(room.isDefault).toBeTruthy();
                (0, alsatian_1.Expect)(rb.getIsDefault()).toBeTruthy();
                (0, alsatian_1.Expect)(rb.setReadOnly(false)).toBe(rb);
                (0, alsatian_1.Expect)(room.isReadOnly).not.toBeTruthy();
                (0, alsatian_1.Expect)(rb.getIsReadOnly()).not.toBeTruthy();
                (0, alsatian_1.Expect)(rb.setDisplayingOfSystemMessages(true)).toBe(rb);
                (0, alsatian_1.Expect)(room.displaySystemMessages).toBeTruthy();
                (0, alsatian_1.Expect)(rb.getDisplayingOfSystemMessages()).toBeTruthy();
                (0, alsatian_1.Expect)(rb.addCustomField('thing', {})).toBe(rb);
                (0, alsatian_1.Expect)(room.customFields).not.toBeEmpty();
                (0, alsatian_1.Expect)(rb.getCustomFields()).not.toBeEmpty();
                (0, alsatian_1.Expect)(room.customFields.thing).toBeDefined();
                (0, alsatian_1.Expect)(rb.getCustomFields().thing).toBeEmpty();
                (0, alsatian_1.Expect)(rb.addCustomField('another', { thingy: 'two' })).toBe(rb);
                (0, alsatian_1.Expect)(room.customFields.another).toEqual({ thingy: 'two' });
                (0, alsatian_1.Expect)(rb.getCustomFields().another).toEqual({ thingy: 'two' });
                (0, alsatian_1.Expect)(rb.setCustomFields({})).toBe(rb);
                (0, alsatian_1.Expect)(room.customFields).toBeEmpty();
                (0, alsatian_1.Expect)(rb.getCustomFields()).toBeEmpty();
                (0, alsatian_1.Expect)(rb.getRoom()).toBe(room);
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicRoomBuilder_decorators = [(0, alsatian_1.Test)()];
            _settingOnRoomBuilder_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicRoomBuilder_decorators, { kind: "method", name: "basicRoomBuilder", static: false, private: false, access: { has: obj => "basicRoomBuilder" in obj, get: obj => obj.basicRoomBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _settingOnRoomBuilder_decorators, { kind: "method", name: "settingOnRoomBuilder", static: false, private: false, access: { has: obj => "settingOnRoomBuilder" in obj, get: obj => obj.settingOnRoomBuilder }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RoomBuilderAccessorTestFixture = RoomBuilderAccessorTestFixture;
