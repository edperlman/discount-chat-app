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
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const mocks = {
    utils: {
        userCanAccessAvatar: sinon_1.default.stub(),
        renderSVGLetters: sinon_1.default.stub(),
    },
};
const { protectAvatarsWithFallback, protectAvatars } = proxyquire_1.default.noCallThru().load('./auth.ts', {
    '../utils': mocks.utils,
});
(0, mocha_1.describe)('#protectAvatarsWithFallback()', () => {
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        write: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
        Object.values(mocks.utils).forEach((mock) => mock.reset());
    });
    (0, mocha_1.it)(`should write 404 to head if no url provided`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield protectAvatarsWithFallback({}, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should write 200 to head and write fallback to body (user avatar)`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.renderSVGLetters.returns('fallback');
        yield protectAvatarsWithFallback({ url: '/jon' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(200, { 'Content-Type': 'image/svg+xml' })).to.be.true;
        (0, chai_1.expect)(mocks.utils.renderSVGLetters.calledWith('jon')).to.be.true;
        (0, chai_1.expect)(response.write.calledWith('fallback')).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should write 200 to head and write fallback to body (room avatar)`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.renderSVGLetters.returns('fallback');
        yield protectAvatarsWithFallback({ url: '/room/jon' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(200, { 'Content-Type': 'image/svg+xml' })).to.be.true;
        (0, chai_1.expect)(response.write.calledWith('fallback')).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should call next if user can access avatar`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.userCanAccessAvatar.returns(true);
        const request = { url: '/jon' };
        yield protectAvatarsWithFallback(request, response, next);
        (0, chai_1.expect)(mocks.utils.userCanAccessAvatar.calledWith(request)).to.be.true;
        (0, chai_1.expect)(next.called).to.be.true;
    }));
});
(0, mocha_1.describe)('#protectAvatars()', () => {
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        write: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
        Object.values(mocks.utils).forEach((mock) => mock.reset());
    });
    (0, mocha_1.it)(`should write 404 to head if no url provided`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield protectAvatars({}, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should write 404 to head if access is denied`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.userCanAccessAvatar.returns(false);
        yield protectAvatars({ url: '/room/jon' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should call next if user can access avatar`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.userCanAccessAvatar.returns(true);
        const request = { url: '/jon' };
        yield protectAvatars(request, response, next);
        (0, chai_1.expect)(mocks.utils.userCanAccessAvatar.calledWith(request)).to.be.true;
        (0, chai_1.expect)(next.called).to.be.true;
    }));
});
