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
const users_helper_1 = require("../../data/users.helper");
const makeModerationApiRequest = (url, method, data) => __awaiter(void 0, void 0, void 0, function* () {
    let res;
    if (method === 'get') {
        res = yield api_data_1.request.get((0, api_data_1.api)(url)).set(api_data_1.credentials).query(data);
    }
    else if (method === 'post') {
        res = yield api_data_1.request.post((0, api_data_1.api)(url)).set(api_data_1.credentials).send(data);
    }
    return res.body;
});
const reportUser = (userId, reason) => makeModerationApiRequest('moderation.reportUser', 'post', { userId, reason });
const getUsersReports = (userId) => makeModerationApiRequest('moderation.user.reportsByUserId', 'get', { userId });
(0, mocha_1.describe)('[Moderation]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/moderation.reportsByUsers]', () => {
        (0, mocha_1.it)('should return an array of reports', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportsByUsers'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with count and offset params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportsByUsers'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with oldest param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportsByUsers'))
                .set(api_data_1.credentials)
                .query({
                oldest: new Date(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with latest param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportsByUsers'))
                .set(api_data_1.credentials)
                .query({
                latest: new Date(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
    });
    (0, mocha_1.describe)('[/moderation.userReports]', () => {
        (0, mocha_1.it)('should return an array of reports', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.userReports'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with count and offset params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.userReports'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with oldest param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.userReports'))
                .set(api_data_1.credentials)
                .query({
                oldest: new Date(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of reports even requested with latest param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.userReports'))
                .set(api_data_1.credentials)
                .query({
                latest: new Date(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
    });
    // test for testing out the moderation.dismissReports endpoint
    (0, mocha_1.describe)('[/moderation.dismissReports]', () => {
        let reportedMessage;
        let message;
        // post a new message to the channel 'general' by sending a request to chat.postMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: 'GENERAL',
                    msg: 'Sample message 0',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                message = res.body.message;
            });
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.reportMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportsByUsers'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
                reportedMessage = res.body.reports[0];
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should hide reports of a user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.dismissReports'))
                .set(api_data_1.credentials)
                .send({
                userId: reportedMessage.userId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should hide reports of a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.dismissReports'))
                .set(api_data_1.credentials)
                .send({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return an error when the userId && msgId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.dismissReports'))
                .set(api_data_1.credentials)
                .send({
                userId: '',
                msgId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    (0, mocha_1.describe)('[/moderation.user.reportsByUserId]', () => {
        let reportedUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            reportedUser = yield (0, users_helper_1.createUser)();
            yield reportUser(reportedUser._id, 'sample report');
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(reportedUser);
        }));
        (0, mocha_1.it)('should return an array of reports', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.user.reportsByUserId'))
                .set(api_data_1.credentials)
                .query({
                userId: reportedUser._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array').and.to.have.lengthOf(1);
            }));
        }));
        (0, mocha_1.it)('should return an error when the userId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.user.reportsByUserId'))
                .set(api_data_1.credentials)
                .query({
                userId: '',
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            }));
        }));
    });
    (0, mocha_1.describe)('[/moderation.dismissUserReports', () => {
        let reportedUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            reportedUser = yield (0, users_helper_1.createUser)();
            yield reportUser(reportedUser._id, 'sample report');
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(reportedUser);
        }));
        (0, mocha_1.it)('should hide reports of a user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.dismissUserReports'))
                .set(api_data_1.credentials)
                .send({
                userId: reportedUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield getUsersReports(reportedUser._id).then((res) => {
                (0, chai_1.expect)(res.reports).to.have.lengthOf(0);
            });
        }));
        (0, mocha_1.it)('should return an error when the userId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.dismissUserReports'))
                .set(api_data_1.credentials)
                .send({
                userId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    // test for testing out the moderation.reports endpoint
    (0, mocha_1.describe)('[/moderation.reports]', () => {
        let message;
        // post a new message to the channel 'general' by sending a request to chat.postMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: 'general',
                text: 'messageId',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                message = res.body.message;
            });
        }));
        // create a reported message by sending a request to chat.reportMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.reportMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return the reports for a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reports'))
                .set(api_data_1.credentials)
                .query({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an error when the msgId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reports'))
                .set(api_data_1.credentials)
                .query({
                msgId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    // test for testing out the moderation.reportInfo endpoint
    (0, mocha_1.describe)('[/moderation.reportInfo]', () => {
        let message;
        let reportedMessage;
        // post a new message to the channel 'general' by sending a request to chat.postMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: 'general',
                text: 'messageId',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                message = res.body.message;
            });
        }));
        // create a reported message by sending a request to chat.reportMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.reportMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        // get the report information by sending a request to moderation.reports
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reports'))
                .set(api_data_1.credentials)
                .query({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
                reportedMessage = res.body.reports[0];
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return the report information', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportInfo'))
                .set(api_data_1.credentials)
                .query({
                reportId: reportedMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('report').and.to.be.an('object');
                (0, chai_1.expect)(res.body.report).to.have.property('_id', reportedMessage._id);
            });
        }));
        (0, mocha_1.it)('should return an error when the reportId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportInfo'))
                .set(api_data_1.credentials)
                .query({
                reportId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
        (0, mocha_1.it)('should return an error when the reportId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportInfo'))
                .set(api_data_1.credentials)
                .query({
                reportId: 'invalid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
        (0, mocha_1.it)('should return an error when the reportId is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reportInfo'))
                .set(api_data_1.credentials)
                .query({
                reportId: '123456789012345678901234',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    // test for testing out the moderation.user.reportedMessages endpoint
    (0, mocha_1.describe)('[/moderation.user.reportedMessages]', () => {
        let message;
        let reportedMessage;
        // post a new message to the channel 'general' by sending a request to chat.postMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: 'general',
                text: 'messageId',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                message = res.body.message;
            });
        }));
        // create a reported message by sending a request to chat.reportMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.reportMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        // get the report information by sending a request to moderation.reports
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reports'))
                .set(api_data_1.credentials)
                .query({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
                reportedMessage = res.body.reports[0];
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return the message history', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.user.reportedMessages'))
                .set(api_data_1.credentials)
                .query({
                userId: reportedMessage.reportedBy._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an error when the userId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.user.reportedMessages'))
                .set(api_data_1.credentials)
                .query({
                userId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    // test for testing out the moderation.user.deleteReportedMessages endpoint
    (0, mocha_1.describe)('[/moderation.user.deleteReportedMessages]', () => {
        let message;
        let reportedMessage;
        // post a new message to the channel 'general' by sending a request to chat.postMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: 'general',
                text: 'messageId',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
                message = res.body.message;
            });
        }));
        // create a reported message by sending a request to chat.reportMessage
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.reportMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: message._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        // get the report information by sending a request to moderation.reports
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('moderation.reports'))
                .set(api_data_1.credentials)
                .query({
                msgId: message._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('reports').and.to.be.an('array');
                reportedMessage = res.body.reports[0];
            });
        }));
        (0, mocha_1.it)('should delete the message history', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.user.deleteReportedMessages'))
                .set(api_data_1.credentials)
                .send({
                userId: reportedMessage.reportedBy._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return an error when the userId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.user.deleteReportedMessages'))
                .set(api_data_1.credentials)
                .send({
                userId: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.a('string');
            });
        }));
    });
    (0, mocha_1.describe)('[/moderation.reportUser]', () => {
        let userToBeReported;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            userToBeReported = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(userToBeReported);
        }));
        (0, mocha_1.it)('should report an user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.reportUser'))
                .set(api_data_1.credentials)
                .send({
                userId: userToBeReported === null || userToBeReported === void 0 ? void 0 : userToBeReported._id,
                description: 'sample report',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail to report an user if not provided description', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('moderation.reportUser'))
                .set(api_data_1.credentials)
                .send({
                userId: userToBeReported === null || userToBeReported === void 0 ? void 0 : userToBeReported._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
    });
});
