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
const core_services_1 = require("@rocket.chat/core-services");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const BeforeSaveCheckMAC_1 = require("../../../../../../server/services/messages/hooks/BeforeSaveCheckMAC");
const BrokerMocked_1 = require("../../../../../mocks/server/BrokerMocked");
const createMessage = (msg, extra = {}) => (Object.assign({ _id: 'random', rid: 'GENERAL', ts: new Date(), u: {
        _id: 'userId',
        username: 'username',
    }, _updatedAt: new Date(), msg: msg }, extra));
const createRoom = (extra = {}) => (Object.assign({ _id: 'GENERAL', t: 'c', u: {
        _id: 'userId',
        username: 'username',
        name: 'name',
    }, msgs: 1, usersCount: 1, _updatedAt: new Date() }, extra));
const broker = new BrokerMocked_1.BrokerMocked();
(0, mocha_1.describe)('Check MAC', () => {
    (0, mocha_1.before)(() => {
        core_services_1.api.setBroker(broker);
    });
    it('should do nothing if not omnichannel room', () => __awaiter(void 0, void 0, void 0, function* () {
        const checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
        const empty = yield checkMAC.isWithinLimits({
            message: createMessage('hey'),
            room: createRoom(),
        });
        (0, chai_1.expect)(empty).to.not.have.value;
    }));
    it('should do nothing if message from visitor', () => __awaiter(void 0, void 0, void 0, function* () {
        const checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
        const empty = yield checkMAC.isWithinLimits({
            message: createMessage('hey', { token: 'hash' }),
            room: createRoom({ t: 'l' }),
        });
        (0, chai_1.expect)(empty).to.not.have.value;
    }));
    it('should do nothing if it is a system message', () => __awaiter(void 0, void 0, void 0, function* () {
        const checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
        const empty = yield checkMAC.isWithinLimits({
            message: createMessage('hey', { t: 'uj' }),
            room: createRoom({ t: 'l' }),
        });
        (0, chai_1.expect)(empty).to.not.have.value;
    }));
    it('should throw an error if not within limits', () => {
        const checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
        broker.mockServices({
            'omnichannel.isWithinMACLimit': () => __awaiter(void 0, void 0, void 0, function* () { return false; }),
        });
        void (0, chai_1.expect)(checkMAC.isWithinLimits({
            message: createMessage('hey'),
            room: createRoom({ t: 'l' }),
        })).to.be.rejectedWith(core_services_1.MeteorError, 'error-mac-limit-reached');
    });
    it('should work if MAC within limits', () => __awaiter(void 0, void 0, void 0, function* () {
        const checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
        broker.mockServices({
            'omnichannel.isWithinMACLimit': () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
        });
        const empty = yield checkMAC.isWithinLimits({
            message: createMessage('hey'),
            room: createRoom({ t: 'l' }),
        });
        (0, chai_1.expect)(empty).to.not.have.value;
    }));
});
