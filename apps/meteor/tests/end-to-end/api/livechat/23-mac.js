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
const moment_1 = __importDefault(require("moment"));
const api_data_1 = require("../../../data/api-data");
const rooms_1 = require("../../../data/livechat/rooms");
(0, mocha_1.describe)('MAC', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
    }));
    (0, mocha_1.describe)('MAC rooms', () => {
        let visitor;
        (0, mocha_1.it)('Should create an innactive room by default', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.be.an('object');
            (0, chai_1.expect)(room.v.activity).to.be.undefined;
        }));
        (0, mocha_1.it)('should mark room as active when agent sends a message', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendAgentMessage)(room._id);
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.have.nested.property('v.activity').and.to.be.an('array');
        }));
        (0, mocha_1.it)('should mark multiple rooms as active when they come from same visitor after an agent sends a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendAgentMessage)(room._id);
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.have.nested.property('v.activity').and.to.be.an('array');
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
        }));
        (0, mocha_1.it)('should mark room as active when it comes from same visitor on same period, even without agent interaction', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            (0, chai_1.expect)(room).to.have.nested.property('v.activity').and.to.be.an('array');
            (0, chai_1.expect)((_a = room.v.activity) === null || _a === void 0 ? void 0 : _a.includes(moment_1.default.utc().format('YYYY-MM'))).to.be.true;
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
        }));
        (0, mocha_1.it)('should mark an inquiry as active when it comes from same visitor on same period, even without agent interaction', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inquiry = yield (0, rooms_1.fetchInquiry)(room._id);
            (0, chai_1.expect)(inquiry).to.have.nested.property('v.activity').and.to.be.an('array');
            (0, chai_1.expect)((_a = inquiry.v.activity) === null || _a === void 0 ? void 0 : _a.includes(moment_1.default.utc().format('YYYY-MM'))).to.be.true;
            (0, chai_1.expect)((_b = room.v.activity) === null || _b === void 0 ? void 0 : _b.includes(moment_1.default.utc().format('YYYY-MM'))).to.be.true;
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
        }));
        (0, mocha_1.it)('visitor should be marked as active for period', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/visitors.info'))
                .query({ visitorId: visitor._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.nested.property('visitor').and.to.be.an('object');
            (0, chai_1.expect)(body.visitor).to.have.nested.property('activity').and.to.be.an('array');
            (0, chai_1.expect)(body.visitor.activity).to.have.lengthOf(1);
            (0, chai_1.expect)(body.visitor.activity[0]).to.equal(moment_1.default.utc().format('YYYY-MM'));
        }));
    });
});
