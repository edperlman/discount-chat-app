"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const { AbstractFederatedRoom, DirectMessageFederatedRoom, FederatedRoom, isAnInternalIdentifier } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../server/services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('Federation - Domain - FederatedRoom', () => {
    describe('#isAnInternalIdentifier()', () => {
        it('should return true if the origin is equal to the localOrigin', () => {
            (0, chai_1.expect)(isAnInternalIdentifier('localOrigin', 'localOrigin')).to.be.equal(true);
        });
        it('should return false if the origin is NOT equal to the localOrigin', () => {
            (0, chai_1.expect)(isAnInternalIdentifier('externalOrigin', 'localOrigin')).to.be.equal(false);
        });
    });
    describe('AbstractFederatedRoom', () => {
        class MyClass extends AbstractFederatedRoom {
            constructor({ externalId, internalReference }) {
                super({ externalId, internalReference });
            }
            isDirectMessage() {
                return false;
            }
            generateTemporaryName(id) {
                return MyClass.generateTemporaryName(id);
            }
        }
        class MyDMClass extends MyClass {
            isDirectMessage() {
                return true;
            }
        }
        describe('#constructor()', () => {
            it('should create the instance with the internalId as the provided one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { _id: 'providedId' } });
                (0, chai_1.expect)(federatedRoom.getInternalId()).to.be.equal('providedId');
                (0, chai_1.expect)(federatedRoom.getExternalId()).to.be.equal('externalId');
                (0, chai_1.expect)(federatedRoom.getInternalReference()).to.be.eql({ _id: 'providedId' });
            });
            it('should create the instance with the internalId equal to the automatically generated one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(federatedRoom.getInternalId()).to.be.equal('hexString');
                (0, chai_1.expect)(federatedRoom.getExternalId()).to.be.equal('externalId');
                (0, chai_1.expect)(federatedRoom.getInternalReference()).to.be.eql({ _id: 'hexString' });
            });
        });
        describe('#generateTemporaryName()', () => {
            it('should generate a temporary room name prefixed with "Federation-"', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { _id: 'providedId' } });
                (0, chai_1.expect)(federatedRoom.generateTemporaryName('id')).to.be.equal('Federation-id');
            });
        });
        describe('#getExternalId()', () => {
            it('should return the externalId equal to the provided one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { _id: 'providedId' } });
                (0, chai_1.expect)(federatedRoom.getExternalId()).to.be.equal('externalId');
            });
        });
        describe('#getRoomType()', () => {
            it('should return the roomType equal to the provided one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { t: 'roomType' } });
                (0, chai_1.expect)(federatedRoom.getRoomType()).to.be.equal('roomType');
            });
        });
        describe('#getName()', () => {
            it('should return the internal room name equal to the provided one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { name: 'name' } });
                (0, chai_1.expect)(federatedRoom.getName()).to.be.equal('name');
            });
        });
        describe('#getTopic()', () => {
            it('should return the internal room topic equal to the provided one', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.getTopic()).to.be.equal('topic');
            });
        });
        describe('#isOriginalFromTheProxyServer()', () => {
            it('should return true if the room is original from the proxy home server', () => {
                (0, chai_1.expect)(MyClass.isOriginalFromTheProxyServer('proxy', 'proxy')).to.be.equal(true);
            });
            it('should return false if the room is NOT original from the proxy home server', () => {
                (0, chai_1.expect)(MyClass.isOriginalFromTheProxyServer('externalserver', 'proxy')).to.be.equal(false);
            });
        });
        describe('#getInternalReference()', () => {
            it('should return the object (that was provided) for the internal reference', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.getInternalReference()).to.be.eql({ _id: 'hexString', topic: 'topic' });
            });
            it('should return a frozen object', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(Object.isFrozen(federatedRoom.getInternalReference())).to.be.equal(true);
            });
        });
        describe('#getCreatorUsername()', () => {
            it('should return the room creator username if it exists', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { u: { username: 'creator' } } });
                (0, chai_1.expect)(federatedRoom.getCreatorUsername()).to.be.equal('creator');
            });
            it('should return undefined if the creator does not have an username', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(federatedRoom.getCreatorUsername()).to.be.equal(undefined);
            });
        });
        describe('#getCreatorId()', () => {
            it('should return the room creator id if it exists', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { u: { _id: 'creatorId' } } });
                (0, chai_1.expect)(federatedRoom.getCreatorId()).to.be.equal('creatorId');
            });
            it('should return undefined if the creator does not have an id', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(federatedRoom.getCreatorId()).to.be.equal(undefined);
            });
        });
        describe('#changeRoomType()', () => {
            it('should set the room type if the original type is not equal a DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { u: { _id: 'creatorId' } } });
                federatedRoom.changeRoomType(rooms_1.RoomType.PRIVATE_GROUP);
                (0, chai_1.expect)(federatedRoom.getRoomType()).to.be.equal(rooms_1.RoomType.PRIVATE_GROUP);
            });
            it('should throw an error if the room is a DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(() => federatedRoom.changeRoomType(rooms_1.RoomType.PRIVATE_GROUP)).to.throw(Error, 'Its not possible to change a direct message type');
            });
        });
        describe('#changeRoomName()', () => {
            it('should set the room name if the original type is not equal a DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { name: 'name' } });
                (0, chai_1.expect)(federatedRoom.getName()).to.be.equal('name');
                federatedRoom.changeRoomName('new room name');
                (0, chai_1.expect)(federatedRoom.getName()).to.be.equal('new room name');
            });
            it('should throw an error if the room is a DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(() => federatedRoom.changeRoomName('new room name')).to.throw(Error, 'Its not possible to change a direct message name');
            });
        });
        describe('#changeDisplayRoomName()', () => {
            it('should set the room fname if the original type is not equal a DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { fname: 'fname' } });
                (0, chai_1.expect)(federatedRoom.getDisplayName()).to.be.equal('fname');
                federatedRoom.changeDisplayRoomName('new room fname');
                (0, chai_1.expect)(federatedRoom.getDisplayName()).to.be.equal('new room fname');
            });
            it('should throw an error if the room is a DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(() => federatedRoom.changeDisplayRoomName('new room name')).to.throw(Error, 'Its not possible to change a direct message name');
            });
        });
        describe('#changeRoomTopic()', () => {
            it('should set the room topic if the original type is not equal a DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.getTopic()).to.be.equal('topic');
                federatedRoom.changeRoomTopic('new room topic');
                (0, chai_1.expect)(federatedRoom.getTopic()).to.be.equal('new room topic');
            });
            it('should throw an error if the room is a DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: {} });
                (0, chai_1.expect)(() => federatedRoom.changeRoomTopic('new room topic')).to.throw(Error, 'Its not possible to change a direct message topic');
            });
        });
        describe('#shouldUpdateDisplayRoomName()', () => {
            it('should return true if the old name is different from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { fname: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateDisplayRoomName('new name')).to.be.equal(true);
            });
            it('should return false if the old name is EQUAL from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { fname: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateDisplayRoomName('name')).to.be.equal(false);
            });
            it('should return false if room type is equal DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: { fname: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateDisplayRoomName('new name')).to.be.equal(false);
            });
        });
        describe('#shouldUpdateRoomName()', () => {
            it('should return true if the old name is different from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { name: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomName('new name')).to.be.equal(true);
            });
            it('should return false if the old name is EQUAL from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { name: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomName('name')).to.be.equal(false);
            });
            it('should return false if room type is equal DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: { name: 'name' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomName('new name')).to.be.equal(false);
            });
        });
        describe('#shouldUpdateRoomTopic()', () => {
            it('should return true if the old topic is different from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomTopic('new topic')).to.be.equal(true);
            });
            it('should return false if the old topic is EQUAL from the new one and the room type is not equal DM', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomTopic('topic')).to.be.equal(false);
            });
            it('should return false if room type is not equal DM', () => {
                const federatedRoom = new MyDMClass({ externalId: 'externalId', internalReference: { topic: 'topic' } });
                (0, chai_1.expect)(federatedRoom.shouldUpdateRoomTopic('new topic')).to.be.equal(false);
            });
        });
        describe('#shouldUpdateMessage()', () => {
            it('should return true if the old message is different from the new one', () => {
                (0, chai_1.expect)(MyClass.shouldUpdateMessage('new message', { msg: 'different' })).to.be.equal(true);
            });
            it('should return false if the old message is EQUAL from the new one', () => {
                (0, chai_1.expect)(MyClass.shouldUpdateMessage('new message', { msg: 'new message' })).to.be.equal(false);
            });
        });
        describe('#isTheCreator()', () => {
            it('should return true if the provided userId is the creator', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { u: { _id: 'userId' } } });
                (0, chai_1.expect)(federatedRoom.isTheCreator('userId')).to.be.true;
            });
            it('should return false if the provided userId is NOT the creator', () => {
                const federatedRoom = new MyClass({ externalId: 'externalId', internalReference: { u: { _id: 'userId' } } });
                (0, chai_1.expect)(federatedRoom.isTheCreator('notCreatorUserId')).to.be.false;
            });
        });
    });
    describe('FederatedRoom', () => {
        const creator = { getInternalReference: () => ({ _id: 'creatorId' }) };
        describe('#createInstance()', () => {
            it('should set the internal room name when it was provided', () => {
                const federatedRoom = FederatedRoom.createInstance('!externalId@id', 'externalId', creator, 'p', 'myRoomName');
                (0, chai_1.expect)(federatedRoom.getDisplayName()).to.be.equal('myRoomName');
            });
            it('should generate automatically a room name when it was not provided', () => {
                const federatedRoom = FederatedRoom.createInstance('!externalId@id', 'externalId', creator, 'p');
                (0, chai_1.expect)(federatedRoom.getDisplayName()).to.be.equal('Federation-externalId');
            });
            it('should set the creator properly equal to the provided one', () => {
                const federatedRoom = FederatedRoom.createInstance('!externalId@id', 'externalId', creator, rooms_1.RoomType.CHANNEL);
                (0, chai_1.expect)(federatedRoom.getCreatorId()).to.be.equal('creatorId');
            });
            it('should throw an error if the user tries to create a DM instance', () => {
                (0, chai_1.expect)(() => FederatedRoom.createInstance('!externalId@id', 'externalId', creator, rooms_1.RoomType.DIRECT_MESSAGE)).to.throw('For DMs please use the specific class');
            });
            it('should return an instance of FederatedRoom', () => {
                const federatedRoom = FederatedRoom.createInstance('!externalId@id', 'externalId', creator, rooms_1.RoomType.CHANNEL);
                (0, chai_1.expect)(federatedRoom).to.be.instanceOf(FederatedRoom);
            });
        });
        describe('#createWithInternalReference()', () => {
            it('should set the internal room name when it was provided', () => {
                const federatedRoom = FederatedRoom.createWithInternalReference('!externalId@id', {
                    _id: 'hexString',
                    fname: 'Federation-externalId',
                    name: 'Federation-externalId',
                    t: 'c',
                    u: {
                        _id: 'creatorId',
                    },
                });
                (0, chai_1.expect)(federatedRoom.getInternalReference()).to.be.eql({
                    _id: 'hexString',
                    fname: 'Federation-externalId',
                    name: 'Federation-externalId',
                    t: 'c',
                    u: {
                        _id: 'creatorId',
                    },
                });
            });
            it('should throw an error if the user tries to create a DM instance', () => {
                (0, chai_1.expect)(() => FederatedRoom.createWithInternalReference('!externalId@id', { t: rooms_1.RoomType.DIRECT_MESSAGE })).to.throw('For DMs please use the specific class');
            });
            it('should return an instance of FederatedRoom', () => {
                const federatedRoom = FederatedRoom.createWithInternalReference('!externalId@id', creator);
                (0, chai_1.expect)(federatedRoom).to.be.instanceOf(FederatedRoom);
            });
        });
        describe('#isDirectMessage()', () => {
            it('should return false for FederatedRoom instances', () => {
                const federatedRoom = FederatedRoom.createInstance('!externalId@id', 'externalId', creator, rooms_1.RoomType.CHANNEL);
                (0, chai_1.expect)(federatedRoom.isDirectMessage()).to.be.false;
            });
        });
    });
    describe('DirectMessageFederatedRoom', () => {
        const creator = { getInternalReference: () => ({ _id: 'creatorId' }) };
        describe('#createInstance()', () => {
            it('should set the creator properly equal to the provided one', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, []);
                (0, chai_1.expect)(federatedRoom.getCreatorId()).to.be.equal('creatorId');
            });
            it('should set the members properly', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, [{ _id: 'memberId' }]);
                (0, chai_1.expect)(federatedRoom.getMembers()).to.be.eql([{ _id: 'memberId' }]);
            });
            it('should return an instance of DirectMessageFederatedRoom', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, []);
                (0, chai_1.expect)(federatedRoom).to.be.instanceOf(DirectMessageFederatedRoom);
            });
        });
        describe('#createWithInternalReference()', () => {
            it('should set the internal room name when it was provided', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', {
                    _id: 'hexString',
                    t: 'd',
                    u: {
                        _id: 'creatorId',
                    },
                }, []);
                (0, chai_1.expect)(federatedRoom.getInternalReference()).to.be.eql({
                    _id: 'hexString',
                    t: 'd',
                    u: {
                        _id: 'creatorId',
                    },
                });
                (0, chai_1.expect)(federatedRoom.getMembers()).to.be.eql([]);
            });
            it('should return an instance of DirectMessageFederatedRoom', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', creator, []);
                (0, chai_1.expect)(federatedRoom).to.be.instanceOf(DirectMessageFederatedRoom);
            });
        });
        describe('#getMembersUsernames()', () => {
            it('should return the members usernames', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, [
                    { getUsername: () => 'username1' },
                    { getUsername: () => 'username2' },
                ]);
                (0, chai_1.expect)(federatedRoom.getMembersUsernames()).to.be.eql(['username1', 'username2']);
            });
        });
        describe('#getMembers()', () => {
            it('should return the members', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, [
                    { _id: 'userId' },
                    { _id: 'userId2' },
                ]);
                (0, chai_1.expect)(federatedRoom.getMembers()).to.be.eql([{ _id: 'userId' }, { _id: 'userId2' }]);
            });
        });
        describe('#addMember()', () => {
            it('should add a new member correctly', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, [
                    { _id: 'userId' },
                    { _id: 'userId2' },
                ]);
                (0, chai_1.expect)(federatedRoom.getMembers()).to.be.eql([{ _id: 'userId' }, { _id: 'userId2' }]);
                federatedRoom.addMember({ _id: 'userId3' });
                (0, chai_1.expect)(federatedRoom.getMembers()).to.be.eql([{ _id: 'userId' }, { _id: 'userId2' }, { _id: 'userId3' }]);
            });
        });
        describe('#isUserPartOfTheRoom()', () => {
            it('should return false if the provided user does not have an username', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', creator, [
                    { _id: 'userId' },
                    { _id: 'userId2' },
                ]);
                (0, chai_1.expect)(federatedRoom.isUserPartOfTheRoom({ getUsername: () => '' })).to.be.equal(false);
            });
            it('should return false if the room does not have usernames within it', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', {}, [
                    { _id: 'userId' },
                    { _id: 'userId2' },
                ]);
                (0, chai_1.expect)(federatedRoom.isUserPartOfTheRoom({ getUsername: () => 'username' })).to.be.equal(false);
            });
            it('should return false if the user is NOT part of the room yet', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', { usernames: ['username12'] }, [{ _id: 'userId' }, { _id: 'userId2' }]);
                (0, chai_1.expect)(federatedRoom.isUserPartOfTheRoom({ getUsername: () => 'username' })).to.be.equal(false);
            });
            it('should return true if the user is already part of the room', () => {
                const federatedRoom = DirectMessageFederatedRoom.createWithInternalReference('!externalId@id', { usernames: ['username'] }, [
                    { _id: 'userId' },
                    { _id: 'userId2' },
                ]);
                (0, chai_1.expect)(federatedRoom.isUserPartOfTheRoom({ getUsername: () => 'username' })).to.be.equal(true);
            });
        });
        describe('#isDirectMessage()', () => {
            it('should return true for DirectMessageFederatedRoom instances', () => {
                const federatedRoom = DirectMessageFederatedRoom.createInstance('!externalId@id', creator, []);
                (0, chai_1.expect)(federatedRoom.isDirectMessage()).to.be.true;
            });
        });
    });
});
