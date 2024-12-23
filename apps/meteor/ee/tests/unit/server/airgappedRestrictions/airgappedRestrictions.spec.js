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
const emitter_1 = require("@rocket.chat/emitter");
const models_1 = require("@rocket.chat/models");
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
let promises = [];
class AirgappedRestriction extends emitter_1.Emitter {
    constructor() {
        super(...arguments);
        this.computeRestriction = sinon_1.default.spy();
        this.isWarningPeriod = sinon_1.default.stub();
    }
    on(type, cb) {
        const newCb = (...args) => {
            promises.push(cb(...args));
        };
        return super.on(type, newCb);
    }
}
const airgappedRestrictionObj = new AirgappedRestriction();
const mocks = {
    sendMessagesToAdmins: ({ msgs }) => {
        msgs({ adminUser: { language: 'pt-br' } });
    },
    settingsUpdate: sinon_1.default.spy(),
    notifySetting: sinon_1.default.spy(),
    i18n: sinon_1.default.spy(),
    findLastToken: sinon_1.default.stub(),
};
const licenseMock = {
    validateCb: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    removeCb: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    onValidateLicense: (cb) => __awaiter(void 0, void 0, void 0, function* () {
        licenseMock.validateCb = cb;
    }),
    onRemoveLicense: (cb) => __awaiter(void 0, void 0, void 0, function* () {
        licenseMock.removeCb = cb;
    }),
};
(0, models_1.registerModel)('IServerEventsModel', {
    insertOne: () => undefined,
    createAuditServerEvent: () => undefined,
});
proxyquire_1.default.noCallThru().load('../../../../app/license/server/airGappedRestrictions.ts', {
    '@rocket.chat/license': {
        AirGappedRestriction: airgappedRestrictionObj,
        License: licenseMock,
    },
    '@rocket.chat/models': {
        Settings: {
            updateValueById: mocks.settingsUpdate,
        },
        Statistics: {
            findLastStatsToken: mocks.findLastToken,
        },
    },
    '../../../../app/lib/server/lib/notifyListener': {
        notifyOnSettingChangedById: mocks.notifySetting,
    },
    '../../../../server/lib/i18n': {
        i18n: {
            t: mocks.i18n,
        },
    },
    '../../../../server/lib/sendMessagesToAdmins': {
        sendMessagesToAdmins: mocks.sendMessagesToAdmins,
    },
});
describe('airgappedRestrictions', () => {
    afterEach(() => {
        Object.values(mocks).forEach((mock) => {
            if ('resetHistory' in mock) {
                mock.resetHistory();
            }
            if ('reset' in mock) {
                mock.reset();
            }
        });
        airgappedRestrictionObj.computeRestriction.resetHistory();
        airgappedRestrictionObj.isWarningPeriod.reset();
        promises = [];
    });
    it('should update setting when restriction is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        airgappedRestrictionObj.emit('remainingDays', { days: -1 });
        yield Promise.all(promises);
        (0, chai_1.expect)(mocks.settingsUpdate.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', -1)).to.be.true;
        (0, chai_1.expect)(mocks.notifySetting.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days')).to.be.true;
        (0, chai_1.expect)(airgappedRestrictionObj.isWarningPeriod.called).to.be.false;
    }));
    it('should update setting when restriction is applied', () => __awaiter(void 0, void 0, void 0, function* () {
        airgappedRestrictionObj.emit('remainingDays', { days: 0 });
        yield Promise.all(promises);
        (0, chai_1.expect)(mocks.settingsUpdate.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', 0)).to.be.true;
        (0, chai_1.expect)(mocks.notifySetting.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days')).to.be.true;
        (0, chai_1.expect)(airgappedRestrictionObj.isWarningPeriod.called).to.be.false;
    }));
    it('should update setting and send rocket.cat message when in warning period', () => __awaiter(void 0, void 0, void 0, function* () {
        airgappedRestrictionObj.emit('remainingDays', { days: 1 });
        airgappedRestrictionObj.isWarningPeriod.returns(true);
        yield Promise.all(promises);
        (0, chai_1.expect)(mocks.settingsUpdate.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days', 1)).to.be.true;
        (0, chai_1.expect)(mocks.notifySetting.calledWith('Cloud_Workspace_AirGapped_Restrictions_Remaining_Days')).to.be.true;
        (0, chai_1.expect)(airgappedRestrictionObj.isWarningPeriod.called).to.be.true;
        (0, chai_1.expect)(mocks.i18n.calledWith('AirGapped_Restriction_Warning', { lng: 'pt-br' }));
    }));
    it('should recompute restriction if license is applied', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.findLastToken.returns('token');
        yield licenseMock.validateCb();
        (0, chai_1.expect)(mocks.findLastToken.calledOnce).to.be.true;
        (0, chai_1.expect)(airgappedRestrictionObj.computeRestriction.calledWith('token')).to.be.true;
    }));
    it('should recompute restriction if license is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        mocks.findLastToken.returns('token');
        yield licenseMock.removeCb();
        (0, chai_1.expect)(mocks.findLastToken.calledOnce).to.be.true;
        (0, chai_1.expect)(airgappedRestrictionObj.computeRestriction.calledWith('token')).to.be.true;
    }));
});
