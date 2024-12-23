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
exports.RoomExtenderAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let RoomExtenderAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _basicRoomExtender_decorators;
    let _usingRoomExtender_decorators;
    return _a = class RoomExtenderAccessorTestFixture {
            basicRoomExtender() {
                (0, alsatian_1.Expect)(() => new accessors_1.RoomExtender({})).not.toThrow();
                (0, alsatian_1.Expect)(() => new accessors_1.RoomExtender(utilities_1.TestData.getRoom())).not.toThrow();
            }
            usingRoomExtender() {
                const room = {};
                const re = new accessors_1.RoomExtender(room);
                (0, alsatian_1.Expect)(room.customFields).not.toBeDefined();
                (0, alsatian_1.Expect)(re.addCustomField('thing', 'value')).toBe(re);
                (0, alsatian_1.Expect)(room.customFields).toBeDefined();
                (0, alsatian_1.Expect)(room.customFields.thing).toBe('value');
                (0, alsatian_1.Expect)(() => re.addCustomField('thing', 'second')).toThrowError(Error, 'The room already contains a custom field by the key: thing');
                (0, alsatian_1.Expect)(() => re.addCustomField('thing.', 'second')).toThrowError(Error, 'The given key contains a period, which is not allowed. Key: thing.');
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(re.addMember(utilities_1.TestData.getUser('theId', 'bradley'))).toBe(re);
                (0, alsatian_1.Expect)(room.usernames).not.toBeDefined();
                (0, alsatian_1.Expect)(re.getMembersBeingAdded()).toBeDefined();
                (0, alsatian_1.Expect)(re.getMembersBeingAdded()).not.toBeEmpty();
                (0, alsatian_1.Expect)(re.getMembersBeingAdded()[0]).not.toBeEmpty();
                (0, alsatian_1.Expect)(re.getMembersBeingAdded()[0].username).toBe('bradley');
                (0, alsatian_1.Expect)(() => re.addMember(utilities_1.TestData.getUser('theSameUsername', 'bradley'))).toThrowError(Error, 'The user is already in the room.');
                (0, alsatian_1.Expect)(re.getRoom()).not.toBe(room);
                (0, alsatian_1.Expect)(re.getRoom()).toEqual(room);
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _basicRoomExtender_decorators = [(0, alsatian_1.Test)()];
            _usingRoomExtender_decorators = [(0, alsatian_1.Test)()];
            __esDecorate(_a, null, _basicRoomExtender_decorators, { kind: "method", name: "basicRoomExtender", static: false, private: false, access: { has: obj => "basicRoomExtender" in obj, get: obj => obj.basicRoomExtender }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _usingRoomExtender_decorators, { kind: "method", name: "usingRoomExtender", static: false, private: false, access: { has: obj => "usingRoomExtender" in obj, get: obj => obj.usingRoomExtender }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RoomExtenderAccessorTestFixture = RoomExtenderAccessorTestFixture;
