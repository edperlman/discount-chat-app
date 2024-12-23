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
// const getCookie = sinon.stub();
class CookiesMock {
    constructor() {
        this.get = (_key, value) => value;
    }
}
const { handleBrowserVersionCheck, isIEOlderThan11 } = proxyquire_1.default.noCallThru().load('./browserVersion', {
    'meteor/ostrio:cookies': {
        Cookies: CookiesMock,
    },
    '../../../../app/utils/server/getURL': {
        getURL: () => '',
    },
});
(0, mocha_1.describe)('#isIEOlderThan11()', () => {
    (0, mocha_1.it)('should return false if user agent is IE11', () => {
        const userAgent = {
            browser: {
                name: 'IE',
                version: '11.0',
            },
        };
        (0, chai_1.expect)(isIEOlderThan11(userAgent)).to.be.false;
    });
    (0, mocha_1.it)('should return true if user agent is IE < 11', () => {
        const userAgent = {
            browser: {
                name: 'IE',
                version: '10.0',
            },
        };
        (0, chai_1.expect)(isIEOlderThan11(userAgent)).to.be.true;
    });
});
(0, mocha_1.describe)('#handleBrowserVersionCheck()', () => {
    (0, mocha_1.it)('should call next if browser_version_check cookie is set to "bypass"', () => __awaiter(void 0, void 0, void 0, function* () {
        const next = sinon_1.default.spy();
        const request = {
            headers: {
                cookie: 'bypass',
            },
        };
        handleBrowserVersionCheck(request, {}, next);
        (0, chai_1.expect)(next.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should call next if browser_version_check cookie is not set to "force" and user agent is not IE < 11', () => __awaiter(void 0, void 0, void 0, function* () {
        const next = sinon_1.default.spy();
        const request = {
            headers: {
                'cookie': 'anything',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            },
        };
        handleBrowserVersionCheck(request, {}, next);
        (0, chai_1.expect)(next.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should respond with Browser not supported', () => __awaiter(void 0, void 0, void 0, function* () {
        const next = sinon_1.default.spy();
        const request = {
            headers: {
                'cookie': 'anything',
                'user-agent': 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)',
            },
        };
        const response = {
            setHeader: sinon_1.default.spy(),
            write: sinon_1.default.spy(),
            end: sinon_1.default.spy(),
        };
        handleBrowserVersionCheck(request, response, next);
        (0, chai_1.expect)(response.setHeader.calledWith('content-type', 'text/html; charset=utf-8')).to.be.true;
        (0, chai_1.expect)(response.write.calledWith(sinon_1.default.match('Browser not supported'))).to.be.true;
        (0, chai_1.expect)(response.end.calledOnce).to.be.true;
    }));
});
