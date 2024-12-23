"use strict";
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
const chai_1 = require("chai");
const getHiddenSystemMessages_1 = require("../../../../../../app/lib/server/lib/getHiddenSystemMessages");
describe('getHiddenSystemMessages', () => {
    it('should return room.sysMes if it is an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const room = {
            _id: 'roomId',
            sysMes: ['mute_unmute', 'room_changed_description'],
            t: 'c',
            msgs: 0,
            u: {},
            usersCount: 0,
            _updatedAt: new Date(),
        };
        const result = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, []);
        (0, chai_1.expect)(result).to.deep.equal(room.sysMes);
    }));
    it('should return cached hidden system messages if room.sysMes is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const cachedHiddenSystemMessage = ['mute_unmute', 'room_changed_description'];
        const room = {
            _id: 'roomId',
            t: 'c',
            msgs: 0,
            u: {},
            usersCount: 0,
            _updatedAt: new Date(),
        };
        const result = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, cachedHiddenSystemMessage);
        (0, chai_1.expect)(result).to.deep.equal(['user-muted', 'user-unmuted', 'room_changed_description']);
    }));
    it('should return an empty array if both room.sysMes and cached hidden system messages are undefined', () => __awaiter(void 0, void 0, void 0, function* () {
        const room = {
            _id: 'roomId',
            t: 'c',
            msgs: 0,
            u: {},
            usersCount: 0,
            _updatedAt: new Date(),
        };
        const result = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, []);
        (0, chai_1.expect)(result).to.deep.equal([]);
    }));
    it('should return cached hidden system messages if room.sysMes is null', () => __awaiter(void 0, void 0, void 0, function* () {
        const cachedHiddenSystemMessage = ['subscription-role-added', 'room_changed_announcement'];
        const room = {
            _id: 'roomId',
            sysMes: undefined,
            t: 'c',
            msgs: 0,
            u: {},
            usersCount: 0,
            _updatedAt: new Date(),
        };
        const result = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, cachedHiddenSystemMessage);
        (0, chai_1.expect)(result).to.deep.equal(cachedHiddenSystemMessage);
    }));
    it('should return cached hidden system messages if room.sysMes array and hidden system message is available', () => __awaiter(void 0, void 0, void 0, function* () {
        const cachedHiddenSystemMessage = ['room_changed_announcement', 'room-archived'];
        const room = {
            _id: 'roomId',
            sysMes: ['mute_unmute', 'room_changed_description'],
            t: 'c',
            msgs: 0,
            u: {},
            usersCount: 0,
            _updatedAt: new Date(),
        };
        const result = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, cachedHiddenSystemMessage);
        (0, chai_1.expect)(result).to.deep.equal(['mute_unmute', 'room_changed_description']);
    }));
});
