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
const settingsStub = sinon_1.default.stub();
const modelsMock = {
    ImportData: {
        find: sinon_1.default.stub(),
        updateOne: sinon_1.default.stub(),
        col: {
            insertOne: sinon_1.default.stub(),
        },
    },
};
const { RecordConverter } = proxyquire_1.default.noCallThru().load('../../../../../app/importer/server/classes/converters/RecordConverter', {
    '../../../settings/server': {
        settings: { get: settingsStub },
    },
    'meteor/check': sinon_1.default.stub(),
    'meteor/meteor': sinon_1.default.stub(),
    '@rocket.chat/models': Object.assign(Object.assign({}, modelsMock), { '@global': true }),
});
class TestConverter extends RecordConverter {
    constructor(workInMemory = true) {
        super({ workInMemory });
    }
    getDataType() {
        return 'user';
    }
}
describe('Record Converter', () => {
    const userToImport = {
        name: 'user1',
        emails: ['user1@domain.com'],
        importIds: ['importId1'],
        username: 'username1',
    };
    describe('Working with Mongo Collection', () => {
        beforeEach(() => {
            modelsMock.ImportData.col.insertOne.reset();
            modelsMock.ImportData.find.reset();
            modelsMock.ImportData.updateOne.reset();
            modelsMock.ImportData.find.callsFake(() => ({ toArray: () => [] }));
        });
        describe('Adding and Retrieving users', () => {
            it('should store objects in the collection', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(false);
                yield converter.addObject(userToImport);
                (0, chai_1.expect)(modelsMock.ImportData.col.insertOne.getCall(0)).to.not.be.null;
            }));
            it('should read objects from the collection', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(false);
                yield converter.addObject(userToImport);
                yield converter.getDataToImport();
                (0, chai_1.expect)(modelsMock.ImportData.find.getCall(0)).to.not.be.null;
            }));
            it('should flag skipped records on the document', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(false);
                yield converter.skipRecord('skippedId');
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0)).to.not.be.null;
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0).args).to.be.an('array').that.deep.contains({ _id: 'skippedId' });
            }));
            it('should store error information on the document', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(false);
                yield converter.saveError('errorId', new Error());
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0)).to.not.be.null;
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0).args).to.be.an('array').that.deep.contains({ _id: 'errorId' });
            }));
        });
    });
    describe('Working in Memory', () => {
        beforeEach(() => {
            modelsMock.ImportData.col.insertOne.reset();
            modelsMock.ImportData.updateOne.reset();
            modelsMock.ImportData.find.reset();
            settingsStub.reset();
        });
        describe('Adding and Retrieving users', () => {
            it('should not store objects in the collection', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(true);
                yield converter.addObject(userToImport);
                (0, chai_1.expect)(modelsMock.ImportData.col.insertOne.getCall(0)).to.be.null;
            }));
            it('should not try to read objects from the collection', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(true);
                yield converter.addObject(userToImport);
                yield converter.getDataToImport();
                (0, chai_1.expect)(modelsMock.ImportData.find.getCall(0)).to.be.null;
            }));
            it('should properly retrieve the data added to memory', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(true);
                yield converter.addObject(userToImport);
                const dataToImport = yield converter.getDataToImport();
                (0, chai_1.expect)(dataToImport.length).to.be.equal(1);
                (0, chai_1.expect)(dataToImport[0].data).to.be.equal(userToImport);
            }));
            it('should not access the collection when flagging skipped records', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(true);
                yield converter.skipRecord('skippedId');
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0)).to.be.null;
            }));
            it('should not access the collection when storing error information', () => __awaiter(void 0, void 0, void 0, function* () {
                const converter = new TestConverter(true);
                yield converter.saveError('errorId', new Error());
                (0, chai_1.expect)(modelsMock.ImportData.updateOne.getCall(0)).to.be.null;
            }));
        });
    });
});
