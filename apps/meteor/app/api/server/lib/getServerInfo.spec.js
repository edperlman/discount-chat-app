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
const hasAllPermissionAsyncMock = sinon_1.default.stub();
const getCachedSupportedVersionsTokenMock = sinon_1.default.stub();
const { getServerInfo } = proxyquire_1.default.noCallThru().load('./getServerInfo', {
    '../../../utils/rocketchat.info': {
        Info: {
            version: '3.0.1',
        },
    },
    '../../../authorization/server/functions/hasPermission': {
        hasPermissionAsync: hasAllPermissionAsyncMock,
    },
    '../../../cloud/server/functions/supportedVersionsToken/supportedVersionsToken': {
        getCachedSupportedVersionsToken: getCachedSupportedVersionsTokenMock,
    },
    '../../../settings/server': {
        settings: new Map(),
    },
});
// #ToDo: Fix those tests in a separate PR
mocha_1.describe.skip('#getServerInfo()', () => {
    beforeEach(() => {
        hasAllPermissionAsyncMock.reset();
        getCachedSupportedVersionsTokenMock.reset();
    });
    (0, mocha_1.it)('should return only the version (without the patch info) when the user is not present', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(yield getServerInfo(undefined)).to.be.eql({ version: '3.0' });
    }));
    (0, mocha_1.it)('should return only the version (without the patch info) when the user present but they dont have permission', () => __awaiter(void 0, void 0, void 0, function* () {
        hasAllPermissionAsyncMock.resolves(false);
        (0, chai_1.expect)(yield getServerInfo('userId')).to.be.eql({ version: '3.0' });
    }));
    (0, mocha_1.it)('should return the info object + the supportedVersions from the cloud when the request to the cloud was a success', () => __awaiter(void 0, void 0, void 0, function* () {
        const signedJwt = 'signedJwt';
        hasAllPermissionAsyncMock.resolves(true);
        getCachedSupportedVersionsTokenMock.resolves(signedJwt);
        (0, chai_1.expect)(yield getServerInfo('userId')).to.be.eql({ info: { version: '3.0.1', supportedVersions: signedJwt } });
    }));
    (0, mocha_1.it)('should return the info object ONLY from the cloud when the request to the cloud was NOT a success', () => __awaiter(void 0, void 0, void 0, function* () {
        hasAllPermissionAsyncMock.resolves(true);
        getCachedSupportedVersionsTokenMock.rejects();
        (0, chai_1.expect)(yield getServerInfo('userId')).to.be.eql({ info: { version: '3.0.1' } });
    }));
});
