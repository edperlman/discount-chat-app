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
    Rooms: {
        findOneByImportId: sinon_1.default.stub(),
    },
};
const insertMessage = sinon_1.default.stub();
const { MessageConverter } = proxyquire_1.default.noCallThru().load('../../../../../app/importer/server/classes/converters/MessageConverter', {
    '../../../settings/server': {
        settings: { get: settingsStub },
    },
    '../../../../lib/server/functions/insertMessage': {
        insertMessage,
    },
    'meteor/check': sinon_1.default.stub(),
    'meteor/meteor': sinon_1.default.stub(),
    '@rocket.chat/models': Object.assign(Object.assign({}, modelsMock), { '@global': true }),
});
describe('Message Converter', () => {
    beforeEach(() => {
        modelsMock.Rooms.findOneByImportId.reset();
        insertMessage.reset();
        settingsStub.reset();
    });
    const messageToImport = {
        ts: Date.now(),
        u: {
            _id: 'rocket.cat',
        },
        rid: 'general',
        msg: 'testing',
    };
    describe('[insertMessage]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'insertMessage');
            sinon_1.default.stub(converter, 'resetLastMessages');
            yield converter.addObject(messageToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.insertMessage.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertMessage.getCall(0).args).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(converter.insertMessage.getCall(0).args[0]).to.be.deep.equal(messageToImport);
        }));
        it('should call insertMessage lib function to save the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'main');
            yield converter.insertMessage(messageToImport);
            (0, chai_1.expect)(insertMessage.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(insertMessage.getCall(0).args).to.be.an('array').with.lengthOf(4);
            (0, chai_1.expect)(insertMessage.getCall(0).args[0]).to.be.deep.equal({
                _id: 'rocket.cat',
                username: 'rocket.cat',
            });
            (0, chai_1.expect)(insertMessage.getCall(0).args[1]).to.deep.include({
                ts: messageToImport.ts,
                msg: messageToImport.msg,
                rid: 'main',
            });
        }));
    });
    describe('[buildMessageObject]', () => {
        it('should have the basic info', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new MessageConverter({ workInMemory: true });
            const converted = yield converter.buildMessageObject(messageToImport, 'general', { _id: 'rocket.cat', username: 'rocket.cat' });
            (0, chai_1.expect)(converted)
                .to.be.an('object')
                .that.deep.includes({
                ts: messageToImport.ts,
                msg: messageToImport.msg,
                u: {
                    _id: 'rocket.cat',
                    username: 'rocket.cat',
                },
            });
        }));
        // #TODO: Validate all message attributes
    });
    describe('callbacks', () => {
        it('beforeImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const beforeImportFn = sinon_1.default.stub();
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'insertMessage');
            sinon_1.default.stub(converter, 'resetLastMessages');
            yield converter.addObject(messageToImport);
            yield converter.convertData({
                beforeImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('afterImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const afterImportFn = sinon_1.default.stub();
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'insertMessage');
            sinon_1.default.stub(converter, 'resetLastMessages');
            yield converter.addObject(messageToImport);
            yield converter.convertData({
                afterImportFn,
            });
            (0, chai_1.expect)(converter.insertMessage.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('should skip record if beforeImportFn returns false', () => __awaiter(void 0, void 0, void 0, function* () {
            let recordId = null;
            const beforeImportFn = sinon_1.default.stub();
            const afterImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake((record) => {
                recordId = record._id;
                return false;
            });
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'insertMessage');
            sinon_1.default.stub(converter, 'resetLastMessages');
            sinon_1.default.stub(converter, 'skipRecord');
            yield converter.addObject(messageToImport);
            yield converter.convertData({
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.skipRecord.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.skipRecord.getCall(0).args).to.be.an('array').that.is.deep.equal([recordId]);
            (0, chai_1.expect)(converter.insertMessage.getCalls()).to.be.an('array').with.lengthOf(0);
        }));
        it('should not skip record if beforeImportFn returns true', () => __awaiter(void 0, void 0, void 0, function* () {
            const beforeImportFn = sinon_1.default.stub();
            const afterImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake(() => true);
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'insertMessage');
            sinon_1.default.stub(converter, 'resetLastMessages');
            sinon_1.default.stub(converter, 'skipRecord');
            yield converter.addObject(messageToImport);
            yield converter.convertData({
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.skipRecord.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.insertMessage.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('onErrorFn should be triggered if mandatory attributes are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new MessageConverter({ workInMemory: true });
            converter._cache.addRoom('general', 'general');
            sinon_1.default.stub(converter, 'resetLastMessages');
            const onErrorFn = sinon_1.default.stub();
            sinon_1.default.stub(converter, 'saveError');
            yield converter.addObject({});
            yield converter.convertData({ onErrorFn });
            (0, chai_1.expect)(onErrorFn.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(converter.saveError.getCall(0)).to.not.be.null;
        }));
    });
});
