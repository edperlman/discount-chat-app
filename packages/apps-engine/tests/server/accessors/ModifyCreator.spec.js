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
exports.ModifyCreatorTestFixture = void 0;
const alsatian_1 = require("alsatian");
const rooms_1 = require("../../../src/definition/rooms");
const users_1 = require("../../../src/definition/users");
const accessors_1 = require("../../../src/server/accessors");
const utilities_1 = require("../../test-data/utilities");
let ModifyCreatorTestFixture = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _setupFixture_decorators;
    let _basicModifyCreator_decorators;
    let _msgModifyCreator_decorators;
    let _roomModifyCreator_decorators;
    return _a = class ModifyCreatorTestFixture {
            constructor() {
                this.mockAppId = __runInitializers(this, _instanceExtraInitializers);
            }
            setupFixture() {
                this.mockAppId = 'testing-app';
                this.mockAppUser = {
                    id: 'mockAppUser',
                    isEnabled: true,
                    name: 'mockAppUser',
                    roles: ['app'],
                    status: 'online',
                    statusConnection: users_1.UserStatusConnection.UNDEFINED,
                    type: users_1.UserType.APP,
                    username: 'mockAppUser',
                    emails: [],
                    utcOffset: -5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lastLoginAt: new Date(),
                };
                this.mockRoomBridge = {
                    doCreate(room, members, appId) {
                        return Promise.resolve('roomId');
                    },
                };
                this.mockMessageBridge = {
                    doCreate(msg, appId) {
                        return Promise.resolve('msgId');
                    },
                };
                this.mockUserBridge = {
                    doGetAppUser: (appId) => {
                        return Promise.resolve(this.mockAppUser);
                    },
                };
                this.mockAppBridge = {
                    getMessageBridge: () => this.mockMessageBridge,
                    getRoomBridge: () => this.mockRoomBridge,
                    getUserBridge: () => this.mockUserBridge,
                };
            }
            basicModifyCreator() {
                return __awaiter(this, void 0, void 0, function* () {
                    (0, alsatian_1.Expect)(() => new accessors_1.ModifyCreator(this.mockAppBridge, this.mockAppId)).not.toThrow();
                    const mc = new accessors_1.ModifyCreator(this.mockAppBridge, this.mockAppId);
                    (0, alsatian_1.Expect)(mc.startMessage()).toBeDefined();
                    (0, alsatian_1.Expect)(mc.startMessage({ id: 'value' })).toBeDefined();
                    (0, alsatian_1.Expect)(mc.startRoom()).toBeDefined();
                    (0, alsatian_1.Expect)(mc.startRoom({ id: 'value' })).toBeDefined();
                    yield (0, alsatian_1.Expect)(() => mc.finish({})).toThrowErrorAsync(Error, 'Invalid builder passed to the ModifyCreator.finish function.');
                });
            }
            msgModifyCreator() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mc = new accessors_1.ModifyCreator(this.mockAppBridge, this.mockAppId);
                    const msg = {};
                    const msgBd = mc.startMessage(msg);
                    yield (0, alsatian_1.Expect)(() => mc.finish(msgBd)).toThrowErrorAsync(Error, 'The "room" property is required.');
                    msgBd.setRoom(utilities_1.TestData.getRoom());
                    (0, alsatian_1.Expect)(msg.room).toBeDefined();
                    yield (0, alsatian_1.Expect)(() => mc.finish(msgBd)).not.toThrowErrorAsync(Error, 'Invalid sender assigned to the message.');
                    msgBd.setSender(utilities_1.TestData.getUser());
                    (0, alsatian_1.Expect)(msg.sender).toBeDefined();
                    const msgBriSpy = (0, alsatian_1.SpyOn)(this.mockMessageBridge, 'doCreate');
                    (0, alsatian_1.Expect)(yield mc.finish(msgBd)).toBe('msgId');
                    (0, alsatian_1.Expect)(msgBriSpy).toHaveBeenCalledWith(msg, this.mockAppId);
                    msgBriSpy.restore();
                });
            }
            roomModifyCreator() {
                return __awaiter(this, void 0, void 0, function* () {
                    const mc = new accessors_1.ModifyCreator(this.mockAppBridge, this.mockAppId);
                    const room = {};
                    const roomBd = mc.startRoom(room);
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
                    const roomBriSpy = (0, alsatian_1.SpyOn)(this.mockRoomBridge, 'doCreate');
                    (0, alsatian_1.Expect)(yield mc.finish(roomBd)).toBe('roomId');
                    (0, alsatian_1.Expect)(roomBriSpy).toHaveBeenCalledWith(room, roomBd.getMembersToBeAddedUsernames(), this.mockAppId);
                    roomBriSpy.restore();
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _setupFixture_decorators = [alsatian_1.SetupFixture];
            _basicModifyCreator_decorators = [(0, alsatian_1.AsyncTest)()];
            _msgModifyCreator_decorators = [(0, alsatian_1.AsyncTest)()];
            _roomModifyCreator_decorators = [(0, alsatian_1.AsyncTest)()];
            __esDecorate(_a, null, _setupFixture_decorators, { kind: "method", name: "setupFixture", static: false, private: false, access: { has: obj => "setupFixture" in obj, get: obj => obj.setupFixture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _basicModifyCreator_decorators, { kind: "method", name: "basicModifyCreator", static: false, private: false, access: { has: obj => "basicModifyCreator" in obj, get: obj => obj.basicModifyCreator }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _msgModifyCreator_decorators, { kind: "method", name: "msgModifyCreator", static: false, private: false, access: { has: obj => "msgModifyCreator" in obj, get: obj => obj.msgModifyCreator }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _roomModifyCreator_decorators, { kind: "method", name: "roomModifyCreator", static: false, private: false, access: { has: obj => "roomModifyCreator" in obj, get: obj => obj.roomModifyCreator }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ModifyCreatorTestFixture = ModifyCreatorTestFixture;
