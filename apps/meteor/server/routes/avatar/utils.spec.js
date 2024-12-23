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
class CookiesMock {
    constructor() {
        this.get = (_key, value) => value;
    }
}
const mocks = {
    settingsGet: sinon_1.default.stub(),
    findOneByIdAndLoginToken: sinon_1.default.stub(),
    fileUploadGet: sinon_1.default.spy(),
};
const { getAvatarSizeFromRequest, MIN_SVG_AVATAR_SIZE, MAX_SVG_AVATAR_SIZE, renderSVGLetters, setCacheAndDispositionHeaders, userCanAccessAvatar, wasFallbackModified, serveSvgAvatarInRequestedFormat, serveAvatarFile, } = proxyquire_1.default.noCallThru().load('./utils', {
    'meteor/ostrio:cookies': {
        Cookies: CookiesMock,
    },
    '../../../../app/utils/server/getURL': {
        getURL: () => '',
    },
    '@rocket.chat/models': {
        Users: {
            findOneByIdAndLoginToken: mocks.findOneByIdAndLoginToken,
        },
    },
    '../../../app/file-upload/server': {
        FileUpload: {
            get: mocks.fileUploadGet,
        },
    },
    '../../../app/settings/server': {
        settings: {
            get: mocks.settingsGet,
        },
    },
    'sharp': () => ({ toFormat: (format) => ({ pipe: (res) => res.write(format) }) }),
});
(0, mocha_1.describe)('#serveAvatarFile()', () => {
    const file = { uploadedAt: new Date(0), type: 'image/png', size: 100 };
    const response = {
        setHeader: sinon_1.default.spy(),
        writeHead: sinon_1.default.spy(),
        end: sinon_1.default.spy(),
    };
    const next = sinon_1.default.spy();
    afterEach(() => {
        response.setHeader.resetHistory();
        response.writeHead.resetHistory();
        response.end.resetHistory();
        next.resetHistory();
    });
    (0, mocha_1.it)(`should return code 304 if avatar was not modified`, () => {
        serveAvatarFile(file, { headers: { 'if-modified-since': new Date(0).toUTCString() } }, response, next);
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('Content-Security-Policy', "default-src 'none'")).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('Last-Modified', new Date(0).toUTCString())).to.be.true;
        (0, chai_1.expect)(response.writeHead.calledWith(304)).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    });
    (0, mocha_1.it)('should serve avatar', () => {
        const request = { headers: { 'if-modified-since': new Date(200000).toUTCString() } };
        serveAvatarFile(file, request, response, next);
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('Content-Security-Policy', "default-src 'none'")).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('Last-Modified', new Date(0).toUTCString())).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(2).calledWith('Content-Type', file.type)).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(3).calledWith('Content-Length', file.size)).to.be.true;
        (0, chai_1.expect)(mocks.fileUploadGet.calledWith(file, request, response, next)).to.be.true;
    });
});
(0, mocha_1.describe)('#serveSvgAvatarInRequestedFormat()', () => {
    (0, mocha_1.it)('should serve SVG avatar in requested format', () => {
        ['png', 'jpg', 'jpeg'].forEach((format) => {
            const response = {
                setHeader: sinon_1.default.spy(),
                write: sinon_1.default.spy(),
                end: sinon_1.default.spy(),
            };
            serveSvgAvatarInRequestedFormat({ req: { query: { format, size: 100 } }, res: response, nameOrUsername: 'name' });
            (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('Last-Modified', 'Thu, 01 Jan 2015 00:00:00 GMT')).to.be.true;
            (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('Content-Type', `image/${format}`)).to.be.true;
            (0, chai_1.expect)(response.write.calledWith(format)).to.be.true;
        });
    });
    (0, mocha_1.it)(`should serve avatar in SVG format if requested format is not png, jpg or jpeg`, () => {
        const response = {
            setHeader: sinon_1.default.spy(),
            write: sinon_1.default.spy(),
            end: sinon_1.default.spy(),
        };
        serveSvgAvatarInRequestedFormat({ req: { query: { format: 'anythingElse', size: 100 } }, res: response, nameOrUsername: 'name' });
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('Last-Modified', 'Thu, 01 Jan 2015 00:00:00 GMT')).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('Content-Type', 'image/svg+xml')).to.be.true;
        (0, chai_1.expect)(response.write.called).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    });
    (0, mocha_1.it)(`should default size to 200 if not provided in query`, () => {
        const response = {
            setHeader: sinon_1.default.spy(),
            write: sinon_1.default.spy(),
            end: sinon_1.default.spy(),
        };
        serveSvgAvatarInRequestedFormat({ req: { query: {} }, res: response, nameOrUsername: 'name' });
        (0, chai_1.expect)(response.setHeader.getCall(0).calledWith('Last-Modified', 'Thu, 01 Jan 2015 00:00:00 GMT')).to.be.true;
        (0, chai_1.expect)(response.setHeader.getCall(1).calledWith('Content-Type', 'image/svg+xml')).to.be.true;
        (0, chai_1.expect)(response.write.called).to.be.true;
        (0, chai_1.expect)(response.write.getCall(0).args[0]).to.include('viewBox="0 0 200 200"');
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    });
});
(0, mocha_1.describe)('#getAvatarSizeFromRequest()', () => {
    (0, mocha_1.it)('should return undefined if size is not provided', () => {
        (0, chai_1.expect)(getAvatarSizeFromRequest({ query: {} })).to.equal(undefined);
    });
    (0, mocha_1.it)('should return value passed in the request if it falls in the range limit', () => {
        (0, chai_1.expect)(getAvatarSizeFromRequest({ query: { size: 100 } })).to.equal(100);
    });
    (0, mocha_1.it)(`should return ${MIN_SVG_AVATAR_SIZE} if requested size is smaller than the limit`, () => {
        (0, chai_1.expect)(getAvatarSizeFromRequest({ query: { size: 2 } })).to.equal(16);
    });
    (0, mocha_1.it)(`should return ${MAX_SVG_AVATAR_SIZE} if requested size is bigger than the limit`, () => {
        (0, chai_1.expect)(getAvatarSizeFromRequest({ query: { size: 2000 } })).to.equal(1024);
    });
});
(0, mocha_1.describe)('#wasFallbackModified()', () => {
    (0, mocha_1.it)('should return true if reqModifiedHeader is different from FALLBACK_LAST_MODIFIED', () => {
        (0, chai_1.expect)(wasFallbackModified('')).to.equal(true);
    });
    (0, mocha_1.it)('should false if reqModifiedHeader is the same as FALLBACK_LAST_MODIFIED', () => {
        (0, chai_1.expect)(wasFallbackModified('Thu, 01 Jan 2015 00:00:00 GMT')).to.equal(false);
    });
});
(0, mocha_1.describe)('#renderSvgLetters', () => {
    (0, mocha_1.it)('should show capitalized initial letter in the svg', () => {
        (0, chai_1.expect)(renderSVGLetters('arthur', 16)).to.include('>\nA\n</text>');
        (0, chai_1.expect)(renderSVGLetters('Bob', 16)).to.include('>\nB\n</text>');
        (0, chai_1.expect)(renderSVGLetters('yan', 16)).to.include('>\nY\n</text>');
    });
    (0, mocha_1.it)('should render question mark with color #000', () => {
        (0, chai_1.expect)(renderSVGLetters('?', 16)).to.include('>\n?\n</text>').and.to.include('fill="#000"');
    });
    (0, mocha_1.it)('should include size in viewBox property', () => {
        (0, chai_1.expect)(renderSVGLetters('arthur', 16)).to.include('viewBox="0 0 16 16"');
        (0, chai_1.expect)(renderSVGLetters('Bob', 32)).to.include('viewBox="0 0 32 32"');
        (0, chai_1.expect)(renderSVGLetters('yan', 64)).to.include('viewBox="0 0 64 64"');
    });
});
(0, mocha_1.describe)('#setCacheAndDispositionHeaders', () => {
    (0, mocha_1.it)('should set the Cache-Control header based on the query cacheTime', () => {
        const request = {
            query: {
                cacheTime: 100,
            },
        };
        const response = {
            setHeader: sinon_1.default.spy(),
        };
        setCacheAndDispositionHeaders(request, response);
        (0, chai_1.expect)(response.setHeader.calledWith('Cache-Control', 'public, max-age=100')).to.be.true;
        (0, chai_1.expect)(response.setHeader.calledWith('Content-Disposition', 'inline')).to.be.true;
    });
    (0, mocha_1.it)('should set the Cache-Control header based on the setting if the query cacheTime is not set', () => {
        const request = {
            query: {},
        };
        const response = {
            setHeader: sinon_1.default.spy(),
        };
        mocks.settingsGet.returns(100);
        setCacheAndDispositionHeaders(request, response);
        (0, chai_1.expect)(response.setHeader.calledWith('Cache-Control', 'public, max-age=100')).to.be.true;
        (0, chai_1.expect)(response.setHeader.calledWith('Content-Disposition', 'inline')).to.be.true;
    });
});
(0, mocha_1.describe)('#userCanAccessAvatar()', () => __awaiter(void 0, void 0, void 0, function* () {
    beforeEach(() => {
        mocks.findOneByIdAndLoginToken.reset();
        mocks.settingsGet.reset();
    });
    (0, mocha_1.it)('should return true if setting is set to not block avatars', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, chai_1.expect)(userCanAccessAvatar({})).to.eventually.equal(true);
    }));
    (0, mocha_1.it)('should return true if user is authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.settingsGet.returns(true);
        mocks.findOneByIdAndLoginToken.returns({ _id: 'id' });
        yield (0, chai_1.expect)(userCanAccessAvatar({ query: { rc_token: 'token', rc_uid: 'id' } })).to.eventually.equal(true);
        yield (0, chai_1.expect)(userCanAccessAvatar({ headers: { cookie: 'rc_token=token; rc_uid=id' } })).to.eventually.equal(true);
    }));
    (0, mocha_1.it)('should return false and warn if user is unauthenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        console.warn = sinon_1.default.spy();
        mocks.findOneByIdAndLoginToken.returns(undefined);
        mocks.settingsGet.returns(true);
        yield (0, chai_1.expect)(userCanAccessAvatar({})).to.eventually.equal(false);
        (0, chai_1.expect)(console.warn.calledWith(sinon_1.default.match('unauthenticated'))).to.be.true;
        yield (0, chai_1.expect)(userCanAccessAvatar({ headers: { cookie: 'rc_token=token; rc_uid=id' } })).to.eventually.equal(false);
        (0, chai_1.expect)(console.warn.calledWith(sinon_1.default.match('unauthenticated'))).to.be.true;
        yield (0, chai_1.expect)(userCanAccessAvatar({ query: { rc_token: 'token', rc_uid: 'id' } })).to.eventually.equal(false);
        (0, chai_1.expect)(console.warn.calledWith(sinon_1.default.match('unauthenticated'))).to.be.true;
    }));
}));
