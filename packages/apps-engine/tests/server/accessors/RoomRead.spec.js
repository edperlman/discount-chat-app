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
exports.RoomReadAccessorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let RoomReadAccessorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _expectDataFromRoomRead_decorators;
    let _useTheIterators_decorators;
    return _a = class RoomReadAccessorTestFixture {
            constructor() {
                this.room = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.room = utilities_1.TestData.getRoom();
                this.user = utilities_1.TestData.getUser();
                this.messages = ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea'].map((id) => utilities_1.TestData.getMessageRaw(id));
                this.unreadRoomId = this.messages[0].roomId;
                this.unreadUserId = this.messages[0].sender._id;
                const theRoom = this.room;
                const theUser = this.user;
                const theMessages = this.messages;
                const theUnreadMsg = this.messages;
                const { unreadRoomId } = this;
                const { unreadUserId } = this;
                this.mockRoomBridgeWithRoom = {
                    doGetById(id, appId) {
                        return Promise.resolve(theRoom);
                    },
                    doGetByName(name, appId) {
                        return Promise.resolve(theRoom);
                    },
                    doGetCreatorById(id, appId) {
                        return Promise.resolve(theUser);
                    },
                    doGetCreatorByName(name, appId) {
                        return Promise.resolve(theUser);
                    },
                    doGetDirectByUsernames(usernames, appId) {
                        return Promise.resolve(theRoom);
                    },
                    doGetMembers(name, appId) {
                        return Promise.resolve([theUser]);
                    },
                    doGetMessages(roomId, options, appId) {
                        return Promise.resolve(theMessages);
                    },
                    doGetUnreadByUser(roomId, uid, options, appId) {
                        if (roomId === unreadRoomId && uid === unreadUserId) {
                            return Promise.resolve(theUnreadMsg);
                        }
                        return Promise.resolve([]);
                    },
                };
            }
            expectDataFromRoomRead() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();
                    const rr = new accessors_1.RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');
                    (0, alsatian_1.Expect)(yield rr.getById('fake')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getById('fake')).toBe(this.room);
                    (0, alsatian_1.Expect)(yield rr.getByName('testing-room')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getByName('testing-room')).toBe(this.room);
                    (0, alsatian_1.Expect)(yield rr.getCreatorUserById('testing')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getCreatorUserById('testing')).toBe(this.user);
                    (0, alsatian_1.Expect)(yield rr.getCreatorUserByName('testing')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getCreatorUserByName('testing')).toBe(this.user);
                    (0, alsatian_1.Expect)(yield rr.getDirectByUsernames([this.user.username])).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getDirectByUsernames([this.user.username])).toBe(this.room);
                    (0, alsatian_1.Expect)(yield rr.getMessages('testing')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getMessages('testing')).toBe(this.messages);
                    (0, alsatian_1.Expect)(yield rr.getUnreadByUser(this.unreadRoomId, this.unreadUserId)).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getUnreadByUser(this.unreadRoomId, this.unreadUserId)).toEqual(this.messages);
                    (0, alsatian_1.Expect)(yield rr.getUnreadByUser('fake', 'fake')).toBeDefined();
                    (0, alsatian_1.Expect)(yield rr.getUnreadByUser('fake', 'fake')).toEqual([]);
                });
            }
            useTheIterators() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.RoomRead(this.mockRoomBridgeWithRoom, 'testing-app')).not.toThrow();
                    const rr = new accessors_1.RoomRead(this.mockRoomBridgeWithRoom, 'testing-app');
                    (0, alsatian_1.Expect)(yield rr.getMembers('testing')).toBeDefined();
                    (0, alsatian_1.Expect)((yield rr.getMembers('testing'))).not.toBeEmpty();
                    (0, alsatian_1.Expect)((yield rr.getMembers('testing'))[0]).toBe(this.user);
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _expectDataFromRoomRead_decorators = [(0, alsatian_1.AsyncTest)()];
            _useTheIterators_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _expectDataFromRoomRead_decorators, { kind: "method", name: "expectDataFromRoomRead", static: false, private: false, access: { has: obj => "expectDataFromRoomRead" in obj, get: obj => obj.expectDataFromRoomRead }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _useTheIterators_decorators, { kind: "method", name: "useTheIterators", static: false, private: false, access: { has: obj => "useTheIterators" in obj, get: obj => obj.useTheIterators }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RoomReadAccessorTestFixture = RoomReadAccessorTestFixture;
