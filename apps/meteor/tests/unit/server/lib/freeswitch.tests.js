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
const mocha_1 = require("mocha");
const cached_1 = require("../../../../app/settings/server/cached");
const service_1 = require("../../../../ee/server/local-services/voip-freeswitch/service");
const VoipFreeSwitch = new service_1.VoipFreeSwitchService((id) => cached_1.settings.get(id));
// Those tests still need a proper freeswitch environment configured in order to run
// So for now they are being deliberately skipped on CI
mocha_1.describe.skip('VoIP', () => {
    (0, mocha_1.describe)('FreeSwitch', () => {
        it('should get a list of users from FreeSwitch', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield VoipFreeSwitch.getExtensionList();
            (0, chai_1.expect)(result).to.be.an('array');
            (0, chai_1.expect)(result[0]).to.be.an('object');
            (0, chai_1.expect)(result[0].extension).to.be.a('string');
        }));
        it('should get a specific user from FreeSwitch', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield VoipFreeSwitch.getExtensionDetails({ extension: '1001' });
            (0, chai_1.expect)(result).to.be.an('object');
            (0, chai_1.expect)(result.extension).to.be.equal('1001');
        }));
        it('Should load user domain from FreeSwitch', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield VoipFreeSwitch.getDomain();
            (0, chai_1.expect)(result).to.be.a('string').equal('rocket.chat');
        }));
        it('Should load user password from FreeSwitch', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield VoipFreeSwitch.getUserPassword('1000');
            (0, chai_1.expect)(result).to.be.a('string');
        }));
    });
});
