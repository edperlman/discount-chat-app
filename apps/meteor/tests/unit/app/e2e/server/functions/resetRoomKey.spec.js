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
const subscriptions_1 = require("../../../../../mocks/data/subscriptions");
const models = {
    Users: {
        findOneById: sinon_1.default.stub(),
    },
    Rooms: {
        findOneById: sinon_1.default.stub(),
        resetRoomKeyAndSetE2EEQueueByRoomId: sinon_1.default.stub(),
    },
    Subscriptions: {
        find: sinon_1.default.stub(),
        col: {
            bulkWrite: sinon_1.default.stub(),
        },
        setE2EKeyByUserIdAndRoomId: sinon_1.default.stub(),
    },
};
const { resetRoomKey, pushToLimit, replicateMongoSlice } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../app/e2e/server/functions/resetRoomKey', {
    '@rocket.chat/models': models,
    '../../../lib/server/lib/notifyListener': {
        notifyOnRoomChanged: sinon_1.default.stub(),
        notifyOnSubscriptionChanged: sinon_1.default.stub(),
    },
});
(0, mocha_1.describe)('pushToLimit', () => {
    (0, mocha_1.it)('should push up to a limit', () => {
        const arr = [];
        pushToLimit(arr, { foo: 'bar' }, 2);
        (0, chai_1.expect)(arr).to.have.lengthOf(1);
        (0, chai_1.expect)(arr[0]).to.deep.equal({ foo: 'bar' });
        pushToLimit(arr, { foo: 'bar' }, 2);
        (0, chai_1.expect)(arr).to.have.lengthOf(2);
        (0, chai_1.expect)(arr[0]).to.deep.equal({ foo: 'bar' });
        (0, chai_1.expect)(arr[1]).to.deep.equal({ foo: 'bar' });
        pushToLimit(arr, { foo: 'bzz' }, 2);
        (0, chai_1.expect)(arr).to.have.lengthOf(2);
        (0, chai_1.expect)(arr[0]).to.deep.equal({ foo: 'bar' });
        (0, chai_1.expect)(arr[1]).to.deep.equal({ foo: 'bar' });
        (0, chai_1.expect)(arr.filter((e) => e.foo === 'bzz')).to.have.lengthOf(0);
    });
});
(0, mocha_1.describe)('replicateMongoSlice', () => {
    (0, mocha_1.it)('should do nothing if sub has no E2EKey', () => {
        (0, chai_1.expect)(replicateMongoSlice('1', { oldRoomKeys: [] })).to.be.undefined;
    });
    (0, mocha_1.it)('should return an array with the new E2EKey as an old key when there is no oldkeys', () => {
        (0, chai_1.expect)(replicateMongoSlice('1', { E2EKey: '1' })[0].E2EKey).to.equal('1');
    });
    (0, mocha_1.it)('should unshift a new key if sub has E2EKey and oldRoomKeys', () => {
        (0, chai_1.expect)(replicateMongoSlice('1', { oldRoomKeys: [{ E2EKey: '1', ts: new Date() }], E2EKey: '2' })[0].E2EKey).to.equal('2');
    });
    (0, mocha_1.it)('should unshift a new key, and eliminate the 10th key if array has 10 items', () => {
        const result = replicateMongoSlice('1', {
            oldRoomKeys: [
                { E2EKey: '1', ts: new Date() },
                { E2EKey: '2', ts: new Date() },
                { E2EKey: '3', ts: new Date() },
                { E2EKey: '4', ts: new Date() },
                { E2EKey: '5', ts: new Date() },
                { E2EKey: '6', ts: new Date() },
                { E2EKey: '7', ts: new Date() },
                { E2EKey: '8', ts: new Date() },
                { E2EKey: '9', ts: new Date() },
                { E2EKey: '10', ts: new Date() },
            ],
            E2EKey: '11',
        });
        (0, chai_1.expect)(result[0].E2EKey).to.equal('11');
        (0, chai_1.expect)(result[9].E2EKey).to.equal('9');
        (0, chai_1.expect)(result).to.have.lengthOf(10);
    });
});
(0, mocha_1.describe)('resetRoomKey', () => {
    (0, mocha_1.beforeEach)(() => {
        models.Users.findOneById.reset();
        models.Rooms.findOneById.reset();
        models.Rooms.resetRoomKeyAndSetE2EEQueueByRoomId.reset();
        models.Subscriptions.setE2EKeyByUserIdAndRoomId.reset();
        models.Subscriptions.col.bulkWrite.reset();
    });
    (0, mocha_1.it)('should fail if userId does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Users.findOneById.resolves(null);
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-user-not-found');
    }));
    (0, mocha_1.it)('should fail if the user has no e2e keys', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Users.findOneById.resolves({});
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-user-has-no-keys');
        models.Users.findOneById.resolves({ e2e: { private_key: 'a' } });
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-user-has-no-keys');
        models.Users.findOneById.resolves({ e2e: { public_key: 'b' } });
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-user-has-no-keys');
    }));
    (0, mocha_1.it)('should fail if roomId does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Users.findOneById.resolves({ e2e: { private_key: 'a', public_key: 'b' } });
        models.Rooms.findOneById.resolves(null);
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-room-not-found');
    }));
    (0, mocha_1.it)('should fail if room does not have a keyId', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Users.findOneById.resolves({ e2e: { private_key: 'a', public_key: 'b' } });
        models.Rooms.findOneById.resolves({ e2eKeyId: null });
        yield (0, chai_1.expect)(resetRoomKey('1', '2', '3', '4')).to.be.rejectedWith('error-room-not-encrypted');
    }));
    (0, mocha_1.it)('should try to process subs', () => __awaiter(void 0, void 0, void 0, function* () {
        const subs = (0, subscriptions_1.generateMultipleSubs)(10);
        function* generateSubs() {
            for (const sub of subs) {
                yield Object.assign({}, sub);
            }
        }
        models.Users.findOneById.resolves({ e2e: { private_key: 'a', public_key: 'b' } });
        models.Rooms.findOneById.resolves({ e2eKeyId: '5' });
        models.Subscriptions.find.returns(generateSubs());
        models.Rooms.resetRoomKeyAndSetE2EEQueueByRoomId.resolves({ value: { e2eKeyId: '5' } });
        models.Subscriptions.setE2EKeyByUserIdAndRoomId.resolves({ value: { e2eKeyId: '5' } });
        yield resetRoomKey('1', '2', '3', '4');
        (0, chai_1.expect)(models.Subscriptions.col.bulkWrite.callCount).to.equal(1);
        const updateOps = models.Subscriptions.col.bulkWrite.getCall(0).args[0];
        (0, chai_1.expect)(updateOps).to.have.lengthOf(10);
        (0, chai_1.expect)(updateOps.every((op) => op.updateOne)).to.be.true;
        updateOps.forEach((op) => {
            var _a, _b;
            const sub = subs.find((s) => s._id === op.updateOne.filter._id);
            (0, chai_1.expect)(op.updateOne.update.$unset).to.be.deep.equal({ E2EKey: 1, E2ESuggestedKey: 1, suggestedOldRoomKeys: 1 });
            if ((sub === null || sub === void 0 ? void 0 : sub.E2EKey) && ((_a = sub === null || sub === void 0 ? void 0 : sub.oldRoomKeys) === null || _a === void 0 ? void 0 : _a.length) < 10) {
                (0, chai_1.expect)(op.updateOne.update.$set.oldRoomKeys).to.have.length(sub.oldRoomKeys.length + 1);
                (0, chai_1.expect)(op.updateOne.update.$set.oldRoomKeys.every((key) => [...sub.oldRoomKeys.map((k) => k.E2EKey), sub.E2EKey].includes(key.E2EKey))).to.be.true;
            }
            if (!(sub === null || sub === void 0 ? void 0 : sub.E2EKey) && !(sub === null || sub === void 0 ? void 0 : sub.oldRoomKeys)) {
                (0, chai_1.expect)(op.updateOne.update).to.not.to.have.property('$set');
            }
            if (((_b = sub === null || sub === void 0 ? void 0 : sub.oldRoomKeys) === null || _b === void 0 ? void 0 : _b.length) === 10 && (sub === null || sub === void 0 ? void 0 : sub.E2EKey)) {
                (0, chai_1.expect)(op.updateOne.update.$set.oldRoomKeys).to.have.length(10);
                (0, chai_1.expect)(op.updateOne.update.$set.oldRoomKeys[0].E2EKey).to.equal(sub.E2EKey);
            }
        });
        (0, chai_1.expect)(models.Rooms.resetRoomKeyAndSetE2EEQueueByRoomId.getCall(0).args[0]).to.equal('1');
        (0, chai_1.expect)(models.Subscriptions.setE2EKeyByUserIdAndRoomId.getCall(0).args).to.deep.equal(['2', '1', '3']);
    }));
    (0, mocha_1.it)('should process more than 100 subs', () => __awaiter(void 0, void 0, void 0, function* () {
        const subs = (0, subscriptions_1.generateMultipleSubs)(150);
        function* generateSubs() {
            for (const sub of subs) {
                yield Object.assign({}, sub);
            }
        }
        models.Users.findOneById.resolves({ e2e: { private_key: 'a', public_key: 'b' } });
        models.Rooms.findOneById.resolves({ e2eKeyId: '5' });
        models.Subscriptions.find.returns(generateSubs());
        models.Rooms.resetRoomKeyAndSetE2EEQueueByRoomId.resolves({ value: { e2eKeyId: '5' } });
        models.Subscriptions.setE2EKeyByUserIdAndRoomId.resolves({ value: { e2eKeyId: '5' } });
        yield resetRoomKey('1', '2', '3', '4');
        (0, chai_1.expect)(models.Subscriptions.col.bulkWrite.callCount).to.equal(2);
        (0, chai_1.expect)(models.Subscriptions.col.bulkWrite.getCall(0).args[0]).to.have.lengthOf(100);
        (0, chai_1.expect)(models.Subscriptions.col.bulkWrite.getCall(1).args[0]).to.have.lengthOf(50);
    }));
});
