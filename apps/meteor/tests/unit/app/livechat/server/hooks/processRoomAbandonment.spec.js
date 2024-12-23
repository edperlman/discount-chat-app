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
const settingsStub = sinon_1.default.stub();
const models = {
    LivechatDepartment: {
        findOneById: sinon_1.default.stub(),
    },
    LivechatBusinessHours: {
        findOneById: sinon_1.default.stub(),
    },
    Messages: {
        findAgentLastMessageByVisitorLastMessageTs: sinon_1.default.stub(),
    },
    LivechatRooms: {
        setVisitorInactivityInSecondsById: sinon_1.default.stub(),
    },
};
const businessHourManagerMock = {
    getBusinessHour: sinon_1.default.stub(),
};
const { getSecondsWhenOfficeHoursIsDisabled, parseDays, getSecondsSinceLastAgentResponse, onCloseRoom } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../app/livechat/server/hooks/processRoomAbandonment.ts', {
    '@rocket.chat/models': models,
    '../../../../lib/callbacks': {
        callbacks: { add: sinon_1.default.stub(), priority: { HIGH: 'high' } },
    },
    '../../../settings/server': {
        settings: { get: settingsStub },
    },
    '../business-hour': { businessHourManager: businessHourManagerMock },
});
(0, mocha_1.describe)('processRoomAbandonment', () => {
    (0, mocha_1.describe)('getSecondsWhenOfficeHoursIsDisabled', () => {
        (0, mocha_1.it)('should return the seconds since the agents last message till room was closed', () => {
            const room = {
                closedAt: new Date('2024-01-01T12:00:10Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T12:00:00Z'),
            };
            const result = getSecondsWhenOfficeHoursIsDisabled(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(10);
        });
        (0, mocha_1.it)('should return the seconds since agents last message till now when room.closedAt is undefined', () => {
            const room = {
                closedAt: undefined,
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = getSecondsWhenOfficeHoursIsDisabled(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(10);
        });
    });
    (0, mocha_1.describe)('parseDays', () => {
        (0, mocha_1.it)('should properly return the days in the expected format', () => {
            const days = [
                {
                    day: 'Monday',
                    start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                    open: true,
                },
                {
                    day: 'Tuesday',
                    start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                    open: true,
                },
                {
                    day: 'Wednesday',
                    start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                    open: true,
                },
            ];
            const result = days.reduce(parseDays, {});
            (0, chai_1.expect)(result).to.be.deep.equal({
                Monday: {
                    start: { day: 'Monday', time: '10:00' },
                    finish: { day: 'Monday', time: '11:00' },
                    open: true,
                },
                Tuesday: {
                    start: { day: 'Tuesday', time: '10:00' },
                    finish: { day: 'Tuesday', time: '11:00' },
                    open: true,
                },
                Wednesday: {
                    start: { day: 'Wednesday', time: '10:00' },
                    finish: { day: 'Wednesday', time: '11:00' },
                    open: true,
                },
            });
        });
        (0, mocha_1.it)('should properly parse open/close days', () => {
            const days = [
                {
                    day: 'Monday',
                    start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                    open: true,
                },
                {
                    day: 'Tuesday',
                    start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                    open: false,
                },
                {
                    day: 'Wednesday',
                    start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                    finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                    open: true,
                },
            ];
            const result = days.reduce(parseDays, {});
            (0, chai_1.expect)(result).to.be.deep.equal({
                Monday: {
                    start: { day: 'Monday', time: '10:00' },
                    finish: { day: 'Monday', time: '11:00' },
                    open: true,
                },
                Tuesday: {
                    start: { day: 'Tuesday', time: '10:00' },
                    finish: { day: 'Tuesday', time: '11:00' },
                    open: false,
                },
                Wednesday: {
                    start: { day: 'Wednesday', time: '10:00' },
                    finish: { day: 'Wednesday', time: '11:00' },
                    open: true,
                },
            });
        });
    });
    (0, mocha_1.describe)('getSecondsSinceLastAgentResponse', () => {
        beforeEach(() => {
            settingsStub.reset();
            models.LivechatDepartment.findOneById.reset();
            models.LivechatBusinessHours.findOneById.reset();
            businessHourManagerMock.getBusinessHour.reset();
        });
        (0, mocha_1.it)('should return the seconds since agent last message when Livechat_enable_business_hours is false', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(false);
            const room = {
                closedAt: undefined,
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(10);
        }));
        (0, mocha_1.it)('should return the seconds since last agent message when room has a department but department has an invalid business hour attached', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            models.LivechatDepartment.findOneById.withArgs('departmentId').resolves({
                businessHourId: 'businessHourId',
            });
            models.LivechatBusinessHours.findOneById.withArgs('businessHourId').resolves(null);
            const room = {
                closedAt: undefined,
                departmentId: 'departmentId',
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(models.LivechatDepartment.findOneById.calledWith(room.departmentId)).to.be.true;
            (0, chai_1.expect)(result).to.be.equal(10);
        }));
        (0, mocha_1.it)('should return the seconds since last agent message when department has a valid business hour but business hour doest have work hours', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            models.LivechatDepartment.findOneById.withArgs('departmentId').resolves({
                businessHourId: 'businessHourId',
            });
            models.LivechatBusinessHours.findOneById.withArgs('businessHourId').resolves({
                workHours: [],
            });
            businessHourManagerMock.getBusinessHour.withArgs('businessHourId').resolves(null);
            const room = {
                closedAt: undefined,
                departmentId: 'departmentId',
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(10);
        }));
        (0, mocha_1.it)('should return the seconds since last agent message when department has a valid business hour but business hour workhours is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            models.LivechatDepartment.findOneById.withArgs('departmentId').resolves({
                businessHourId: 'businessHourId',
            });
            models.LivechatBusinessHours.findOneById.withArgs('businessHourId').resolves({
                workHours: [],
            });
            businessHourManagerMock.getBusinessHour.withArgs('businessHourId').resolves({
                workHours: [],
            });
            const room = {
                closedAt: undefined,
                departmentId: 'departmentId',
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(10);
        }));
        (0, mocha_1.it)('should get the data from the default business hour when room has no department attached and return the seconds since last agent message when default bh has no workhours', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [],
            });
            const room = {
                closedAt: undefined,
            };
            const agentLastMessage = {
                ts: new Date(new Date().getTime() - 10000),
            };
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(models.LivechatDepartment.findOneById.called).to.be.false;
            (0, chai_1.expect)(models.LivechatBusinessHours.findOneById.called).to.be.false;
            (0, chai_1.expect)(businessHourManagerMock.getBusinessHour.called).to.be.true;
            (0, chai_1.expect)(businessHourManagerMock.getBusinessHour.getCall(0).args.length).to.be.equal(0);
            (0, chai_1.expect)(result).to.be.equal(10);
        }));
        (0, mocha_1.it)('should return the proper number of seconds the room was inactive considering business hours (inactive same day)', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-01T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(3600);
        }));
        (0, mocha_1.it)('should return the proper number of seconds the room was inactive considering business hours (inactive same day)', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-01T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '23:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(7200);
        }));
        (0, mocha_1.it)('should return 0 if a room happened to be inactive on a day outside of business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-03T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-03T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(0);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room was inactive for more than 1 day', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-03T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(7200);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room was inactive for more than 1 day, and one of those days was a closed day', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-03T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: false,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(7200);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room was inactive for more than 1 day and one of those days is not in configuration', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-03T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(7200);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room has been inactive for more than a week', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-10T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Wednesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Wednesday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Thursday',
                        start: { utc: { dayOfWeek: 'Thursday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Thursday', time: '11:00' } },
                        open: false,
                    },
                    {
                        day: 'Saturday',
                        start: { utc: { dayOfWeek: 'Friday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Friday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Sunday',
                        start: { utc: { dayOfWeek: 'Saturday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Saturday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(28800);
        }));
        (0, mocha_1.it)('should return 0 when room was inactive in the same day but the configuration for bh on that day is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-01T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T00:00:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: undefined } },
                        finish: { utc: { dayOfWeek: 'Monday', time: undefined } },
                        open: true,
                    },
                    {
                        day: 'Wednesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: false,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(0);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room has been inactive for more than a day but the inactivity started after BH started', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-02T12:00:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T10:15:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(6300);
        }));
        (0, mocha_1.it)('should return the proper number of seconds when a room was inactive between a BH start and end', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsStub.withArgs('Livechat_enable_business_hours').returns(true);
            const room = {
                closedAt: new Date('2024-01-01T10:50:00Z'),
            };
            const agentLastMessage = {
                ts: new Date('2024-01-01T10:15:00Z'),
            };
            businessHourManagerMock.getBusinessHour.resolves({
                workHours: [
                    {
                        day: 'Monday',
                        start: { utc: { dayOfWeek: 'Monday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Monday', time: '11:00' } },
                        open: true,
                    },
                    {
                        day: 'Tuesday',
                        start: { utc: { dayOfWeek: 'Tuesday', time: '10:00' } },
                        finish: { utc: { dayOfWeek: 'Tuesday', time: '11:00' } },
                        open: true,
                    },
                ],
            });
            const result = yield getSecondsSinceLastAgentResponse(room, agentLastMessage);
            (0, chai_1.expect)(result).to.be.equal(2100);
        }));
    });
    (0, mocha_1.describe)('onCloseRoom', () => {
        beforeEach(() => {
            models.Messages.findAgentLastMessageByVisitorLastMessageTs.reset();
        });
        (0, mocha_1.it)('should skip the hook if room is not an omnichannel room', () => __awaiter(void 0, void 0, void 0, function* () {
            const param = { room: { t: 'd' } };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.called).to.be.false;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
        (0, mocha_1.it)('should skip if room was not closed by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const param = { room: { t: 'l' }, closer: 'visitor' };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.called).to.be.false;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
        (0, mocha_1.it)('should skip if the last message on room was not from an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const param = { room: { t: 'l' }, closer: 'user', lastMessage: { token: 'xxxx' } };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.called).to.be.false;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
        (0, mocha_1.it)('should skip if the last message is not on db', () => __awaiter(void 0, void 0, void 0, function* () {
            models.Messages.findAgentLastMessageByVisitorLastMessageTs.resolves(null);
            const param = { room: { _id: 'xyz', t: 'l', v: { lastMessageTs: new Date() }, closer: 'user', lastMessage: { msg: 'test' } } };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.calledWith('xyz', param.room.v.lastMessageTs)).to.be.true;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
        (0, mocha_1.it)('should skip if the visitor has not send any messages', () => __awaiter(void 0, void 0, void 0, function* () {
            models.Messages.findAgentLastMessageByVisitorLastMessageTs.resolves({ ts: undefined });
            const param = { room: { _id: 'xyz', t: 'l', v: { token: 'xfasfdsa' }, closer: 'user', lastMessage: { msg: 'test' } } };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.called).to.be.false;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
        (0, mocha_1.it)('should set the visitor inactivity in seconds when all params are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            models.Messages.findAgentLastMessageByVisitorLastMessageTs.resolves({ ts: new Date('2024-01-01T10:15:00Z') });
            settingsStub.withArgs('Livechat_enable_business_hours').returns(false);
            const param = {
                room: {
                    _id: 'xyz',
                    t: 'l',
                    v: { lastMessageTs: new Date() },
                    closedAt: new Date('2024-01-01T10:50:00Z'),
                    closer: 'user',
                    lastMessage: { msg: 'test' },
                },
            };
            const r = yield onCloseRoom(param);
            (0, chai_1.expect)(models.Messages.findAgentLastMessageByVisitorLastMessageTs.calledWith('xyz', param.room.v.lastMessageTs)).to.be.true;
            (0, chai_1.expect)(models.LivechatRooms.setVisitorInactivityInSecondsById.calledWith('xyz', 2100)).to.be.true;
            (0, chai_1.expect)(r).to.be.equal(param);
        }));
    });
});
