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
const models = {
    Subscriptions: {
        findOneByRoomIdAndUserId: sinon_1.default.stub(),
        setGroupE2EKey: sinon_1.default.stub(),
        setGroupE2ESuggestedKey: sinon_1.default.stub(),
    },
    Rooms: {
        removeUsersFromE2EEQueueByRoomId: sinon_1.default.stub(),
    },
};
const { updateGroupKey } = proxyquire_1.default.noCallThru().load('../../../../../../app/e2e/server/methods/updateGroupKey.ts', {
    '../../../lib/server/lib/notifyListener': {
        notifyOnSubscriptionChanged: sinon_1.default.stub(),
        notifyOnRoomChangedById: sinon_1.default.stub(),
        notifyOnSubscriptionChangedById: sinon_1.default.stub(),
    },
    '../../../lib/server/lib/deprecationWarningLogger': {
        methodDeprecationLogger: {
            method: sinon_1.default.stub(),
        },
    },
    '@rocket.chat/models': models,
    'meteor/meteor': { Meteor: { methods: sinon_1.default.stub() } },
});
(0, mocha_1.describe)('updateGroupKey', () => {
    (0, mocha_1.beforeEach)(() => {
        models.Subscriptions.findOneByRoomIdAndUserId.reset();
        models.Subscriptions.setGroupE2EKey.reset();
        models.Subscriptions.setGroupE2ESuggestedKey.reset();
    });
    (0, mocha_1.it)('should do nothing if user has no subscription', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Subscriptions.findOneByRoomIdAndUserId.resolves(null);
        const res = yield updateGroupKey('rid', 'uid', 'key', 'callerUserId');
        (0, chai_1.expect)(res).to.be.undefined;
    }));
    (0, mocha_1.it)('should suggest the key to the user when uid is different from callerUserId', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Subscriptions.findOneByRoomIdAndUserId.resolves({ _id: 'subscriptionId' });
        models.Subscriptions.setGroupE2ESuggestedKey.resolves({ value: {} });
        const res = yield updateGroupKey('rid', 'uid', 'key', 'callerUserId');
        (0, chai_1.expect)(res).to.be.undefined;
        (0, chai_1.expect)(models.Subscriptions.setGroupE2ESuggestedKey.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should set the group key when uid is the callerUserId', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Subscriptions.findOneByRoomIdAndUserId.resolves({ _id: 'subscriptionId' });
        models.Subscriptions.setGroupE2EKey.resolves({ modifiedCount: 1 });
        models.Rooms.removeUsersFromE2EEQueueByRoomId.resolves({ modifiedCount: 1 });
        const res = yield updateGroupKey('rid', 'uid', 'key', 'uid');
        (0, chai_1.expect)(res).to.be.undefined;
        (0, chai_1.expect)(models.Subscriptions.setGroupE2EKey.calledOnce).to.be.true;
        (0, chai_1.expect)(models.Rooms.removeUsersFromE2EEQueueByRoomId.calledOnce).to.be.true;
    }));
});
