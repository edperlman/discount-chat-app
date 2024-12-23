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
// Create stubs for dependencies
const stubs = {
    findOneUserById: sinon_1.default.stub(),
    randomId: sinon_1.default.stub(),
    stat: sinon_1.default.stub(),
    getStore: sinon_1.default.stub(),
    insertFileStub: sinon_1.default.stub(),
    createReadStream: sinon_1.default.stub(),
};
const { uploadZipFile } = proxyquire_1.default.noCallThru().load('../../../../../server/lib/dataExport/uploadZipFile.ts', {
    '@rocket.chat/models': {
        Users: {
            findOneById: stubs.findOneUserById,
        },
    },
    '@rocket.chat/random': {
        Random: {
            id: stubs.randomId,
        },
    },
    'fs/promises': {
        stat: stubs.stat,
    },
    'fs': {
        createReadStream: stubs.createReadStream,
    },
    '../../../app/file-upload/server': {
        FileUpload: {
            getStore: stubs.getStore,
        },
    },
});
(0, mocha_1.describe)('Export - uploadZipFile', () => {
    const randomId = 'random-id';
    const fileStat = 100;
    const userName = 'John Doe';
    const userUsername = 'john.doe';
    const userId = 'user-id';
    const filePath = 'random-path';
    (0, mocha_1.before)(() => {
        stubs.findOneUserById.returns({ name: userName });
        stubs.stat.returns({ size: fileStat });
        stubs.randomId.returns(randomId);
        stubs.getStore.returns({ insert: stubs.insertFileStub });
        stubs.insertFileStub.callsFake((details) => ({ _id: details._id, name: details.name }));
    });
    (0, mocha_1.it)('should correctly build file name for json exports', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield uploadZipFile(filePath, userId, 'json');
        (0, chai_1.expect)(stubs.findOneUserById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(stubs.stat.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.createReadStream.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.getStore.calledWith('UserDataFiles')).to.be.true;
        (0, chai_1.expect)(stubs.insertFileStub.calledWith(sinon_1.default.match({
            _id: randomId,
            userId,
            type: 'application/zip',
            size: fileStat,
        }))).to.be.true;
        (0, chai_1.expect)(result).to.have.property('_id', randomId);
        (0, chai_1.expect)(result).to.have.property('name').that.is.a.string;
        const fileName = result.name;
        (0, chai_1.expect)(fileName.endsWith(encodeURIComponent(`${userName}-data-${randomId}.zip`))).to.be.true;
    }));
    (0, mocha_1.it)('should correctly build file name for html exports', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield uploadZipFile(filePath, userId, 'html');
        (0, chai_1.expect)(stubs.findOneUserById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(stubs.stat.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.createReadStream.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.getStore.calledWith('UserDataFiles')).to.be.true;
        (0, chai_1.expect)(stubs.insertFileStub.calledWith(sinon_1.default.match({
            _id: randomId,
            userId,
            type: 'application/zip',
            size: fileStat,
        }))).to.be.true;
        (0, chai_1.expect)(result).to.have.property('_id', randomId);
        (0, chai_1.expect)(result).to.have.property('name').that.is.a.string;
        const fileName = result.name;
        (0, chai_1.expect)(fileName.endsWith(encodeURIComponent(`${userName}-${randomId}.zip`))).to.be.true;
    }));
    (0, mocha_1.it)("should use username as a fallback in the zip file name when user's name is not defined", () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ username: userUsername });
        const result = yield uploadZipFile(filePath, userId, 'html');
        (0, chai_1.expect)(stubs.findOneUserById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(stubs.stat.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.createReadStream.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.getStore.calledWith('UserDataFiles')).to.be.true;
        (0, chai_1.expect)(stubs.insertFileStub.calledWith(sinon_1.default.match({
            _id: randomId,
            userId,
            type: 'application/zip',
            size: fileStat,
        }))).to.be.true;
        (0, chai_1.expect)(result).to.have.property('_id', randomId);
        (0, chai_1.expect)(result).to.have.property('name').that.is.a.string;
        const fileName = result.name;
        (0, chai_1.expect)(fileName.endsWith(`${userUsername}-${randomId}.zip`)).to.be.true;
    }));
    (0, mocha_1.it)("should use userId as a fallback in the zip file name when user's name and username are not defined", () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns(undefined);
        const result = yield uploadZipFile(filePath, userId, 'html');
        (0, chai_1.expect)(stubs.findOneUserById.calledWith(userId)).to.be.true;
        (0, chai_1.expect)(stubs.stat.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.createReadStream.calledWith(filePath)).to.be.true;
        (0, chai_1.expect)(stubs.getStore.calledWith('UserDataFiles')).to.be.true;
        (0, chai_1.expect)(stubs.insertFileStub.calledWith(sinon_1.default.match({
            _id: randomId,
            userId,
            type: 'application/zip',
            size: fileStat,
        }))).to.be.true;
        (0, chai_1.expect)(result).to.have.property('_id', randomId);
        (0, chai_1.expect)(result).to.have.property('name').that.is.a.string;
        const fileName = result.name;
        (0, chai_1.expect)(fileName.endsWith(`${userId}-${randomId}.zip`)).to.be.true;
    }));
});
