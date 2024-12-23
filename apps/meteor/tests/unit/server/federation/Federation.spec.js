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
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const findOneByRoomIdAndUserIdStub = sinon_1.default.stub();
const { Federation } = proxyquire_1.default.noCallThru().load('../../../../server/services/federation/Federation', {
    '@rocket.chat/models': {
        Subscriptions: {
            findOneByRoomIdAndUserId: findOneByRoomIdAndUserIdStub,
        },
    },
});
describe('Federation[Server] - Federation', () => {
    afterEach(() => findOneByRoomIdAndUserIdStub.reset());
    describe('#actionAllowed()', () => {
        it('should return false if the room is NOT federated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c' }, IRoomTypeConfig_1.RoomMemberActions.INVITE)).to.eventually.be.false;
        }));
        it('should return false if the room is a DM one', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'd', federated: true }, IRoomTypeConfig_1.RoomMemberActions.INVITE)).to.eventually.be.false;
        }));
        it('should return true if an userId was not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, IRoomTypeConfig_1.RoomMemberActions.INVITE)).to.eventually.be.true;
        }));
        it('should return true if there is no subscription for the userId', () => __awaiter(void 0, void 0, void 0, function* () {
            findOneByRoomIdAndUserIdStub.returns(undefined);
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, IRoomTypeConfig_1.RoomMemberActions.INVITE, 'userId')).to.eventually.be.true;
        }));
        it('should return true if the action is equal to Leave (since any user can leave a channel)', () => __awaiter(void 0, void 0, void 0, function* () {
            findOneByRoomIdAndUserIdStub.returns({});
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, IRoomTypeConfig_1.RoomMemberActions.LEAVE, 'userId')).to.eventually.be.true;
        }));
        const allowedActions = [
            IRoomTypeConfig_1.RoomMemberActions.REMOVE_USER,
            IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER,
            IRoomTypeConfig_1.RoomMemberActions.SET_AS_MODERATOR,
            IRoomTypeConfig_1.RoomMemberActions.INVITE,
            IRoomTypeConfig_1.RoomMemberActions.JOIN,
            IRoomTypeConfig_1.RoomMemberActions.LEAVE,
        ];
        Object.values(IRoomTypeConfig_1.RoomMemberActions)
            .filter((action) => !allowedActions.includes(action))
            .forEach((action) => {
            it('should return false if the action is NOT allowed within the federation context for regular channels', () => __awaiter(void 0, void 0, void 0, function* () {
                findOneByRoomIdAndUserIdStub.returns({});
                yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, action, 'userId')).to.eventually.be.false;
            }));
        });
        allowedActions.forEach((action) => {
            it('should return true if the action is allowed within the federation context for regular channels and the user is a room owner', () => __awaiter(void 0, void 0, void 0, function* () {
                findOneByRoomIdAndUserIdStub.returns({ roles: ['owner'] });
                yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, action, 'userId')).to.eventually.be.true;
            }));
        });
        const allowedActionsForModerators = allowedActions.filter((action) => action !== IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER);
        allowedActionsForModerators.forEach((action) => {
            it('should return true if the action is allowed within the federation context for regular channels and the user is a room moderator', () => __awaiter(void 0, void 0, void 0, function* () {
                findOneByRoomIdAndUserIdStub.returns({ roles: ['moderator'] });
                yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, action, 'userId')).to.eventually.be.true;
            }));
        });
        it('should return false if the action is equal to set owner and the user is a room moderator', () => __awaiter(void 0, void 0, void 0, function* () {
            findOneByRoomIdAndUserIdStub.returns({ roles: ['moderator'] });
            yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, IRoomTypeConfig_1.RoomMemberActions.SET_AS_OWNER, 'userId')).to.eventually.be
                .false;
        }));
        const disallowedActionForRegularUsers = allowedActions.filter((action) => action !== IRoomTypeConfig_1.RoomMemberActions.LEAVE);
        disallowedActionForRegularUsers.forEach((action) => {
            it('should return false if the for all other actions (excluding LEAVE) for regular users', () => __awaiter(void 0, void 0, void 0, function* () {
                findOneByRoomIdAndUserIdStub.returns({});
                yield (0, chai_1.expect)(Federation.actionAllowed({ t: 'c', federated: true }, action, 'userId')).to.eventually.be.false;
            }));
        });
    });
    describe('#isAFederatedUsername()', () => {
        it('should return true if the username is a federated username (includes at least one "@" and at least one ":"', () => {
            (0, chai_1.expect)(Federation.isAFederatedUsername('@user:domain.com')).to.be.true;
        });
        it('should return false if the username is a federated username (does NOT includes at least one "@" and at least one ":"', () => {
            (0, chai_1.expect)(Federation.isAFederatedUsername('user:domain.com')).to.be.false;
        });
    });
    describe('#escapeExternalFederationId()', () => {
        it('should replace all "$" with "__sign__"', () => {
            (0, chai_1.expect)(Federation.escapeExternalFederationEventId('$stri$ng')).to.be.equal('__sign__stri__sign__ng');
        });
    });
    describe('#unescapeExternalFederationEventId()', () => {
        it('should replace all "__sign__" with "$"', () => {
            (0, chai_1.expect)(Federation.unescapeExternalFederationEventId('__sign__stri__sign__ng')).to.be.equal('$stri$ng');
        });
    });
    describe('#isRoomSettingAllowed()', () => {
        it('should return false if the room is NOT federated', () => {
            (0, chai_1.expect)(Federation.isRoomSettingAllowed({ t: 'c' }, IRoomTypeConfig_1.RoomSettingsEnum.NAME)).to.be.false;
        });
        it('should return false if the room is a DM one', () => {
            (0, chai_1.expect)(Federation.isRoomSettingAllowed({ t: 'd', federated: true }, IRoomTypeConfig_1.RoomSettingsEnum.NAME)).to.be.false;
        });
        const allowedSettingsChanges = [IRoomTypeConfig_1.RoomSettingsEnum.NAME, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC];
        Object.values(IRoomTypeConfig_1.RoomSettingsEnum)
            .filter((setting) => !allowedSettingsChanges.includes(setting))
            .forEach((setting) => {
            it('should return false if the setting change is NOT allowed within the federation context for regular channels', () => {
                (0, chai_1.expect)(Federation.isRoomSettingAllowed({ t: 'c', federated: true }, setting)).to.be.false;
            });
        });
        allowedSettingsChanges.forEach((setting) => {
            it('should return true if the setting change is allowed within the federation context for regular channels', () => {
                (0, chai_1.expect)(Federation.isRoomSettingAllowed({ t: 'c', federated: true }, setting)).to.be.true;
            });
        });
    });
});
