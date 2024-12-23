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
    settingsGet: sinon_1.default.stub(),
    findOneById: sinon_1.default.stub(),
    utils: {
        serveSvgAvatarInRequestedFormat: sinon_1.default.spy(),
        wasFallbackModified: sinon_1.default.stub(),
        setCacheAndDispositionHeaders: sinon_1.default.spy(),
        serveAvatarFile: sinon_1.default.spy(),
    },
    avatarFindOneByRoomId: sinon_1.default.stub(),
    getRoomName: sinon_1.default.stub(),
};
class CookiesMock {
    constructor() {
        this.get = (_key, value) => value;
    }
}
const { roomAvatar } = proxyquire_1.default.noCallThru().load('./room', {
    '@rocket.chat/models': {
        Rooms: {
            findOneById: mocks.findOneById,
        },
        Avatars: {
            findOneByRoomId: mocks.avatarFindOneByRoomId,
        },
    },
    '../../../app/settings/server': {
        settings: {
            get: mocks.settingsGet,
        },
    },
    './utils': mocks.utils,
    '../../lib/rooms/roomCoordinator': {
        roomCoordinator: {
            getRoomName: mocks.getRoomName,
        },
    },
    'meteor/ostrio:cookies': {
        Cookies: CookiesMock,
    },
});
(0, mocha_1.describe)('#roomAvatar()', () => {
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        mocks.settingsGet.reset();
        mocks.avatarFindOneByRoomId.reset();
        mocks.findOneById.reset();
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
        Object.values(mocks.utils).forEach((mock) => ('reset' in mock ? mock.reset() : mock.resetHistory()));
    });
    (0, mocha_1.it)(`should do nothing if url is not in request object`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield roomAvatar({}, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.called).to.be.false;
        (0, chai_1.expect)(response.end.called).to.be.false;
    }));
    (0, mocha_1.it)(`should write 404 if room is not found`, () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.findOneById.returns(null);
        yield roomAvatar({ url: '/' }, response, next);
        (0, chai_1.expect)(next.called).to.be.false;
        (0, chai_1.expect)(response.setHeader.called).to.be.false;
        (0, chai_1.expect)(response.writeHead.calledWith(404)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should serve avatar file if found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/roomId' };
        const file = { uploadedAt: new Date(0), type: 'image/png', size: 100 };
        mocks.findOneById.withArgs('roomId').returns({ _id: 'roomId' });
        mocks.avatarFindOneByRoomId.withArgs('roomId').returns(file);
        yield roomAvatar(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveAvatarFile.calledWith(file, request, response, next)).to.be.true;
    }));
    (0, mocha_1.it)(`should serve parent room avatar file if current room avatar is not found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/roomId' };
        const file = { uploadedAt: new Date(0), type: 'image/png', size: 100 };
        mocks.findOneById.withArgs('roomId').returns({ _id: 'roomId', prid: 'roomId2' });
        mocks.findOneById.withArgs('roomId2').returns({ _id: 'roomId2' });
        mocks.avatarFindOneByRoomId.withArgs('roomId2').returns(file);
        yield roomAvatar(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveAvatarFile.calledWith(file, request, response, next)).to.be.true;
    }));
    (0, mocha_1.it)(`should write 304 if fallback content is not modified`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/roomId', headers: {} };
        mocks.findOneById.withArgs('roomId').returns({ _id: 'roomId' });
        mocks.utils.wasFallbackModified.returns(false);
        yield roomAvatar(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(response.writeHead.calledWith(304)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)(`should serve svg fallback if no file found`, () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { url: '/roomId', headers: { cookie: 'userId' } };
        mocks.utils.wasFallbackModified.returns(true);
        mocks.findOneById.withArgs('roomId').returns({ _id: 'roomId' });
        mocks.getRoomName.returns('roomName');
        yield roomAvatar(request, response, next);
        (0, chai_1.expect)(mocks.utils.setCacheAndDispositionHeaders.calledWith(request, response)).to.be.true;
        (0, chai_1.expect)(mocks.utils.serveSvgAvatarInRequestedFormat.calledWith({ nameOrUsername: 'roomName', req: request, res: response })).to.be.true;
    }));
});
