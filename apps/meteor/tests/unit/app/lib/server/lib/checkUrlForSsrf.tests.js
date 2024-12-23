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
const sinon_1 = __importDefault(require("sinon"));
const lookupMock = sinon_1.default.stub();
const dnsLookup = (host, cb) => {
    return cb(null, lookupMock(host));
};
const { checkUrlForSsrf } = proxyquire_1.default.noCallThru().load('../../../../../../app/lib/server/functions/checkUrlForSsrf.ts', {
    dns: {
        lookup: dnsLookup,
    },
});
describe('checkUrlForSsrf', () => {
    beforeEach(() => {
        lookupMock.reset();
    });
    it('should return false if the URL does not start with http:// or https://', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('ftp://example.com');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if the domain is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('https://www_google_com');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if the IP is not in a valid IPv4 format', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('https://127.1');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if the IP is in a restricted range', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('http://127.0.0.1');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if the domain is metadata.google.internal', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('http://metadata.google.internal');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if DNS resolves to an IP in the restricted range', () => __awaiter(void 0, void 0, void 0, function* () {
        lookupMock.returns('127.0.0.1');
        const result = yield checkUrlForSsrf('http://169.254.169.254.nip.io');
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return true if valid domain', () => __awaiter(void 0, void 0, void 0, function* () {
        lookupMock.returns('216.58.214.174');
        const result = yield checkUrlForSsrf('https://www.google.com/');
        (0, chai_1.expect)(result).to.be.true;
    }));
    it('should return true if valid IP', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield checkUrlForSsrf('http://216.58.214.174');
        (0, chai_1.expect)(result).to.be.true;
    }));
    it('should return true if valid URL', () => __awaiter(void 0, void 0, void 0, function* () {
        lookupMock.returns('216.58.214.174');
        const result = yield checkUrlForSsrf('https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/2560px-Cat_August_2010-4.jpg');
        (0, chai_1.expect)(result).to.be.true;
    }));
});
