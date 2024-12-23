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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const Authorization = {
    hasPermission: (_uid, _permission, _room) => __awaiter(void 0, void 0, void 0, function* () { return true; }),
};
class MeteorError extends Error {
}
const { BeforeSavePreventMention } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../server/services/messages/hooks/BeforeSavePreventMention', {
    '@rocket.chat/core-services': {
        Authorization,
        MeteorError,
    },
    '../../../lib/i18n': {
        i18n: {
            t: (s) => s,
        },
    },
});
describe('Prevent mention on messages', () => {
    it('should return void if message has no mentions', () => __awaiter(void 0, void 0, void 0, function* () {
        const preventMention = new BeforeSavePreventMention();
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-all',
        })).to.eventually.be.true;
    }));
    it("should return void if message doesnt't have @all mention", () => {
        const preventMention = new BeforeSavePreventMention();
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', mentions: [{ _id: 'here' }], u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-all',
        })).to.eventually.be.true;
    });
    it("should return void if message doesnt't have @here mention", () => {
        const preventMention = new BeforeSavePreventMention();
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', mentions: [{ _id: 'all' }], u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-here',
        })).to.eventually.be.true;
    });
    it('should return true if user has required permission', () => {
        const preventMention = new BeforeSavePreventMention();
        Authorization.hasPermission = () => __awaiter(void 0, void 0, void 0, function* () { return true; });
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', mentions: [{ _id: 'all' }], u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-all',
        })).to.eventually.be.true;
    });
    it('should return void if user has required permission on room scope', () => {
        const preventMention = new BeforeSavePreventMention();
        Authorization.hasPermission = (_uid, _permission, room) => __awaiter(void 0, void 0, void 0, function* () {
            if (room) {
                return true;
            }
            return false;
        });
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', mentions: [{ _id: 'all' }], u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-all',
        })).to.eventually.be.true;
    });
    it("should throw if user doesn't have required permissions", () => {
        Authorization.hasPermission = (_uid, _permission, _room) => __awaiter(void 0, void 0, void 0, function* () { return false; });
        const preventMention = new BeforeSavePreventMention();
        return (0, chai_1.expect)(preventMention.preventMention({
            message: { rid: 'GENERAL', msg: 'hey', mentions: [{ _id: 'all' }], u: { _id: 'random' } },
            user: { _id: 'userId', language: 'en' },
            mention: 'all',
            permission: 'mention-all',
        })).to.be.rejectedWith(MeteorError);
    });
});
