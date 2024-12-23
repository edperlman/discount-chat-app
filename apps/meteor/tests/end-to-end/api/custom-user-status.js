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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
function createCustomUserStatus(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield api_data_1.request.post((0, api_data_1.api)('custom-user-status.create')).set(api_data_1.credentials).send({ name }).expect(200);
        return res.body.customUserStatus._id;
    });
}
function deleteCustomUserStatus(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request.post((0, api_data_1.api)('custom-user-status.delete')).set(api_data_1.credentials).send({ customUserStatusId: id }).expect(200);
    });
}
(0, mocha_1.describe)('[CustomUserStatus]', () => {
    (0, mocha_1.before)((done) => {
        (0, api_data_1.getCredentials)(done);
    });
    (0, mocha_1.describe)('[/custom-user-status.list]', () => {
        let customUserStatusId;
        let customUserStatusName;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            customUserStatusName = `test-${Date.now()}`;
            customUserStatusId = yield createCustomUserStatus(customUserStatusName);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield deleteCustomUserStatus(customUserStatusId);
        }));
        (0, mocha_1.it)('should return custom user status', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-user-status.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('statuses').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return custom user status even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-user-status.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                count: 5,
                offset: 0,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('statuses').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return one custom user status when requested with id param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-user-status.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                _id: customUserStatusId,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('statuses').and.to.be.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.equal(1);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return empty array when requested with an existing name param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-user-status.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                name: customUserStatusName,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('statuses').and.to.be.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.equal(1);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return empty array when requested with unknown name param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('custom-user-status.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .query({
                name: 'testxxx',
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('statuses').and.to.be.an('array').and.to.have.lengthOf(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.equal(0);
            })
                .end(done);
        });
    });
});
