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
        archiveById: sinon_1.default.stub(),
        updateOne: sinon_1.default.stub(),
        findOneById: sinon_1.default.stub(),
        findDirectRoomContainingAllUsernames: sinon_1.default.stub(),
        findOneByNonValidatedName: sinon_1.default.stub(),
    },
    Subscriptions: {
        archiveByRoomId: sinon_1.default.stub(),
    },
};
const createDirectMessage = sinon_1.default.stub();
const saveRoomSettings = sinon_1.default.stub();
const { RoomConverter } = proxyquire_1.default.noCallThru().load('../../../../../app/importer/server/classes/converters/RoomConverter', {
    '../../../settings/server': {
        settings: { get: settingsStub },
    },
    '../../../../../server/methods/createDirectMessage': {
        createDirectMessage,
    },
    '../../../../channel-settings/server/methods/saveRoomSettings': {
        saveRoomSettings,
    },
    '../../../../lib/server/lib/notifyListener': {
        notifyOnSubscriptionChangedByRoomId: sinon_1.default.stub(),
    },
    '../../../../lib/server/methods/createChannel': {
        createChannelMethod: sinon_1.default.stub(),
    },
    '../../../../lib/server/methods/createPrivateGroup': {
        createPrivateGroupMethod: sinon_1.default.stub(),
    },
    'meteor/check': sinon_1.default.stub(),
    'meteor/meteor': sinon_1.default.stub(),
    '@rocket.chat/models': Object.assign(Object.assign({}, modelsMock), { '@global': true }),
});
describe('Room Converter', () => {
    beforeEach(() => {
        modelsMock.Rooms.archiveById.reset();
        modelsMock.Rooms.updateOne.reset();
        modelsMock.Rooms.findOneById.reset();
        modelsMock.Rooms.findDirectRoomContainingAllUsernames.reset();
        modelsMock.Rooms.findOneByNonValidatedName.reset();
        modelsMock.Subscriptions.archiveByRoomId.reset();
        createDirectMessage.reset();
        saveRoomSettings.reset();
        settingsStub.reset();
    });
    const roomToImport = {
        name: 'room1',
        importIds: ['importIdRoom1'],
    };
    describe('[findExistingRoom]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId');
            (0, chai_1.expect)(converter.findExistingRoom.getCall(0)).to.not.be.null;
        }));
        it('should search by name', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            yield converter.findExistingRoom(roomToImport);
            (0, chai_1.expect)(modelsMock.Rooms.findOneByNonValidatedName.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(modelsMock.Rooms.findOneByNonValidatedName.getCall(0).args).to.be.an('array').that.contains('room1');
        }));
        it('should not search by name if there is none', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            yield converter.findExistingRoom({});
            (0, chai_1.expect)(modelsMock.Rooms.findOneByNonValidatedName.getCalls()).to.be.an('array').with.lengthOf(0);
        }));
        it('should search DMs by usernames', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            converter._cache.addUser('importId1', 'userId1', 'username1');
            converter._cache.addUser('importId2', 'userId2', 'username2');
            yield converter.findExistingRoom({
                t: 'd',
                users: ['importId1', 'importId2'],
                importIds: ['importIdRoom1'],
            });
            (0, chai_1.expect)(modelsMock.Rooms.findDirectRoomContainingAllUsernames.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(modelsMock.Rooms.findDirectRoomContainingAllUsernames.getCall(0).args)
                .to.be.an('array')
                .that.deep.includes(['username1', 'username2']);
        }));
    });
    describe('[insertRoom]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertRoom');
            sinon_1.default.stub(converter, 'updateRoom');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId');
            (0, chai_1.expect)(converter.updateRoom.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.insertRoom.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertRoom.getCall(0).args).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(converter.insertRoom.getCall(0).args[0]).to.be.deep.equal(roomToImport);
        }));
        it('function should not be called for existing rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            converter.findExistingRoom.returns({ _id: 'oldId' });
            sinon_1.default.stub(converter, 'insertRoom');
            sinon_1.default.stub(converter, 'updateRoom');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId');
            (0, chai_1.expect)(converter.insertRoom.getCall(0)).to.be.null;
        }));
        it('should call createDirectMessage to create DM rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'updateRoomId');
            createDirectMessage.callsFake((_options, data) => {
                return Object.assign(Object.assign({}, data), { _id: 'Id1' });
            });
            converter._cache.addUser('importId1', 'userId1', 'username1');
            converter._cache.addUser('importId2', 'userId2', 'username2');
            yield converter.insertRoom({
                t: 'd',
                users: ['importId1', 'importId2'],
                importIds: ['importIdRoom1'],
            }, 'startedByUserId');
            (0, chai_1.expect)(createDirectMessage.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(createDirectMessage.getCall(0).args).to.be.an('array').with.lengthOf(3).that.deep.includes(['username1', 'username2']);
        }));
        // #TODO: Validate all room types
    });
    describe('callbacks', () => {
        it('beforeImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const beforeImportFn = sinon_1.default.stub();
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId', {
                beforeImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('afterImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const afterImportFn = sinon_1.default.stub();
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId', {
                afterImportFn,
            });
            (0, chai_1.expect)(converter.insertOrUpdateRoom.getCalls()).to.be.an('array').with.lengthOf(1);
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
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            sinon_1.default.stub(converter, 'skipRecord');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId', {
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.skipRecord.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.skipRecord.getCall(0).args).to.be.an('array').that.is.deep.equal([recordId]);
            (0, chai_1.expect)(converter.insertOrUpdateRoom.getCalls()).to.be.an('array').with.lengthOf(0);
        }));
        it('should not skip record if beforeImportFn returns true', () => __awaiter(void 0, void 0, void 0, function* () {
            const beforeImportFn = sinon_1.default.stub();
            const afterImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake(() => true);
            const converter = new RoomConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            sinon_1.default.stub(converter, 'skipRecord');
            yield converter.addObject(roomToImport);
            yield converter.convertChannels('startedByUserId', {
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.skipRecord.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.insertOrUpdateRoom.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('onErrorFn should be triggered if there is no name and is not a DM', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new RoomConverter({ workInMemory: true });
            const onErrorFn = sinon_1.default.stub();
            sinon_1.default.stub(converter, 'findExistingRoom');
            sinon_1.default.stub(converter, 'insertOrUpdateRoom');
            sinon_1.default.stub(converter, 'saveError');
            yield converter.addObject({});
            yield converter.convertChannels('startedByUserId', { onErrorFn });
            (0, chai_1.expect)(converter.insertOrUpdateRoom.getCall(0)).to.be.null;
            (0, chai_1.expect)(onErrorFn.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(converter.saveError.getCall(0)).to.not.be.null;
        }));
    });
});
