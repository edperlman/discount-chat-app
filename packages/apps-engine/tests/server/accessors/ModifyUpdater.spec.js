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
exports.ModifyUpdaterTestFixture = void 0;
const alsatian_1 = require("alsatian");
const rooms_1 = require("../../../src/definition/rooms");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let ModifyUpdaterTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _basicModifyUpdater_decorators;
    let _msgModifyUpdater_decorators;
    let _roomModifyUpdater_decorators;
    let _livechatRoomModifyUpdater_decorators;
    return _a = class ModifyUpdaterTestFixture {
            constructor() {
                this.mockAppId = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockAppId = 'testing-app';
                this.mockRoomBridge = {
                    doGetById(roomId, appId) {
                        return Promise.resolve(utilities_1.TestData.getRoom());
                    },
                    doUpdate(room, members, appId) {
                        return Promise.resolve();
                    },
                };
                this.mockMessageBridge = {
                    doGetById(msgId, appId) {
                        return Promise.resolve(utilities_1.TestData.getMessage());
                    },
                    doUpdate(msg, appId) {
                        return Promise.resolve();
                    },
                };
                const rmBridge = this.mockRoomBridge;
                const msgBridge = this.mockMessageBridge;
                this.mockAppBridge = {
                    getMessageBridge() {
                        return msgBridge;
                    },
                    getRoomBridge() {
                        return rmBridge;
                    },
                };
            }
            basicModifyUpdater() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.ModifyUpdater(this.mockAppBridge, this.mockAppId)).not.toThrow();
                    const mc = new accessors_1.ModifyUpdater(this.mockAppBridge, this.mockAppId);
                    (0, alsatian_1.Expect)(mc.message('msgId', utilities_1.TestData.getUser())).toBeDefined();
                    (0, alsatian_1.Expect)(mc.room('roomId', utilities_1.TestData.getUser())).toBeDefined();
                    yield (0, alsatian_1.Expect)(() => mc.finish({})).toThrowErrorAsync(Error, 'Invalid builder passed to the ModifyUpdater.finish function.');
                });
            }
            msgModifyUpdater() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mc = new accessors_1.ModifyUpdater(this.mockAppBridge, this.mockAppId);
                    const msg = {};
                    const msgBd = new accessors_1.MessageBuilder(msg);
                    yield (0, alsatian_1.Expect)(() => mc.finish(msgBd)).toThrowErrorAsync(Error, 'The "room" property is required.');
                    msgBd.setRoom(utilities_1.TestData.getRoom());
                    (0, alsatian_1.Expect)(msg.room).toBeDefined();
                    yield (0, alsatian_1.Expect)(() => mc.finish(msgBd)).toThrowErrorAsync(Error, "Invalid message, can't update a message without an id.");
                    msg.id = 'testing-msg';
                    yield (0, alsatian_1.Expect)(() => mc.finish(msgBd)).toThrowErrorAsync(Error, 'Invalid sender assigned to the message.');
                    msgBd.setSender(utilities_1.TestData.getUser());
                    (0, alsatian_1.Expect)(msg.sender).toBeDefined();
                    const msgBriSpy = (0, alsatian_1.SpyOn)(this.mockMessageBridge, 'doUpdate');
                    (0, alsatian_1.Expect)(yield mc.finish(msgBd)).not.toBeDefined();
                    (0, alsatian_1.Expect)(msgBriSpy).toHaveBeenCalledWith(msg, this.mockAppId);
                    msgBriSpy.restore();
                });
            }
            roomModifyUpdater() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mc = new accessors_1.ModifyUpdater(this.mockAppBridge, this.mockAppId);
                    const room = {};
                    const roomBd = new accessors_1.RoomBuilder(room);
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid room, can not update a room without an id.');
                    room.id = 'testing-room';
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid type assigned to the room.');
                    roomBd.setType(rooms_1.RoomType.CHANNEL);
                    (0, alsatian_1.Expect)(room.type).toBe(rooms_1.RoomType.CHANNEL);
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid creator assigned to the room.');
                    roomBd.setCreator(utilities_1.TestData.getUser());
                    (0, alsatian_1.Expect)(room.creator).toBeDefined();
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid slugifiedName assigned to the room.');
                    roomBd.setSlugifiedName('testing-room');
                    (0, alsatian_1.Expect)(room.slugifiedName).toBe('testing-room');
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid displayName assigned to the room.');
                    roomBd.setDisplayName('Display Name');
                    (0, alsatian_1.Expect)(room.displayName).toBe('Display Name');
                    const roomBriSpy = (0, alsatian_1.SpyOn)(this.mockRoomBridge, 'doUpdate');
                    (0, alsatian_1.Expect)(yield mc.finish(roomBd)).not.toBeDefined();
                    (0, alsatian_1.Expect)(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), this.mockAppId);
                    roomBriSpy.restore();
                });
            }
            livechatRoomModifyUpdater() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mc = new accessors_1.ModifyUpdater(this.mockAppBridge, this.mockAppId);
                    const room = {};
                    const roomBd = new accessors_1.RoomBuilder(room);
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid room, can not update a room without an id.');
                    room.id = 'testing-room';
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid type assigned to the room.');
                    roomBd.setType(rooms_1.RoomType.LIVE_CHAT);
                    (0, alsatian_1.Expect)(room.type).toBe(rooms_1.RoomType.LIVE_CHAT);
                    yield (0, alsatian_1.Expect)(() => mc.finish(roomBd)).toThrowErrorAsync(Error, 'Invalid displayName assigned to the room.');
                    roomBd.setDisplayName('Display Name');
                    (0, alsatian_1.Expect)(room.displayName).toBe('Display Name');
                    const roomBriSpy = (0, alsatian_1.SpyOn)(this.mockRoomBridge, 'doUpdate');
                    (0, alsatian_1.Expect)(yield mc.finish(roomBd)).not.toBeDefined();
                    (0, alsatian_1.Expect)(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), this.mockAppId);
                    roomBriSpy.restore();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _basicModifyUpdater_decorators = [(0, alsatian_1.AsyncTest)()];
            _msgModifyUpdater_decorators = [(0, alsatian_1.AsyncTest)()];
            _roomModifyUpdater_decorators = [(0, alsatian_1.AsyncTest)()];
            _livechatRoomModifyUpdater_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicModifyUpdater_decorators, { kind: "method", name: "basicModifyUpdater", static: false, private: false, access: { has: obj => "basicModifyUpdater" in obj, get: obj => obj.basicModifyUpdater }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _msgModifyUpdater_decorators, { kind: "method", name: "msgModifyUpdater", static: false, private: false, access: { has: obj => "msgModifyUpdater" in obj, get: obj => obj.msgModifyUpdater }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _roomModifyUpdater_decorators, { kind: "method", name: "roomModifyUpdater", static: false, private: false, access: { has: obj => "roomModifyUpdater" in obj, get: obj => obj.roomModifyUpdater }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _livechatRoomModifyUpdater_decorators, { kind: "method", name: "livechatRoomModifyUpdater", static: false, private: false, access: { has: obj => "livechatRoomModifyUpdater" in obj, get: obj => obj.livechatRoomModifyUpdater }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ModifyUpdaterTestFixture = ModifyUpdaterTestFixture;
