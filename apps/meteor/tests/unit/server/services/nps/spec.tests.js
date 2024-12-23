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
const modelsMock = {
    'NpsVote': {},
    'Nps': {
        findOne: sinon_1.default.stub(),
        save: sinon_1.default.stub(),
    },
    'Settings': {
        getValueById: sinon_1.default.stub(),
    },
    '@noCallThru': true,
};
const servicesMock = {
    Banner: {
        create: sinon_1.default.stub(),
    },
};
const getbannerforadminsMock = sinon_1.default.stub();
const { NPSService } = (0, proxyquire_1.default)('../../../../../server/services/nps/service.ts', {
    '@rocket.chat/models': modelsMock,
    '@rocket.chat/core-services': servicesMock,
    './sendNpsResults': { 'sendNpsResults': sinon_1.default.stub(), '@noCallThru': true },
    '../../lib/logger/system': { 'SystemLogger': { error: sinon_1.default.stub() }, '@noCallThru': true },
    './notification': { 'notifyAdmins': sinon_1.default.stub(), 'getBannerForAdmins': getbannerforadminsMock, '@noCallThru': true },
});
(0, mocha_1.describe)('NPS Service', () => {
    (0, mocha_1.it)('should instantiate properly', () => {
        (0, chai_1.expect)(new NPSService()).to.be.an('object');
    });
    (0, mocha_1.describe)('@create', () => {
        beforeEach(() => {
            modelsMock.Settings.getValueById.reset();
            modelsMock.Nps.findOne.reset();
            modelsMock.Nps.save.reset();
            servicesMock.Banner.create.reset();
            getbannerforadminsMock.reset();
        });
        (0, mocha_1.it)('should fail when user opted out of nps', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.Settings.getValueById.withArgs('NPS_survey_enabled').resolves(false);
            yield (0, chai_1.expect)(new NPSService().create({})).to.be.rejectedWith('Server opted-out for NPS surveys');
        }));
        (0, mocha_1.it)('should fail when nps expireDate is less than nps startAt', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.Settings.getValueById.withArgs('NPS_survey_enabled').resolves(true);
            modelsMock.Nps.findOne.resolves(null);
            yield (0, chai_1.expect)(new NPSService().create({ expireAt: new Date('2020-01-01'), startAt: new Date('2020-01-02') })).to.be.rejectedWith('NPS already expired');
        }));
        (0, mocha_1.it)('should fail when expireDate is less than current date', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.Settings.getValueById.withArgs('NPS_survey_enabled').resolves(true);
            modelsMock.Nps.findOne.resolves(null);
            yield (0, chai_1.expect)(new NPSService().create({ expireAt: new Date('2020-01-02'), startAt: new Date('2020-01-01') })).to.be.rejectedWith('NPS already expired');
        }));
        (0, mocha_1.it)('should try to create a banner when theres no nps saved', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.Settings.getValueById.withArgs('NPS_survey_enabled').resolves(true);
            modelsMock.Nps.findOne.resolves(null);
            const today = new Date();
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            yield new NPSService().create({
                expireAt: tomorrow,
                startAt: today,
                createdBy: { _id: 'tomorrow', username: 'tomorrow' },
                npsId: 'test',
            });
            (0, chai_1.expect)(getbannerforadminsMock.called).to.be.true;
            (0, chai_1.expect)(getbannerforadminsMock.calledWith(tomorrow)).to.be.true;
            (0, chai_1.expect)(modelsMock.Nps.save.called).to.be.true;
            (0, chai_1.expect)(modelsMock.Nps.save.calledWith(sinon_1.default.match({
                expireAt: tomorrow,
                startAt: today,
                status: 'open',
                _id: 'test',
                createdBy: { _id: 'tomorrow', username: 'tomorrow' },
            }))).to.be.true;
        }));
        (0, mocha_1.it)('should fail if theres an error when saving the Nps', () => __awaiter(void 0, void 0, void 0, function* () {
            modelsMock.Settings.getValueById.withArgs('NPS_survey_enabled').resolves(true);
            modelsMock.Nps.findOne.resolves({ _id: 'test' });
            modelsMock.Nps.save.rejects();
            yield (0, chai_1.expect)(new NPSService().create({})).to.be.rejectedWith('Error creating NPS');
        }));
    });
});
