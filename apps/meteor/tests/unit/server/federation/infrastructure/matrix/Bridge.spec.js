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
const fetchStub = {
    serverFetch: () => Promise.resolve({}),
};
const { MatrixBridge } = proxyquire_1.default.noCallThru().load('../../../../../../server/services/federation/infrastructure/matrix/Bridge', {
    '@rocket.chat/server-fetch': fetchStub,
});
describe('Federation - Infrastructure - Matrix - Bridge', () => {
    const defaultProxyDomain = 'server.com';
    const bridge = new MatrixBridge({
        getHomeServerDomain: () => defaultProxyDomain,
    }, () => undefined);
    describe('#isUserIdFromTheSameHomeserver()', () => {
        it('should return true if the userId is from the same homeserver', () => {
            (0, chai_1.expect)(bridge.isUserIdFromTheSameHomeserver('@user:server.com', 'server.com')).to.be.true;
        });
        it('should return false if the userId is from a different homeserver', () => {
            (0, chai_1.expect)(bridge.isUserIdFromTheSameHomeserver('@user:server2.com', 'server.com')).to.be.false;
        });
        it('should return true if the userId is from the default homeserver', () => {
            (0, chai_1.expect)(bridge.isUserIdFromTheSameHomeserver('@user', 'server.com')).to.be.true;
        });
    });
    describe('#extractHomeserverOrigin()', () => {
        it('should return the proxy homeserver origin if there is no server in the userId', () => {
            (0, chai_1.expect)(bridge.extractHomeserverOrigin('@user')).to.be.equal(defaultProxyDomain);
        });
        it('should return the homeserver origin if there is a server in the userId', () => {
            (0, chai_1.expect)(bridge.extractHomeserverOrigin('@user:matrix.org')).to.be.equal('matrix.org');
        });
    });
    describe('#isRoomFromTheSameHomeserver()', () => {
        it('should return true if the room is from the same homeserver', () => {
            (0, chai_1.expect)(bridge.isRoomFromTheSameHomeserver('!room:server.com', 'server.com')).to.be.true;
        });
        it('should return false if the room is from a different homeserver', () => {
            (0, chai_1.expect)(bridge.isRoomFromTheSameHomeserver('!room:server2.com', 'server.com')).to.be.false;
        });
    });
    describe('#verifyInviteeId()', () => {
        it('should return `VERIFIED` when the matrixId exists', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchStub.serverFetch = () => Promise.resolve({ status: 400, json: () => Promise.resolve({ errcode: 'M_USER_IN_USE' }) });
            const verificationStatus = yield bridge.verifyInviteeId('@user:server.com');
            (0, chai_1.expect)(verificationStatus).to.be.equal("VERIFIED" /* VerificationStatus.VERIFIED */);
        }));
        it('should return `UNVERIFIED` when the matrixId does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchStub.serverFetch = () => Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
            const verificationStatus = yield bridge.verifyInviteeId('@user:server.com');
            (0, chai_1.expect)(verificationStatus).to.be.equal("UNVERIFIED" /* VerificationStatus.UNVERIFIED */);
        }));
        it('should return `UNABLE_TO_VERIFY` when the fetch() call fails', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchStub.serverFetch = () => Promise.reject(new Error('Error'));
            const verificationStatus = yield bridge.verifyInviteeId('@user:server.com');
            (0, chai_1.expect)(verificationStatus).to.be.equal("UNABLE_TO_VERIFY" /* VerificationStatus.UNABLE_TO_VERIFY */);
        }));
        it('should return `UNABLE_TO_VERIFY` when an unexepected status comes', () => __awaiter(void 0, void 0, void 0, function* () {
            fetchStub.serverFetch = () => Promise.resolve({ status: 500 });
            const verificationStatus = yield bridge.verifyInviteeId('@user:server.com');
            (0, chai_1.expect)(verificationStatus).to.be.equal("UNABLE_TO_VERIFY" /* VerificationStatus.UNABLE_TO_VERIFY */);
        }));
    });
});
