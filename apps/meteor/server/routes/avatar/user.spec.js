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
const node_fetch_1 = require("node-fetch");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const mocks = {
    settingsGet: sinon_1.default.stub(),
    findOneByUsernameIgnoringCase: sinon_1.default.stub(),
    findOneById: sinon_1.default.stub(),
    utils: {
        serveSvgAvatarInRequestedFormat: sinon_1.default.spy(),
        wasFallbackModified: sinon_1.default.stub(),
        setCacheAndDispositionHeaders: sinon_1.default.spy(),
        serveAvatarFile: sinon_1.default.spy(),
    },
    serverFetch: sinon_1.default.stub(),
    avatarFindOneByName: sinon_1.default.stub(),
    avatarFindOneByUserId: sinon_1.default.stub(),
};
const { userAvatarById, userAvatarByUsername } = proxyquire_1.default.noCallThru().load('./user', {
    '@rocket.chat/models': {
        Users: {
            findOneByUsernameIgnoringCase: mocks.findOneByUsernameIgnoringCase,
            findOneById: mocks.findOneById,
        },
        Avatars: {
            findOneByName: mocks.avatarFindOneByName,
            findOneByUserId: mocks.avatarFindOneByUserId,
        },
    },
    '../../../app/settings/server': {
        settings: {
            get: mocks.settingsGet,
        },
    },
    './utils': mocks.utils,
    '@rocket.chat/server-fetch': {
        serverFetch: mocks.serverFetch,
    },
});
(0, mocha_1.describe)('#userAvatarById()', () => {
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        mocks.settingsGet.reset();
        mocks.avatarFindOneByUserId.reset();
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
        Object.values(mocks.utils).forEach((mock) => ('reset' in mock ? mock.reset() : mock.resetHistory()));
    });
    (0, mocha_1.it)(`should do nothing if url is not in request object`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield userAvatarById({}, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.called).to.be.false;
        (0, chai_1.expect)(response.end.called).to.be.false;
    }));
    (0, mocha_1.it)(`should write 404 if Id is not provided`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield userAvatarById({ url: '/' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should call external provider`, () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'xvf5Tr34';
        const request = { url: `/${userId}` };
        const pipe = sinon_1.default.spy();
        const mockResponseHeaders = new node_fetch_1.Headers();
        mockResponseHeaders.set('header1', 'true');
        mockResponseHeaders.set('header2', 'false');
        mocks.serverFetch.returns({
            headers: mockResponseHeaders,
            body: { pipe },
        });
        mocks.settingsGet.returns('test123/{username}');
        mocks.findOneById.returns({ username: 'jon' });
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.findOneById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(mocks.serverFetch.calledWith('test123/jon')).to.be.true;
        (0, chai_1.expect)(response.setHeader.calledTwice).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('header1', 'true')).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('header2', 'false')).to.be.true;
        (0, chai_1.expect)(pipe.calledWith(response)).to.be.true;
    }));
    (0, mocha_1.it)(`should serve avatar file if found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon' };
        const file = { uploadedAt: new Date(0), type: 'image/png', size: 100 };
        mocks.avatarFindOneByUserId.returns(file);
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveAvatarFile.calledWith(file, request, response, next)).to.be.true;
    }));
    (0, mocha_1.it)(`should write 304 to head if content is not modified`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/xyzabc', headers: {} };
        mocks.utils.wasFallbackModified.returns(false);
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(response.writeHead.calledWith(304)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should write 404 if userId is not found`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.utils.wasFallbackModified.returns(true);
        mocks.findOneById.returns(null);
        const userId = 'awdasdaw';
        const request = { url: `/${userId}`, headers: {} };
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should fallback to SVG if no avatar found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = '2apso9283';
        const request = { url: `/${userId}`, headers: {} };
        mocks.findOneById.returns({ username: 'jon' });
        mocks.utils.wasFallbackModified.returns(true);
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.findOneById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'jon', req: request, res: response })).to.be.true;
    }));
    (0, mocha_1.it)(`should fallback to SVG with user name if UI_Use_Name_Avatar is true`, () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = '2apso9283';
        const request = { url: `/${userId}`, headers: {} };
        mocks.findOneById.returns({ username: 'jon', name: 'Doe' });
        mocks.utils.wasFallbackModified.returns(true);
        mocks.settingsGet.withArgs('UI_Use_Name_Avatar').returns(true);
        yield userAvatarById(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'Doe', req: request, res: response })).to.be.true;
    }));
});
(0, mocha_1.describe)('#userAvatarByUsername()', () => {
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        mocks.settingsGet.reset();
        mocks.avatarFindOneByName.reset();
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
        Object.values(mocks.utils).forEach((mock) => ('reset' in mock ? mock.reset() : mock.resetHistory()));
    });
    (0, mocha_1.it)(`should do nothing if url is not in request object`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield userAvatarByUsername({}, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.called).to.be.false;
        (0, chai_1.expect)(response.end.called).to.be.false;
    }));
    (0, mocha_1.it)(`should write 404 if username is not provided`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield userAvatarByUsername({ url: '/' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should call external provider`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon' };
        const pipe = sinon_1.default.spy();
        const mockResponseHeaders = new node_fetch_1.Headers();
        mockResponseHeaders.set('header1', 'true');
        mockResponseHeaders.set('header2', 'false');
        mocks.serverFetch.returns({
            headers: mockResponseHeaders,
            body: { pipe },
        });
        mocks.settingsGet.returns('test123/{username}');
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.serverFetch.calledWith('test123/jon')).to.be.true;
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(response.setHeader.calledTwice).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('header1', 'true')).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('header2', 'false')).to.be.true;
        (0, chai_1.expect)(pipe.calledWith(response)).to.be.true;
    }));
    (0, mocha_1.it)(`should serve svg if requestUsername starts with @`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/@jon' };
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'jon', req: request, res: response })).to.be.true;
    }));
    (0, mocha_1.it)(`should serve avatar file if found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon' };
        const file = { uploadedAt: new Date(0), type: 'image/png', size: 100 };
        mocks.avatarFindOneByName.returns(file);
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveAvatarFile.calledWith(file, request, response, next)).to.be.true;
    }));
    (0, mocha_1.it)(`should write 304 to head if content is not modified`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon', headers: {} };
        mocks.utils.wasFallbackModified.returns(false);
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(response.writeHead.calledWith(304)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should fallback to SVG if no avatar found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon', headers: {} };
        mocks.utils.wasFallbackModified.returns(true);
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'jon', req: request, res: response })).to.be.true;
    }));
    (0, mocha_1.it)(`should fallback to SVG with user name if UI_Use_Name_Avatar is true`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/jon', headers: {} };
        mocks.utils.wasFallbackModified.returns(true);
        mocks.settingsGet.withArgs('UI_Use_Name_Avatar').returns(true);
        mocks.findOneByUsernameIgnoringCase.returns({ name: 'Doe' });
        yield userAvatarByUsername(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'Doe', req: request, res: response })).to.be.true;
    }));
});
